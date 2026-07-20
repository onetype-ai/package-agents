import onetype from '@onetype/framework';
import agents from '#agents/addon.js';

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'agents:run',
		name: 'Run agent',
		description: 'Runs another agent. research asks a question and returns a precise answer, task gives instructions and returns a report of what was done.',
		isGlobal: false,
		input: {
			agent: {
				type: 'string',
				required: true,
				description: 'Id of the agent to run, from the agents list.'
			},
			mode: {
				type: 'string',
				required: true,
				description: 'research or task.'
			},
			input: {
				type: 'string',
				required: true,
				description: 'The question or the instructions, with all context the agent needs.'
			}
		},
		callback: async function(input)
		{
			const chain = this._agents || [];
			const caller = chain[chain.length - 1] || null;

			const target = agents.ItemGet(input.agent);

			if(!target)
			{
				return 'Agent ' + input.agent + ' is not registered.';
			}

			if(target.Get('isHidden') || (target.Get('parent') || null) !== caller)
			{
				return 'Agent ' + input.agent + ' is not one of yours to run.';
			}

			if(chain.includes(input.agent))
			{
				return 'Agent ' + input.agent + ' is already running in this chain, do not call it again.';
			}

			if(chain.length >= 4)
			{
				return 'The delegation chain is too deep, solve this yourself or report back.';
			}

			const result = await agents.Fn('run', {
				agent: input.agent,
				mode: input.mode === 'research' ? 'research' : 'task',
				messages: [{ role: 'user', text: input.input }],
				context: this
			});

			return result.text || 'The agent finished without a reply.';
		}
	});
});
