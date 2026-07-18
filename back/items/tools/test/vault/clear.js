import onetype from '@onetype/framework';

/* Temporary test tool — delete once the vault package ships its own. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'vault:clear',
		name: 'Clear vault value',
		description: 'Removes the stored value of a vault key.',
		input: {
			key: {
				type: 'string',
				required: true,
				description: 'The key to clear.'
			}
		},
		callback: async function(input)
		{
			await $ot.vault.clear(input.key);

			return 'Value of ' + input.key + ' cleared.';
		}
	});
});
