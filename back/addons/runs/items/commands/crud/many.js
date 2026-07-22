import commands from '@onetype/framework/commands';
import agents from '#agents/addon.js';

commands.Item({
    id: 'agents:runs:many',
    exposed: true,
    method: 'GET',
    endpoint: '/api/agents/runs',
    description: 'Lists the latest runs, newest first.',
    metadata: { addon: 'agents.runs' },
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
                config: 'agents.run'
            },
            description: 'The latest runs, newest first.'
        }
    },
    callback: async function(properties, resolve)
    {
        const rows = await agents.runs.Find().sort('id', 'desc').limit(100).plain();

        resolve({ runs: rows.map((row) => ({ ...row, steps: JSON.parse(row.steps || '[]') })) });
    }
});
