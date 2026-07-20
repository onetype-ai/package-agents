import agents from '#agents/addon.js';

agents.tools.Fn('for', function(agent)
{
	const listed = agent.Get('tools') || [];

	return Object.values(this.Items()).filter((tool) =>
	{
		if(tool.Get('isGlobal') || listed.includes(tool.Get('id')))
		{
			return true;
		}

		/* Agent tools: strictly a child belonging to its parent — anything
		   looser lets agents delegate sideways and loop. */
		const delegate = tool.Get('metadata')?.agent && agents.ItemGet(tool.Get('metadata').agent);

		if(!delegate || delegate.Get('isHidden'))
		{
			return false;
		}

		return (delegate.Get('parent') || null) === agent.Get('id');
	});
});
