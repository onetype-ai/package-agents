import onetype from '@onetype/framework';

onetype.EmitRegister('orchestration.runs.start', {
	description: 'Fires when a run begins working.',
	metadata: { addon: 'orchestration.runs' },
	config: {
		id: {
			type: 'string',
			description: 'Run id.'
		},
		agent: {
			type: 'string',
			description: 'Agent the run belongs to.'
		}
	}
});
