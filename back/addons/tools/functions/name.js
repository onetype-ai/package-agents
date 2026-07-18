import orchestration from '#orchestration/addon.js';

orchestration.tools.Fn('name', function(tool)
{
	return tool.Get('id').replace(/[^a-zA-Z0-9_-]/g, '_');
});
