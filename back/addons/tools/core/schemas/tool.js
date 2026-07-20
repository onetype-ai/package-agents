import onetype from '@onetype/framework';

onetype.DataSchema('agents.tool', {
	id: {
		type: 'string',
		description: 'Unique tool id.'
	},
	name: {
		type: 'string',
		description: 'Human readable name.'
	},
	description: {
		type: 'string',
		description: 'What the tool does — the model reads this to decide when to use it.'
	},
	input: {
		type: 'object',
		description: 'Input fields the tool accepts.'
	},
	isGlobal: {
		type: 'boolean',
		description: 'Whether every agent gets this tool automatically.'
	},
	command: {
		type: 'string',
		description: 'Command id the tool runs, null when it runs a callback.'
	},
	metadata: {
		type: 'object',
		description: 'Free extra data — agent tools carry the id of the agent they run.'
	}
});
