onetype.AddonReady('agents', (agents) =>
{
	agents.runs = onetype.Addon('agents.runs', (addon) =>
	{
		addon.Table('agents_runs');

		addon.Field('id', {
			type: 'string',
			description: 'Unique row id, a bigint the database returns as a string.'
		});

		addon.Field('agent', {
			type: 'string',
			required: true,
			description: 'Id of the agent that ran.'
		});

		addon.Field('mode', {
			type: 'string',
			options: ['research', 'task'],
			description: 'research answers a question, task does something and reports.'
		});

		addon.Field('caller', {
			type: 'string',
			description: 'Who started the run, like orah or automation.'
		});

		addon.Field('input', {
			type: 'string',
			description: 'The question or the instructions the agent received.'
		});

		addon.Field('status', {
			type: 'string',
			value: 'pending',
			options: ['pending', 'working', 'done', 'failed'],
			description: 'Where the run currently is.'
		});

		addon.Field('steps', {
			type: 'string',
			value: '[]',
			description: 'Tool calls the agent made along the way, as a JSON string.'
		});

		addon.Field('result', {
			type: 'string',
			description: 'The final answer or report.'
		});

		addon.Field('error', {
			type: 'string',
			description: 'What went wrong when the run failed.'
		});

		addon.Field('updated_at', {
			type: 'string',
			description: 'Timestamp of the last change.'
		});

		addon.Field('created_at', {
			type: 'string',
			description: 'Timestamp of when the run was created.'
		});

		addon.Schema('id bigserial primary key');
		addon.Schema('agent varchar(255) not null');
		addon.Schema('mode varchar(20)');
		addon.Schema('caller varchar(255)');
		addon.Schema('input text');
		addon.Schema("status varchar(20) not null default 'pending'");
		addon.Schema("steps text not null default '[]'");
		addon.Schema('result text');
		addon.Schema('error text');
		addon.Schema('updated_at timestamptz not null default now()');
		addon.Schema('created_at timestamptz not null default now()');

		addon.Expose({
			filter: ['id', 'agent', 'mode', 'caller', 'status', 'created_at'],
			sort: ['id', 'created_at'],
			select: ['id', 'agent', 'mode', 'caller', 'input', 'status', 'result', 'error', 'created_at'],
			find: function()
			{
				return this.http && this.http.state.user ? true : 'Sign in to view runs.';
			}
		});
	});
});
