import agents from '#agents/addon.js';

agents.tools.Fn('for', function(agent)
{
	const listed = agent.Get('tools') || [];

	return Object.values(this.Items()).filter((tool) =>
	{
		return tool.Get('isGlobal') || listed.includes(tool.Get('id'));
	});
});
