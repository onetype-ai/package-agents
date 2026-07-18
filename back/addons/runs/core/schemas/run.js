import onetype from '@onetype/framework';

onetype.DataSchema('agents.run', {
	id: {
		type: 'string',
		description: 'Run id.'
	},
	agent: {
		type: 'string',
		description: 'Id of the agent that ran.'
	},
	mode: {
		type: 'string',
		description: 'research or task.'
	},
	caller: {
		type: 'string',
		description: 'Who started the run.'
	},
	input: {
		type: 'string',
		description: 'The question or the instructions.'
	},
	status: {
		type: 'string',
		description: 'pending, working, done or failed.'
	},
	steps: {
		type: 'array',
		description: 'Tool calls the agent made along the way.'
	},
	result: {
		type: 'string',
		description: 'The final answer or report, null until done.'
	},
	error: {
		type: 'string',
		description: 'What went wrong, null unless failed.'
	},
	created_at: {
		type: 'string',
		description: 'Timestamp of when the run was created.'
	}
});
