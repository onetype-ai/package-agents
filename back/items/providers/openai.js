import onetype from '@onetype/framework';

onetype.AddonReady('agents.providers', (providers) =>
{
	providers.Item({
		id: 'openai',
		name: 'OpenAI',
		description: 'GPT models over the OpenAI API.',
		dialect: 'openai',
		endpoint: 'https://api.openai.com',
		models: [
			{
				id: 'gpt-5.6-sol',
				input: 500,
				output: 3000,
				name: 'GPT-5.6 Sol',
				description: 'The frontier model, for the hardest work.'
			},
			{
				id: 'gpt-5.6-terra',
				input: 250,
				output: 1500,
				name: 'GPT-5.6 Terra',
				description: 'The balanced pick — strong quality at half the Sol price.'
			},
			{
				id: 'gpt-5.6-luna',
				input: 100,
				output: 600,
				name: 'GPT-5.6 Luna',
				description: 'Fast and cheap for simple calls.'
			}
		]
	});
});
