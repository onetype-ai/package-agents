import onetype from '@onetype/framework';

/* Temporary test tool — delete once the vault package ships its own. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'vault:list',
		name: 'List vault keys',
		description: 'Lists every declared vault key with its category, filled status and the plain value when the key is not a secret.',
		input: {},
		callback: async function()
		{
			const keys = await $ot.vault.list();

			if(!keys.length)
			{
				return 'No keys are declared.';
			}

			return keys.map((key) =>
			{
				const value = key.secret ? (key.filled ? '(secret, stored)' : '(secret, empty)') : (key.value || '(empty)');

				return key.key + ' [' + key.category + '] — ' + value;
			}).join('\n');
		}
	});
});
