import commands from 'addon-commands';
import agents from '#agents/addon.js';

commands.Item({
    id: 'agents:providers:many',
    exposed: true,
    method: 'GET',
    endpoint: '/api/agents/providers',
    description: 'Lists every registered provider with its models.',
    metadata: { addon: 'agents.providers' },
    condition: function()
    {
        if(!this.http || !this.http.state.user)
        {
            return 'Sign in to use agents.';
        }
    },
    out: {
        providers: {
            type: 'array',
            each: {
                type: 'object',
                config: 'agents.provider'
            },
            description: 'The registered providers.'
        }
    },
    callback: function(properties, resolve)
    {
        const providers = Object.values(agents.providers.Items()).map((provider) => ({
            id: provider.Get('id'),
            name: provider.Get('name'),
            description: provider.Get('description'),
            endpoint: provider.Get('endpoint'),
            models: provider.Get('models') || []
        }));

        resolve({ providers });
    }
});
