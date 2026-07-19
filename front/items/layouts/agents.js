onetype.AddonReady('ui.layouts', (layouts) =>
{
	layouts.Item({
		id: 'agents-grid',
		isActive: true,
		condition: { app: ['agents'] },
		zone: 'root',
		slot: 'center',
		render: function()
		{
			return /* html */ `
				<div class="ot-container-full ot-py-l ot-dots ot-fill">
					<e-agents-tree></e-agents-tree>
				</div>
			`;
		}
	});
});
