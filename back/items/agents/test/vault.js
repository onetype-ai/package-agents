import onetype from '@onetype/framework';

/* Temporary test agent — delete once the vault package ships its own. */

onetype.AddonReady('agents', (agents) =>
{
	agents.Item({
		id: 'vault',
		name: 'Vault',
		description: 'Knows the credentials of the instance — which keys exist, which are filled, and can store or clear values.',
		instructions: 'You manage the vault of this OneType instance: the declared credential keys and their values. '
			+ 'Use your tools to answer precisely and to store or clear values when instructed. '
			+ 'Secret values are never shown to anyone — you only ever see and report that they are stored.',
		tools: ['vault:list', 'vault:get', 'vault:set', 'vault:clear']
	});
});
