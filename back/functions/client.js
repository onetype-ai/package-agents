import onetype from '@onetype/framework';
import agents from '#agents/addon.js';

/*
	The one place that talks to a model API. The model arrives as
	provider/model — the provider item carries the dialect and the
	default endpoint, the vault carries the instance endpoint and key.
	Single call, no loops — the executor owns those.

	Returns a normalized shape either way:
	{ text, calls: [{ id, name, input }], stop, usage, raw }
*/

agents.Fn('client', async function({ system = null, messages = [], tools = [], model = null })
{
	const read = async (key) => $ot.vault ? await $ot.vault.get(key) : process.env[key];

	const selector = model || await read('AGENTS_MODEL') || '';
	const split = selector.indexOf('/');

	if(split === -1)
	{
		throw onetype.Error(500, 'Model :selector: is not a provider/model pair. Set AGENTS_MODEL in the vault.', { selector });
	}

	const provider = this.providers.ItemGet(selector.slice(0, split));

	if(!provider)
	{
		throw onetype.Error(500, 'Provider :id: is not registered.', { id: selector.slice(0, split) });
	}

	const endpoint = await read(this.providers.Fn('key', provider, 'ENDPOINT')) || provider.Get('endpoint');
	const key = await read(this.providers.Fn('key', provider, 'API_KEY'));
	const anthropic = provider.Get('dialect') === 'anthropic';

	const base = endpoint.replace(/\/$/, '');
	const id = selector.slice(split + 1);

	const request = anthropic
		? this.Fn('client.anthropic', { base, key, model: id, system, messages, tools })
		: this.Fn('client.openai', { base, key, model: id, system, messages, tools });

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

agents.Fn('client.anthropic', function({ base, key, model, system, messages, tools })
{
	const body = {
		model,
		max_tokens: 8192,
		messages
	};

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

agents.Fn('client.anthropic.read', function(raw)
{
	const blocks = raw.content || [];

	return {
		text: blocks.filter((block) => block.type === 'text').map((block) => block.text).join(''),
		calls: blocks.filter((block) => block.type === 'tool_use').map((block) => ({
			id: block.id,
			name: block.name,
			input: block.input
		})),
		stop: raw.stop_reason,
		usage: raw.usage || null,
		raw
	};
});

/* OpenAI compatible dialect */

agents.Fn('client.openai', function({ base, key, model, system, messages, tools })
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

agents.Fn('client.openai.read', function(raw)
{
	const message = raw.choices?.[0]?.message || {};
	const text = message.content || '';
	const think = text.indexOf('</think>');

	return {
		text: think === -1 ? text : text.slice(think + 8).trim(),
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
