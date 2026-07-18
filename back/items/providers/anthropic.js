import onetype from '@onetype/framework';

onetype.AddonReady('agents.providers', (providers) =>
{
	providers.Item({
		id: 'anthropic',
		name: 'Anthropic',
		description: 'Claude models over the Anthropic API.',
		dialect: 'anthropic',
		endpoint: 'https://api.anthropic.com',
		models: [
			{
				id: 'claude-fable-5',
				input: 1000,
				output: 5000,
				name: 'Claude Fable 5',
				description: 'The most capable Claude, for the hardest work.'
			},
			{
				id: 'claude-opus-4-8',
				input: 500,
				output: 2500,
				name: 'Claude Opus 4.8',
				description: 'The recommended default — frontier quality at half the Fable price.'
			},
			{
				id: 'claude-sonnet-5',
				input: 300,
				output: 1500,
				name: 'Claude Sonnet 5',
				description: 'The balanced pick — strong reasoning at a sensible price.'
			},
			{
				id: 'claude-haiku-4-5',
				input: 100,
				output: 500,
				name: 'Claude Haiku 4.5',
				description: 'Fast and cheap for simple calls.'
			}
		]
	});
});
