import onetype from '@onetype/framework';
import orchestration from '#orchestration/addon.js';

/*
	The one place that talks to the model API. Speaks both standard dialects:
	Anthropic (/v1/messages) and OpenAI compatible (/v1/chat/completions),
	picked by the endpoint. Single call, no loops — the executor owns those.

	Returns a normalized shape either way:
	{ text, calls: [{ id, name, input }], stop, usage, raw }
*/

orchestration.Fn('client', async function({ system = null, messages = [], tools = [], model = null })
{
	const endpoint = ($ot.vault ? await $ot.vault.get('ORCHESTRATION_ENDPOINT') : process.env.ORCHESTRATION_ENDPOINT) || '';
	const key = $ot.vault ? await $ot.vault.get('ORCHESTRATION_API_KEY') : process.env.ORCHESTRATION_API_KEY;

	if(!endpoint)
	{
		throw onetype.Error(500, 'ORCHESTRATION_ENDPOINT is not set. Fill it in the vault.');
	}

	model = model || ($ot.vault ? await $ot.vault.get('ORCHESTRATION_MODEL') : process.env.ORCHESTRATION_MODEL) || 'default';

	const base = endpoint.replace(/\/$/, '');
	const anthropic = base.includes('anthropic');

	const request = anthropic
		? this.Fn('client.anthropic', { base, key, model, system, messages, tools })
		: this.Fn('client.openai', { base, key, model, system, messages, tools });

	const response = await fetch(request.url, {
		method: 'POST',
		headers: request.headers,
		body: JSON.stringify(request.body)
	});

	if(!response.ok)
	{
		const error = await response.json().catch(() => ({}));

		throw onetype.Error(response.status, error.error?.message || error.message || 'Model request failed.');
	}

	const raw = await response.json();

	return anthropic ? this.Fn('client.anthropic.read', raw) : this.Fn('client.openai.read', raw);
});

/* Anthropic dialect */

orchestration.Fn('client.anthropic', function({ base, key, model, system, messages, tools })
{
	const body = { model, max_tokens: 8192, messages };

	system && (body.system = system);

	tools.length && (body.tools = tools.map((tool) => ({
		name: tool.name,
		description: tool.description,
		input_schema: tool.input
	})));

	return {
		url: base + '/v1/messages',
		headers: {
			'x-api-key': key || '',
			'anthropic-version': '2023-06-01',
			'content-type': 'application/json'
		},
		body
	};
});

orchestration.Fn('client.anthropic.read', function(raw)
{
	const blocks = raw.content || [];

	return {
		text: blocks.filter((block) => block.type === 'text').map((block) => block.text).join(''),
		calls: blocks.filter((block) => block.type === 'tool_use').map((block) => ({ id: block.id, name: block.name, input: block.input })),
		stop: raw.stop_reason,
		usage: raw.usage || null,
		raw
	};
});

/* OpenAI compatible dialect */

orchestration.Fn('client.openai', function({ base, key, model, system, messages, tools })
{
	const body = {
		model,
		messages: system ? [{ role: 'system', content: system }, ...messages] : messages
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
		url: base + '/v1/chat/completions',
		headers: {
			'authorization': 'Bearer ' + (key || ''),
			'content-type': 'application/json'
		},
		body
	};
});

orchestration.Fn('client.openai.read', function(raw)
{
	const message = raw.choices?.[0]?.message || {};

	return {
		text: message.content || '',
		calls: (message.tool_calls || []).map((call) => ({
			id: call.id,
			name: call.function.name,
			input: JSON.parse(call.function.arguments || '{}')
		})),
		stop: raw.choices?.[0]?.finish_reason || null,
		usage: raw.usage || null,
		raw
	};
});
