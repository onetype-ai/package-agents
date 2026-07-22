onetype.AddonReady('ui.apps', (apps) =>
{
    apps.Item({
        id: 'agents',
        name: 'Agents',
        icon: 'hub',
        color: 'rgba(56, 189, 248, 1)',
        description: 'The agents of the instance. Every specialist that thinks and works here, with its instructions and tools.',
        order: 3
    });
});
