import onetype from '@onetype/framework';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'test:time',
		name: 'Current time',
		description: 'Returns the current date and time of the instance.',
		isGlobal: true,
		input: {},
		callback: function()
		{
			return new Date().toString();
		}
	});
});
