onetype.AddonReady('ui.layouts', (layouts) =>
{
	layouts.Item({
		id: 'agents-agent',
		isActive: true,
		screen: ['agents.agent'],
		zone: 'root',
		slot: 'center',
		render: function()
		{
			return `<e-agents-agent :id="agentId"></e-agents-agent>`;
		}
	});
});
