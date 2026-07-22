onetype.AddonReady('ui.screens', (screens) =>
{
    screens.Item({
        id: 'agents.agent',
        route: '/agents/:id',
        app: 'agents',
        metadata: { addon: 'agents' },
        data: function()
        {
            return { agentId: this.id };
        }
    });
});
