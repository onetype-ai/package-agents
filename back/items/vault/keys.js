import onetype from '@onetype/framework';

onetype.AddonReady('vault.categories', (categories) =>
{
	categories.Item({
		id: 'orchestration',
		name: 'Orchestration',
		description: 'Model access for the orchestrator and its agents.',
		icon: 'psychology',
		order: 1
	});
});

onetype.AddonReady('vault.keys', (keys) =>
{
	keys.Item({
		key: 'ORCHESTRATION_ENDPOINT',
		name: 'API Endpoint',
		description: 'Base URL of the model API. https://api.anthropic.com for Claude, https://api.openai.com for OpenAI, or any compatible endpoint.',
		category: 'orchestration',
		group: 'Model',
		value: 'http://192.168.1.3:8199/'
	});

	keys.Item({
		key: 'ORCHESTRATION_API_KEY',
		name: 'API Key',
		description: 'Key for the model API the endpoint points to.',
		category: 'orchestration',
		group: 'Model',
		secret: true
	});

	keys.Item({
		key: 'ORCHESTRATION_MODEL',
		name: 'Model',
		description: 'Model id to run, like claude-sonnet-5 or gpt-5.',
		category: 'orchestration',
		group: 'Model',
		value: 'default'
	});
});
