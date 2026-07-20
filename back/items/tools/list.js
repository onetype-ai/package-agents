import onetype from '@onetype/framework';
import agents from '#agents/addon.js';

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'agents:list',
		name: 'List agents',
		description: 'Lists every agent you may delegate to, one per line as id | description. Call it to learn who exists before delegating.',
		isGlobal: false,
		input: {},
		callback: function()
		{
			const chain = this._agents || [];
			const caller = chain[chain.length - 1] || null;

			const items = Object.values(agents.Items()).filter((agent) => (agent.Get('parent') || null) === caller && !agent.Get('isHidden'));

			if(!items.length)
			{
				return 'No agents are registered.';
			}

			return items.map((agent) => agent.Get('id') + ' | ' + agent.Get('description')).join('\n');
		}
	});
});
