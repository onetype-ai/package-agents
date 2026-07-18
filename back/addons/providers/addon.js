import onetype from '@onetype/framework';

onetype.AddonReady('agents', (agents) =>
{
	agents.providers = onetype.Addon('agents.providers', (addon) =>
	{
		addon.Field('id', {
			type: 'string',
			required: true,
			description: 'Unique provider id, like anthropic or openai.'
		});

		addon.Field('name', {
			type: 'string',
			required: true,
			description: 'Human readable name, also the vault group the provider keys sit under.'
		});

		addon.Field('description', {
			type: 'string',
			description: 'One line about the provider.'
		});

		addon.Field('dialect', {
			type: 'string',
			required: true,
			options: ['anthropic', 'openai'],
			description: 'Which API dialect the endpoint speaks.'
		});

		addon.Field('endpoint', {
			type: 'string',
			required: true,
			description: 'Default base URL of the API. The vault endpoint key starts with this value and can be changed per instance.'
		});

		addon.Field('models', {
			type: 'array',
			value: [],
			each: {
				type: 'object',
				config: {
					id: {
						type: 'string',
						required: true,
						description: 'Model id the API expects.'
					},
					name: {
						type: 'string',
						description: 'Human readable model name.'
					},
					description: {
						type: 'string',
						description: 'What the model is good at, shown when picking one.'
					}
				}
			},
			description: 'Models the provider offers.'
		});
	});
});
