onetype.EmitRegister('agents.requests.add', {
    description: 'Fires after every model request is recorded, done or failed.',
    metadata: { addon: 'agents.requests' },
    config: {
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
        cost: {
            type: 'number',
            description: 'Price of the request in cents.'
        },
        status: {
            type: 'string',
            description: 'done or failed.'
        }
    }
});
