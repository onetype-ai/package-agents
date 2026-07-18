import onetype from '@onetype/framework';

const agents = onetype.Addon('agents', (addon) =>
{
	addon.Field('id', {
		type: 'string',
		required: true,
		description: 'Unique agent id, like project or slack.'
	});

	addon.Field('name', {
		type: 'string',
		description: 'Human readable name shown in the UI.'
	});

	addon.Field('description', {
		type: 'string',
		required: true,
		description: 'One line a caller reads to decide when to call this agent.'
	});

	addon.Field('instructions', {
		type: 'string',
		description: 'System instructions the agent runs with.'
	});

	addon.Field('tools', {
		type: 'array',
		value: [],
		description: 'Ids of the tools this agent may run, on top of the global ones.'
	});

	addon.Field('model', {
		type: 'string',
		description: 'Model override for this agent. Falls back to the instance model.'
	});

	addon.Field('metadata', {
		type: 'object',
		value: {},
		description: 'Provider specific settings for this agent, like { tools: [...] } for a provider that runs an external CLI with its own tool set.'
	});

	addon.Field('parent', {
		type: 'string',
		description: 'Id of the agent that owns this one. A child agent is only visible to and callable by its parent — nobody else sees it in agents:list or may target it with agents:run. Empty for top level agents.'
	});

	addon.Field('isHidden', {
		type: 'boolean',
		value: false,
		description: 'When true, only this agent itself may run itself — not even its parent sees it in agents:list or may target it with agents:run.'
	});

	addon.Field('maxTurns', {
		type: 'number',
		value: 24,
		description: 'Maximum client/tool rounds before the run stops and returns whatever it has, even mid task.'
	});
});

export default agents;
