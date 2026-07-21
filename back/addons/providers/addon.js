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

		addon.Field('send', {
			type: 'function',
			description: 'Turns the standardized request { endpoint, key, model, system, messages, tools } into { url, headers, body } for the API. Required unless the provider defines call instead.'
		});

		addon.Field('receive', {
			type: 'function',
			description: 'Turns the raw API response into the standardized { text, calls, stop, usage } shape. Required unless the provider defines call instead.'
		});

		addon.Field('call', {
			type: 'function',
			description: 'For providers with no plain HTTP endpoint (gRPC to a developer machine, a local subprocess...): takes the standardized request and returns the standardized result directly, bypassing send/receive/fetch.'
		});

		addon.Field('endpoint', {
			type: 'string',
			description: 'Default base URL of the API. The vault endpoint key starts with this value and can be changed per instance. Omit for providers that define call.'
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
					input: {
						type: 'number',
						description: 'Price in cents per million input tokens.'
					},
					output: {
						type: 'number',
						description: 'Price in cents per million output tokens.'
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
