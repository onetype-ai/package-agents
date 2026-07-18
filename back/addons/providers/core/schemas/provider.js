import onetype from '@onetype/framework';

onetype.DataSchema('agents.provider', {
	id: {
		type: 'string',
		description: 'Unique provider id.'
	},
	name: {
		type: 'string',
		description: 'Human readable name.'
	},
	description: {
		type: 'string',
		description: 'One line about the provider.'
	},
	dialect: {
		type: 'string',
		description: 'Which API dialect the endpoint speaks, anthropic or openai.'
	},
	endpoint: {
		type: 'string',
		description: 'Default base URL of the API.'
	},
	models: {
		type: 'array',
		each: {
			type: 'object'
		},
		description: 'Models the provider offers, with id, name and description.'
	}
});
