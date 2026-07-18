import onetype from '@onetype/framework';

onetype.EmitRegister('orchestration.runs.done', {
	description: 'Fires when a run finishes, done or failed.',
	metadata: { addon: 'orchestration.runs' },
	config: {
		id: {
			type: 'string',
			description: 'Run id.'
		},
		agent: {
			type: 'string',
			description: 'Agent the run belongs to.'
		},
		status: {
			type: 'string',
			description: 'done or failed.'
		},
		result: {
			type: 'string',
			description: 'The final answer or report, null when failed.'
		}
	}
});
