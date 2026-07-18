import agents from '#agents/addon.js';

agents.tools.Fn('definition', function(tool)
{
	const input = tool.Get('input') || {};
	const properties = {};
	const required = [];

	for(const [key, config] of Object.entries(input))
	{
		properties[key] = {
			type: ['string', 'number', 'boolean', 'array', 'object', 'integer'].includes(config.type) ? config.type : 'string',
			description: config.description || ''
		};

		config.required && required.push(key);
	}

	return {
		name: this.Fn('name', tool),
		description: tool.Get('description') || '',
		input: { type: 'object', properties, required }
	};
});
