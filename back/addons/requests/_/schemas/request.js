onetype.SchemasRegister('agents.request', {
    id: {
        type: 'string',
        description: 'Request id.'
    },
    provider: {
        type: 'string',
        description: 'Provider the request went to.'
    },
    model: {
        type: 'string',
        description: 'Model id the request ran on.'
    },
    caller: {
        type: 'string',
        description: 'Who made the request.'
    },
    run: {
        type: 'string',
        description: 'Run the request belongs to, null for standalone calls.'
    },
    tokens_input: {
        type: 'number',
        description: 'Input tokens consumed.'
    },
    tokens_output: {
        type: 'number',
        description: 'Output tokens produced.'
    },
    cost: {
        type: 'number',
        description: 'Price of the request in cents.'
    },
    duration: {
        type: 'number',
        description: 'Milliseconds the request took.'
    },
    status: {
        type: 'string',
        description: 'done or failed.'
    },
    error: {
        type: 'string',
        description: 'What went wrong, null unless failed.'
    },
    created_at: {
        type: 'string',
        description: 'Timestamp of the request.'
    }
});
