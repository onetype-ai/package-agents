import onetype from '@onetype/framework';
import store from '#agents/items/tools/test/cms/store.js';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'cms:items:update',
		name: 'Update item',
		description: 'Updates fields of an item. Values arrive as a JSON object string.',
		isGlobal: true,
		input: {
			collection: {
				type: 'string',
				required: true,
				description: 'Collection the item lives in.'
			},
			id: {
				type: 'string',
				required: true,
				description: 'Item id.'
			},
			values: {
				type: 'string',
				required: true,
				description: 'JSON object string with the fields to change.'
			}
		},
		callback: function(input)
		{
			const collection = store.collections[input.collection];

			if(!collection)
			{
				return 'Collection ' + input.collection + ' does not exist.';
			}

			const item = collection.items[input.id];

			if(!item)
			{
				return 'Item ' + input.id + ' does not exist in ' + input.collection + '.';
			}

			Object.assign(item, JSON.parse(input.values));

			return 'Item ' + input.id + ' updated.';
		}
	});
});
