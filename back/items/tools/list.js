import onetype from '@onetype/framework';
import agents from '#agents/addon.js';

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'agents:list',
		name: 'List agents',
		description: 'Lists every agent available in this instance, one per line as id | description. Call it to learn who exists before delegating.',
		isGlobal: true,
		input: {},
		callback: function()
		{
			const items = Object.values(agents.Items());

			if(!items.length)
			{
				return 'No agents are registered.';
			}

			return items.map((agent) => agent.Get('id') + ' | ' + agent.Get('description')).join('\n');
		}
	});
});
