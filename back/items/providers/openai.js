onetype.AddonReady('agents.providers', (providers) =>
{
	providers.Item({
		id: 'openai',
		name: 'OpenAI',
		description: 'GPT models over the OpenAI API.',
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
		],
		send: ({ endpoint, key, model, system, messages, tools }) =>
		{
			const content = [];

			system && content.push({ role: 'system', content: system });

			for(const message of messages)
			{
				if(message.role === 'tool')
				{
					content.push({ role: 'tool', tool_call_id: message.id, content: message.output });

					continue;
				}

				if(message.role === 'assistant' && message.calls && message.calls.length)
				{
					content.push({
						role: 'assistant',
						content: message.text || null,
						tool_calls: message.calls.map((call) => ({
							id: call.id,
							type: 'function',
							function: { name: call.name, arguments: JSON.stringify(call.input) }
						}))
					});

					continue;
				}

				content.push({ role: message.role, content: message.text });
			}

			const body = {
				model,
				messages: content
			};

			tools.length && (body.tools = tools.map((tool) => ({
				type: 'function',
				function: {
					name: tool.name,
					description: tool.description,
					parameters: tool.input
				}
			})));

			return {
				url: endpoint + '/v1/chat/completions',
				headers: {
					'authorization': 'Bearer ' + (key || ''),
					'content-type': 'application/json'
				},
				body
			};
		},
		receive: (raw) =>
		{
			const choice = raw.choices?.[0] || {};
			const message = choice.message || {};
			const text = message.content || '';
			const think = text.indexOf('</think>');

			const stops = {
				stop: 'end',
				tool_calls: 'tools',
				length: 'length'
			};

			return {
				text: think === -1 ? text : text.slice(think + 8).trim(),
				reasoning: (message.reasoning || message.reasoning_content || (think === -1 ? '' : text.slice(0, think).replace('<think>', ''))).trim(),
				calls: (message.tool_calls || []).map((call) => ({
					id: call.id,
					name: call.function.name,
					input: JSON.parse(call.function.arguments || '{}')
				})),
				stop: stops[choice.finish_reason] || 'end',
				usage: {
					input: raw.usage ? raw.usage.prompt_tokens : 0,
					output: raw.usage ? raw.usage.completion_tokens : 0
				}
			};
		}
	});
});
