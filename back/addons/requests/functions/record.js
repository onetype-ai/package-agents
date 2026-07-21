import agents from '#agents/addon.js';

agents.requests.Fn('record', async function({ provider, model, caller, run, input, output, usage, duration, error })
{
	const prices = (provider.Get('models') || []).find((entry) => entry.id === model);

	const cost = prices && usage
		? (usage.input / 1000000) * (prices.input || 0) + (usage.output / 1000000) * (prices.output || 0)
		: 0;

	const item = this.Item({
		provider: provider.Get('id'),
		model,
		caller: caller || null,
		run: run || null,
		input: JSON.stringify(input),
		output: output ? JSON.stringify(output) : null,
		tokens_input: usage ? usage.input : 0,
		tokens_output: usage ? usage.output : 0,
		cost,
		duration,
		status: error ? 'failed' : 'done',
		error: error || null
	});

	await item.Create();

	this.ItemRemove(item.Get('id'), false);

	onetype.Emit('agents.requests.add', {
		id: item.Get('id'),
		provider: provider.Get('id'),
		model,
		caller: caller || null,
		cost,
		status: error ? 'failed' : 'done'
	});

	return item;
});
