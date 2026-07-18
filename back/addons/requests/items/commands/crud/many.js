import commands from '@onetype/framework/commands';
import agents from '#agents/addon.js';

commands.Item({
	id: 'agents:requests:many',
	exposed: true,
	method: 'GET',
	endpoint: '/api/agents/requests',
	description: 'Lists the latest model requests with their usage and cost, newest first.',
	metadata: { addon: 'agents.requests' },
	condition: function()
	{
		if(!this.http || !this.http.state.user)
		{
			return 'Sign in to view requests.';
		}
	},
	out: {
		requests: {
			type: 'array',
			each: {
				type: 'object',
				config: 'agents.request'
			},
			description: 'The latest requests, newest first.'
		}
	},
	callback: async function(properties, resolve)
	{
		const requests = await agents.requests.Find().sort('id', 'desc').limit(100).plain();

		resolve({ requests });
	}
});
