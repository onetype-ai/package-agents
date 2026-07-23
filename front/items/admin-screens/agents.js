onetype.AddonReady('admin.screens', (screens) =>
{
    screens.Item({
        id: 'agents',
        route: '/agents',
        app: 'agents',
        isDefault: true,
        metadata: { addon: 'agents' }
    });
});
