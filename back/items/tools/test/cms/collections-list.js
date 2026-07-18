import onetype from '@onetype/framework';
import store from '#agents/items/tools/test/cms/store.js';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'cms:collections:list',
		name: 'List collections',
		description: 'Lists every CMS collection with its field and item counts.',
		isGlobal: true,
		input: {

		},
		callback: function(input)
		{
			const names = Object.keys(store.collections);

			if(!names.length)
			{
				return 'No collections yet.';
			}

			return names.map((name) => name + ' — ' + Object.keys(store.collections[name].fields).length + ' fields, ' + Object.keys(store.collections[name].items).length + ' items').join('\n');
		}
	});
});
