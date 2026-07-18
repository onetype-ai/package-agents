import onetype from '@onetype/framework';

/* Temporary test tool — delete once the vault package ships its own. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'vault:get',
		name: 'Get vault value',
		description: 'Reads the value of a vault key. Secret values are never revealed, only whether they are stored.',
		input: {
			key: {
				type: 'string',
				required: true,
				description: 'The key to read, like AGENTS_MODEL.'
			}
		},
		callback: async function(input)
		{
			const keys = await $ot.vault.list();
			const entry = keys.find((key) => key.key === input.key);

			if(!entry)
			{
				return 'Key ' + input.key + ' is not declared.';
			}

			if(entry.secret)
			{
				return entry.filled ? 'Key ' + input.key + ' is a secret and its value is stored.' : 'Key ' + input.key + ' is a secret and no value is stored.';
			}

			const value = await $ot.vault.get(input.key);

			return value === null ? 'Key ' + input.key + ' has no value.' : input.key + ' = ' + value;
		}
	});
});
