onetype.AddonReady('admin.layouts', (layouts) =>
{
    layouts.Item({
        id: 'agents.agents',
        isActive: true,
        screen: ['agents'],
        zone: 'root',
        slot: 'center',
        render: function()
        {
            this.jump = () => ({ value }) =>
            {
                $ot.page('/agents/' + value.id);
            };

            return `
                <div class="ot-container-full ot-py-l ot-dots ot-fill">
                    <e-agents-graph :_open="jump()"></e-agents-graph>
                </div>
            `;
        }
    });
});
