import onetype from '@onetype/framework';
import orchestration from '#orchestration/addon.js';

orchestration.tools.Fn('run', async function(name, input = {}, context = {})
{
	const tool = Object.values(this.Items()).find((item) => this.Fn('name', item) === name);

	if(!tool)
	{
		throw onetype.Error(404, 'Tool ' + name + ' is not registered.');
	}

	if(tool.Get('command'))
	{
		const result = await $ot.command(tool.Get('command'), input, context, true);

		if(result.code !== 200)
		{
			throw onetype.Error(result.code, result.message);
		}

		return result.data;
	}

	if(tool.Get('callback'))
	{
		return await tool.Get('callback').call(context, input);
	}

	throw onetype.Error(500, 'Tool ' + name + ' has neither a command nor a callback.');
});
