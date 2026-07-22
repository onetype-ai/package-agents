import agents from '#agents/addon.js';

/*
    The executor. Takes an agent and a mode, loops the client and the
    tools until the agent stops talking to tools, returns what it said.

    In:  { agent, mode: 'conversation' | 'research' | 'task', messages, context, caller, model }
    Out: { text, reasoning, messages, steps: [{ tool, input, output }] }
*/

agents.Fn('run', async function({ agent, mode = 'task', messages = [], context = {}, caller = null, model = null })
{
    const item = this.ItemGet(agent);

    if(!item)
    {
        throw onetype.Error(404, 'Agent :id: is not registered.', { id: agent });
    }

    const framings = {
        conversation: 'You are talking to the user directly. Reply naturally, in the language the user writes in.',
        research: 'You are answering a question. Use your tools to find the exact answer, then reply with the answer only — precise and factual, no filler.',
        task: 'You are executing a task. Use your tools to complete it, then reply with a short report of what was done.'
    };

    context = Object.assign(Object.create(context), { _agents: [...(context._agents || []), agent] });

    const system = [item.Get('instructions') || '', framings[mode] || framings.task].filter(Boolean).join('\n\n');
    const tools = this.tools.Fn('for', item).map((tool) => this.tools.Fn('definition', tool));
    const steps = [];
    const thoughts = [];

    let text = '';

    for(let round = 0; round < 24; round++)
    {
        const response = await this.Fn('client', {
            model: model || item.Get('model'),
            system,
            messages,
            tools,
            metadata: item.Get('metadata'),
            caller: caller || agent
        });

        messages.push({ role: 'assistant', text: response.text, calls: response.calls, reasoning: response.reasoning });

        text = response.text;
        response.reasoning && thoughts.push(response.reasoning);

        if(response.stop !== 'tools' || !response.calls.length)
        {
            break;
        }

        for(const call of response.calls)
        {
            /* The trace entry lands before the tool runs — anyone watching
               the trace sees the step as active until output arrives. */
            const entry = { agent, tool: call.name, input: call.input, output: null };

            context._trace && context._trace.push(entry);

            let output;

            try
            {
                output = await this.tools.Fn('run', call.name, call.input, context);
            }
            catch(error)
            {
                output = 'Error: ' + error.message;
            }

            output = typeof output === 'string' ? output : JSON.stringify(output ?? null);

            entry.output = output;
            steps.push({ tool: call.name, input: call.input, output });
            messages.push({ role: 'tool', id: call.id, output });
        }
    }

    return { text, reasoning: thoughts.join('\n\n'), messages, steps };
});
