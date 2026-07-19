import commands from '@onetype/framework/commands';
import agents from '#agents/addon.js';

commands.Item({
	id: 'agents:many',
	exposed: true,
	method: 'GET',
	endpoint: '/api/agents',
	description: 'Lists every registered agent with its description and tools.',
	metadata: { addon: 'agents' },
	condition: function()
	{
		if(!this.http || !this.http.state.user)
		{
			return 'Sign in to use agents.';
		}
	},
	out: {
		agents: {
			type: 'array',
			each: {
				type: 'object',
				config: 'agents.agent'
			},
			description: 'The registered agents.'
		}
	},
	callback: function(properties, resolve)
	{
		const items = Object.values(agents.Items()).map((agent) => ({
			id: agent.Get('id'),
			name: agent.Get('name'),
			description: agent.Get('description'),
			instructions: agent.Get('instructions'),
			tools: agent.Get('tools') || [],
			parent: agent.Get('parent') || '',
			persona: agent.Get('persona') || null
		}));

		resolve({ agents: items });
	}
});
