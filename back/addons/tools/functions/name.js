import agents from '#agents/addon.js';

agents.tools.Fn('name', function(tool)
{
    return tool.Get('id').replace(/[^a-zA-Z0-9_-]/g, '_');
});
