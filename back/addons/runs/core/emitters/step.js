onetype.EmitRegister('agents.runs.step', {
	description: 'Fires after every tool call inside a run, with the step that was added.',
	metadata: { addon: 'agents.runs' },
	config: {
		id: {
			type: 'string',
			description: 'Run id.'
		},
		agent: {
			type: 'string',
			description: 'Agent the run belongs to.'
		},
		step: {
			type: 'object',
			description: 'The step that was added.'
		}
	}
});
