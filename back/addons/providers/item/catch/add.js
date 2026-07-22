import agents from '#agents/addon.js';

onetype.AddonReady('agents.providers', (providers) =>
{
    providers.ItemOn('add', (item) =>
    {
        onetype.AddonReady('vault.keys', (keys) =>
        {
            keys.Item({
                key: providers.Fn('key', item, 'ENDPOINT'),
                name: item.Get('name') + ' Endpoint',
                description: 'Base URL of the ' + item.Get('name') + ' API.',
                category: 'agents',
                group: item.Get('name'),
                value: item.Get('endpoint')
            });

            keys.Item({
                key: providers.Fn('key', item, 'API_KEY'),
                name: item.Get('name') + ' API Key',
                description: 'Key for the ' + item.Get('name') + ' API. Leave empty when the endpoint needs none.',
                category: 'agents',
                group: item.Get('name'),
                secret: true
            });
        });
    });
});
