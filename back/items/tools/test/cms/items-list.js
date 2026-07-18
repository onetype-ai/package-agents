import onetype from '@onetype/framework';
import store from '#agents/items/tools/test/cms/store.js';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'cms:items:list',
		name: 'List items',
		description: 'Lists the items of a collection with their values.',
		isGlobal: true,
		input: {
			collection: {
				type: 'string',
				required: true,
				description: 'Collection to list.'
			}
		},
		callback: function(input)
		{
			const collection = store.collections[input.collection];

			if(!collection)
			{
				return 'Collection ' + input.collection + ' does not exist.';
			}

			const ids = Object.keys(collection.items);

			return ids.length ? ids.map((id) => id + ': ' + JSON.stringify(collection.items[id])).join('\n') : 'No items yet.';
		}
	});
});
