import commands from '@onetype/framework/commands';
import agents from '#agents/addon.js';

commands.Item({
    id: 'agents:tools:many',
    exposed: true,
    method: 'GET',
    endpoint: '/api/agents/tools',
    description: 'Lists every registered tool with its input fields.',
    metadata: { addon: 'agents.tools' },
    condition: function()
    {
        if(!this.http || !this.http.state.user)
        {
            return 'Sign in to use agents.';
        }
    },
    out: {
        tools: {
            type: 'array',
            each: {
                type: 'object',
                config: 'agents.tool'
            },
            description: 'The registered tools.'
        }
    },
    callback: function(properties, resolve)
    {
        const tools = Object.values(agents.tools.Items()).map((tool) => ({
            id: tool.Get('id'),
            name: tool.Get('name'),
            description: tool.Get('description'),
            input: tool.Get('input') || {},
            isGlobal: tool.Get('isGlobal') || false,
            command: tool.Get('command') || null
        }));

        resolve({ tools });
    }
});
