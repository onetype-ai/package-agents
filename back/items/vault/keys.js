onetype.AddonReady('vault.categories', (categories) =>
{
    categories.Item({
        id: 'agents',
        name: 'Agents',
        description: 'Model providers the agents run on.',
        icon: 'hub',
        order: 1
    });
});

onetype.AddonReady('vault.keys', (keys) =>
{
    keys.Item({
        key: 'AGENTS_MODEL',
        name: 'Default Model',
        description: 'The model agents run on unless they override it, as provider/model.',
        category: 'agents',
        group: 'Agents',
        value: 'local/qwen3.5-9b'
    });
});
