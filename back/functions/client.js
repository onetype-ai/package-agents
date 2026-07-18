import onetype from '@onetype/framework';
import agents from '#agents/addon.js';

/*
	The one generic model caller. It knows nothing about API shapes —
	the provider item translates through its send and receive callbacks.

	In:  { model: 'provider/model', system, messages, tools }
		messages: { role: 'user' | 'assistant', text, calls: [{ id, name, input }] }
		          { role: 'tool', id, output }
		tools:    { name, description, input } — input is a JSON schema object

	Out: { text, calls: [{ id, name, input }], stop: 'end' | 'tools' | 'length', usage: { input, output } }
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

	const request = {
		endpoint: (await read(this.providers.Fn('key', provider, 'ENDPOINT')) || provider.Get('endpoint')).replace(/\/$/, ''),
		key: await read(this.providers.Fn('key', provider, 'API_KEY')),
		model: selector.slice(split + 1),
		system,
		messages,
		tools
	};

	const { url, headers, body } = provider.Get('send')(request);

	const response = await fetch(url, {
		method: 'POST',
		headers,
		body: JSON.stringify(body)
	});

	if(!response.ok)
	{
		const error = await response.json().catch(() => ({}));

		throw onetype.Error(response.status, error.error?.message || error.message || 'Model request failed.');
	}

	return provider.Get('receive')(await response.json());
});
