import commands from '@onetype/framework/commands';
import orchestration from '#orchestration/addon.js';

commands.Item({
	id: 'orchestration:runs:many',
	exposed: true,
	method: 'GET',
	endpoint: '/api/orchestration/runs',
	description: 'Lists the latest runs, newest first.',
	metadata: { addon: 'orchestration.runs' },
	condition: function()
	{
		if(!this.http || !this.http.state.user)
		{
			return 'Sign in to view runs.';
		}
	},
	out: {
		runs: {
			type: 'array',
			each: {
				type: 'object',
				config: 'orchestration.run'
			},
			description: 'The latest runs, newest first.'
		}
	},
	callback: async function(properties, resolve)
	{
		const rows = await orchestration.runs.Find().sort('id', 'desc').limit(100).plain();

		resolve({ runs: rows.map((row) => ({ ...row, steps: JSON.parse(row.steps || '[]') })) });
	}
});
