import onetype from '@onetype/framework';

/*
	Claude over the Claude Code subscription — the Go bridge in
	agents/claude-bridge spawns `claude -p` per call and speaks a plain
	{ prompt, system, model, effort } → { text } dialect on /ask.

	The bridge has no native tool calling, so tools ride a protocol:
	definitions go into the system prompt, and the model calls them by
	replying with a bare JSON object receive() parses back into calls.
*/

const PROTOCOL = [
	'## Tool protocol',
	'You may call the tools listed below. To call one or more tools, reply with ONLY a JSON object, no prose, no code fences:',
	'{"tool_calls": [{"name": "<tool name>", "arguments": { ... }}]}',
	'To answer without calling tools, reply with plain text and no JSON wrapper.',
	'Never mix prose and the JSON object in one reply.',
	'Your reply ends at the closing brace of that object. You never write a "Tool result" line — results arrive from the system in the next turn, and inventing one is the gravest possible error. Wait for them.',
	'',
	'## Tools'
].join('\n');

/* Finds the first {"tool_calls": ...} object anywhere in the text and
   returns it with everything before and after discarded — models love
   to wrap the object in prose or continue past it. */
const extract = (text) =>
{
	const start = text.indexOf('{"tool_calls"');

	if(start === -1)
	{
		return null;
	}

	let depth = 0;
	let string = false;

	for(let index = start; index < text.length; index++)
	{
		const char = text[index];

		if(string)
		{
			char === '\\' ? index++ : (char === '"' && (string = false));

			continue;
		}

		char === '"' && (string = true);
		char === '{' && depth++;

		if(char === '}' && !--depth)
		{
			try
			{
				return JSON.parse(text.slice(start, index + 1));
			}
			catch(error)
			{
				return null;
			}
		}
	}

	return null;
};

onetype.AddonReady('agents.providers', (providers) =>
{
	providers.Item({
		id: 'claude-code',
		name: 'Claude Code',
		description: 'Claude over the Claude Code subscription, through the local claude-bridge. No per-token cost.',
		endpoint: 'http://127.0.0.1:8787',
		models: [
			{
				id: 'sonnet',
				input: 0,
				output: 0,
				name: 'Sonnet',
				description: 'Claude Sonnet through the subscription.'
			},
			{
				id: 'opus',
				input: 0,
				output: 0,
				name: 'Opus',
				description: 'Claude Opus through the subscription.'
			},
			{
				id: 'haiku',
				input: 0,
				output: 0,
				name: 'Haiku',
				description: 'Claude Haiku through the subscription.'
			}
		],
		send: ({ endpoint, model, system, messages, tools }) =>
		{
			const lines = [];

			for(const message of messages)
			{
				if(message.role === 'tool')
				{
					lines.push('Tool result for ' + message.id + ':\n' + (message.output || ''));

					continue;
				}

				if(message.role === 'assistant' && message.calls && message.calls.length)
				{
					lines.push('Assistant called tools:\n' + JSON.stringify(message.calls));

					continue;
				}

				lines.push((message.role === 'user' ? 'User' : 'Assistant') + ':\n' + (message.text || ''));
			}

			const definitions = tools.map((tool) => JSON.stringify({
				name: tool.name,
				description: tool.description,
				parameters: tool.input
			}));

			return {
				url: endpoint + '/ask',
				headers: { 'content-type': 'application/json' },
				body: {
					prompt: lines.join('\n\n') || 'Hello',
					system: [system || '', tools.length ? PROTOCOL + '\n' + definitions.join('\n') : ''].filter(Boolean).join('\n\n'),
					model: model || 'sonnet',
					effort: 'low'
				}
			};
		},
		receive: (raw) =>
		{
			const parsed = extract(String(raw.text || ''));

			if(parsed && Array.isArray(parsed.tool_calls) && parsed.tool_calls.length)
			{
				return {
					text: '',
					calls: parsed.tool_calls.map((call, index) => ({
						id: 'call_' + Date.now().toString(36) + '_' + index,
						name: call.name,
						input: call.arguments || call.input || {}
					})),
					stop: 'tools',
					usage: { input: 0, output: 0 }
				};
			}

			return {
				text: raw.text || '',
				calls: [],
				stop: 'end',
				usage: { input: 0, output: 0 }
			};
		}
	});
});
