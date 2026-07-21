import agents from '#agents/addon.js';

/*
	The one generic model caller. It knows nothing about API shapes —
	the provider item translates through its send and receive callbacks.

	In:  { model: 'provider/model', system, messages, tools }
		messages: { role: 'user' | 'assistant', text, calls: [{ id, name, input }] }
		          { role: 'tool', id, output }
		tools:    { name, description, input } — input is a JSON schema object

	Out: { text, reasoning, calls: [{ id, name, input }], stop: 'end' | 'tools' | 'length', usage: { input, output } }
*/

agents.Fn('client', async function({ system = null, messages = [], tools = [], model = null, caller = null, run = null, metadata = {} })
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
		endpoint: provider.Get('endpoint') ? (await read(this.providers.Fn('key', provider, 'ENDPOINT')) || provider.Get('endpoint')).replace(/\/$/, '') : null,
		key: provider.Get('endpoint') ? await read(this.providers.Fn('key', provider, 'API_KEY')) : null,
		model: selector.slice(split + 1),
		system,
		messages,
		tools,
		metadata
	};

	const started = performance.now();

	/* Recording is best effort — telemetry must never sink the model call. */
	const record = async (output, error) =>
	{
		try
		{
			await this.requests.Fn('record', {
				provider,
				model: request.model,
				caller,
				run,
				input: { system, messages, tools },
				output: output ? { text: output.text, calls: output.calls, stop: output.stop } : null,
				usage: output ? output.usage : null,
				duration: performance.now() - started,
				error
			});
		}
		catch(failure)
		{
		}
	};

	/* Providers without a plain HTTP endpoint (gRPC to a developer's machine,
	   a local subprocess...) implement call() directly instead of send/receive. */
	if(provider.Get('call'))
	{
		let result;

		try
		{
			result = await provider.Get('call')(request);
		}
		catch(error)
		{
			await record(null, error.message);

			throw error;
		}

		await record(result, null);

		return result;
	}

	const { url, headers, body } = provider.Get('send')(request);

	let response;

	try
	{
		response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(body)
		});
	}
	catch(error)
	{
		await record(null, error.message);

		throw error;
	}

	if(!response.ok)
	{
		const error = await response.json().catch(() => ({}));
		const message = error.error?.message || error.message || 'Model request failed.';

		await record(null, message);

		throw onetype.Error(response.status, message);
	}

	const result = provider.Get('receive')(await response.json());

	await record(result, null);

	return result;
});
