import agents from '#agents/addon.js';

/*
	Every agent is a tool. Registering an agent registers a matching
	agent:<id> tool, so callers see their delegates directly in the tool
	list — descriptions upfront, no list roundtrip, no way to run an
	agent that does not exist. Who sees which agent tool is decided in
	tools.Fn('for'): children for their parent, parentless agents for
	everyone.
*/

const register = (item) =>
{
	const id = item.Get('id');

	agents.tools.Item({
		id: 'agent:' + id,
		name: item.Get('name'),
		description: item.Get('description') + ' This is an agent: it starts blank and sees only its own domain, so the input must carry every id, name and fact it needs.',
		metadata: { agent: id },
		input: {
			mode: {
				type: 'string',
				required: true,
				description: 'research to ask it a question, task to have it do something.'
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

			if(chain.includes(id))
			{
				return 'Agent ' + id + ' is already running in this chain, do not call it again.';
			}

			if(chain.length >= 4)
			{
				return 'The delegation chain is too deep, solve this yourself or report back.';
			}

			const result = await agents.Fn('run', {
				agent: id,
				mode: input.mode === 'research' ? 'research' : 'task',
				messages: [{ role: 'user', text: input.input }],
				context: this
			});

			return result.text;
		}
	});
};

onetype.AddonReady('agents.tools', () =>
{
	onetype.AddonReady('agents', () =>
	{
		Object.values(agents.Items()).forEach(register);

		agents.ItemOn('add', register);
	});
});
