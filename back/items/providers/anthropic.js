import onetype from '@onetype/framework';

onetype.AddonReady('agents.providers', (providers) =>
{
	providers.Item({
		id: 'anthropic',
		name: 'Anthropic',
		description: 'Claude models over the Anthropic API.',
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
		],
		send: ({ endpoint, key, model, system, messages, tools }) =>
		{
			const content = [];

			for(const message of messages)
			{
				if(message.role === 'tool')
				{
					const block = { type: 'tool_result', tool_use_id: message.id, content: message.output };
					const previous = content[content.length - 1];

					if(previous && previous.role === 'user' && Array.isArray(previous.content))
					{
						previous.content.push(block);
					}
					else
					{
						content.push({ role: 'user', content: [block] });
					}

					continue;
				}

				if(message.role === 'assistant' && message.calls && message.calls.length)
				{
					const blocks = [];

					message.text && blocks.push({ type: 'text', text: message.text });

					for(const call of message.calls)
					{
						blocks.push({ type: 'tool_use', id: call.id, name: call.name, input: call.input });
					}

					content.push({ role: 'assistant', content: blocks });

					continue;
				}

				content.push({ role: message.role, content: message.text });
			}

			const body = {
				model,
				max_tokens: 8192,
				messages: content
			};

			system && (body.system = system);

			tools.length && (body.tools = tools.map((tool) => ({
				name: tool.name,
				description: tool.description,
				input_schema: tool.input
			})));

			return {
				url: endpoint + '/v1/messages',
				headers: {
					'x-api-key': key || '',
					'anthropic-version': '2023-06-01',
					'content-type': 'application/json'
				},
				body
			};
		},
		receive: (raw) =>
		{
			const blocks = raw.content || [];

			const stops = {
				end_turn: 'end',
				tool_use: 'tools',
				max_tokens: 'length'
			};

			return {
				text: blocks.filter((block) => block.type === 'text').map((block) => block.text).join(''),
				calls: blocks.filter((block) => block.type === 'tool_use').map((block) => ({
					id: block.id,
					name: block.name,
					input: block.input
				})),
				stop: stops[raw.stop_reason] || 'end',
				usage: {
					input: raw.usage ? raw.usage.input_tokens : 0,
					output: raw.usage ? raw.usage.output_tokens : 0
				}
			};
		}
	});
});
