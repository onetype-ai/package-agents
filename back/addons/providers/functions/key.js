import agents from '#agents/addon.js';

agents.providers.Fn('key', function(item, suffix)
{
    return 'AGENTS_' + item.Get('id').toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_' + suffix;
});
