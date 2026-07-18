import onetype from '@onetype/framework';

onetype.AddonReady('agents.providers', (providers) =>
{
	providers.Item({
		id: 'local',
		name: 'Local',
		description: 'The self hosted vLLM server on the local network.',
		dialect: 'openai',
		endpoint: 'http://192.168.1.3:8199',
		models: [
			{
				id: 'qwen3.6-27b',
				name: 'Qwen 3.6 27B',
				description: 'The local workhorse, runs on our own metal.'
			}
		]
	});
});
