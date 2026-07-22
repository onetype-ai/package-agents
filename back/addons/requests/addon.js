onetype.AddonReady('agents', (agents) =>
{
    agents.requests = onetype.Addon('agents.requests', (addon) =>
    {
        addon.Table('agents_requests');

        addon.Field('id', {
            type: 'string',
            description: 'Unique row id, a bigint the database returns as a string.'
        });

        addon.Field('provider', {
            type: 'string',
            required: true,
            description: 'Provider the request went to.'
        });

        addon.Field('model', {
            type: 'string',
            required: true,
            description: 'Model id the request ran on.'
        });

        addon.Field('caller', {
            type: 'string',
            description: 'Who made the request, like orah or automation.'
        });

        addon.Field('run', {
            type: 'string',
            description: 'Run the request belongs to, null for standalone calls.'
        });

        addon.Field('input', {
            type: 'string',
            description: 'The standardized request as a JSON string: system, messages and tools.'
        });

        addon.Field('output', {
            type: 'string',
            description: 'The standardized response as a JSON string: text, calls and stop.'
        });

        addon.Field('tokens_input', {
            type: 'number',
            value: 0,
            description: 'Input tokens the request consumed.'
        });

        addon.Field('tokens_output', {
            type: 'number',
            value: 0,
            description: 'Output tokens the response produced.'
        });

        addon.Field('cost', {
            type: 'number',
            value: 0,
            description: 'Price of the request in cents, from the model prices and the token usage.'
        });

        addon.Field('duration', {
            type: 'number',
            value: 0,
            description: 'Milliseconds the request took.'
        });

        addon.Field('status', {
            type: 'string',
            value: 'done',
            options: ['done', 'failed'],
            description: 'Whether the request succeeded.'
        });

        addon.Field('error', {
            type: 'string',
            description: 'What went wrong when the request failed.'
        });

        addon.Field('created_at', {
            type: 'string',
            description: 'Timestamp of the request.'
        });

        addon.Schema('id bigserial primary key');
        addon.Schema('provider varchar(255) not null');
        addon.Schema('model varchar(255) not null');
        addon.Schema('caller varchar(255)');
        addon.Schema('run bigint');
        addon.Schema('input text');
        addon.Schema('output text');
        addon.Schema('tokens_input integer not null default 0');
        addon.Schema('tokens_output integer not null default 0');
        addon.Schema('cost real not null default 0');
        addon.Schema('duration real not null default 0');
        addon.Schema("status varchar(20) not null default 'done'");
        addon.Schema('error text');
        addon.Schema('created_at timestamptz not null default now()');

        addon.Expose({
            filter: ['id', 'provider', 'model', 'caller', 'run', 'status', 'created_at'],
            sort: ['id', 'cost', 'duration', 'created_at'],
            select: ['id', 'provider', 'model', 'caller', 'run', 'tokens_input', 'tokens_output', 'cost', 'duration', 'status', 'error', 'created_at'],
            find: function()
            {
                return this.http && this.http.state.user ? true : 'Sign in to view requests.';
            }
        });
    });
});
