import onetype from '@onetype/framework';

onetype.DataSchema('agents.agent', {
	id: {
		type: 'string',
		description: 'Unique agent id.'
	},
	name: {
		type: 'string',
		description: 'Human readable name.'
	},
	description: {
		type: 'string',
		description: 'One line the orchestrator reads to decide when to call this agent.'
	},
	instructions: {
		type: 'string',
		description: 'System instructions the agent runs with.'
	},
	tools: {
		type: 'array',
		description: 'Ids of the tools this agent may run.'
	},
	parent: {
		type: 'string',
		description: 'Id of the agent that owns this one. Empty for top level agents.'
	},
	persona: {
		type: 'object',
		value: null,
		config: {
			name: {
				type: 'string',
				description: 'First name of the persona.'
			},
			surname: {
				type: 'string',
				description: 'Last name of the persona.'
			},
			age: {
				type: 'number',
				description: 'Age of the persona.'
			},
			bio: {
				type: 'string',
				description: 'A few human sentences about who this is.'
			},
			color: {
				type: 'string',
				value: 'blue',
				options: ['brand', 'blue', 'red', 'orange', 'green'],
				description: 'Signature color of the persona across the UI.'
			},
			cover: {
				type: 'string',
				description: 'Profile cover image url. Generated from the bio later, empty falls back to the color gradient.'
			}
		},
		description: 'The human face of the agent.'
	}
});
