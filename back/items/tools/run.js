import onetype from '@onetype/framework';

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'agents:run',
		name: 'Run agent',
		description: 'Runs another agent. research asks a question and returns a precise answer, task gives instructions and returns a report of what was done.',
		isGlobal: true,
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
		callback: function()
		{
			return 'Running agents is not wired yet — tell the user the delegation layer is still being built.';
		}
	});
});
