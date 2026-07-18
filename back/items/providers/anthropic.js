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
				name: 'Claude Fable 5',
				description: 'The most capable Claude, for the hardest work.'
			},
			{
				id: 'claude-opus-4-8',
				name: 'Claude Opus 4.8',
				description: 'The recommended default — frontier quality at half the Fable price.'
			},
			{
				id: 'claude-sonnet-5',
				name: 'Claude Sonnet 5',
				description: 'The balanced pick — strong reasoning at a sensible price.'
			},
			{
				id: 'claude-haiku-4-5',
				name: 'Claude Haiku 4.5',
				description: 'Fast and cheap for simple calls.'
			}
		]
	});
});
