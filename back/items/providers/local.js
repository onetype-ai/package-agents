import onetype from '@onetype/framework';

onetype.AddonReady('agents.providers', (providers) =>
{
	providers.Item({
		id: 'local',
		name: 'Local',
		description: 'The self hosted vLLM server on the local network. Speaks the OpenAI dialect, so it borrows the OpenAI callbacks.',
		endpoint: 'http://192.168.1.3:8199',
		models: [
			{
				id: 'qwen3.6-27b',
				input: 0,
				output: 0,
				name: 'Qwen 3.6 27B',
				description: 'The local workhorse, runs on our own metal.'
			}
		],
		send: (request) => providers.ItemGet('openai').Get('send')(request),
		receive: (raw) => providers.ItemGet('openai').Get('receive')(raw)
	});
});
