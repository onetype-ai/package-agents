import onetype from '@onetype/framework';

onetype.AddonReady('vault.categories', (categories) =>
{
	categories.Item({
		id: 'agents',
		name: 'Agents',
		description: 'Model access for the orchestrator and its agents.',
		icon: 'psychology',
		order: 1
	});
});

onetype.AddonReady('vault.keys', (keys) =>
{
	keys.Item({
		key: 'AGENTS_ENDPOINT',
		name: 'API Endpoint',
		description: 'Base URL of the model API. https://api.anthropic.com for Claude, https://api.openai.com for OpenAI, or any compatible endpoint.',
		category: 'agents',
		group: 'Agents',
		value: 'http://192.168.1.3:8199/'
	});

	keys.Item({
		key: 'AGENTS_API_KEY',
		name: 'API Key',
		description: 'Key for the model API the endpoint points to.',
		category: 'agents',
		group: 'Agents',
		secret: true
	});

	keys.Item({
		key: 'AGENTS_MODEL',
		name: 'Model',
		description: 'Model id to run, like claude-sonnet-5 or gpt-5.',
		category: 'agents',
		group: 'Agents',
		value: 'default'
	});
});
