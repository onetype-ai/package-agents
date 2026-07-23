onetype.schemas.ItemAdd({
    id: 'agents.provider',
    config: {
        id: {
            type: 'string',
            description: 'Unique provider id.'
        },
        name: {
            type: 'string',
            description: 'Human readable name.'
        },
        description: {
            type: 'string',
            description: 'One line about the provider.'
        },
        endpoint: {
            type: 'string',
            description: 'Default base URL of the API.'
        },
        models: {
            type: 'array',
            each: {
                type: 'json'
            },
            description: 'Models the provider offers, with id, name and description.'
        }
    }
});
