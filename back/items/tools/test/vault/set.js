import onetype from '@onetype/framework';

/* Temporary test tool — delete once the vault package ships its own. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'vault:set',
		name: 'Set vault value',
		description: 'Encrypts and stores a value for a declared vault key.',
		input: {
			key: {
				type: 'string',
				required: true,
				description: 'The key to store the value under.'
			},
			value: {
				type: 'string',
				required: true,
				description: 'The value to store.'
			}
		},
		callback: async function(input)
		{
			const item = await $ot.vault.set(input.key, input.value);

			return item ? 'Value stored for ' + input.key + '.' : 'Key ' + input.key + ' is not declared.';
		}
	});
});
