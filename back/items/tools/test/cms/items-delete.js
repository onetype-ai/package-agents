import onetype from '@onetype/framework';
import store from '#agents/items/tools/test/cms/store.js';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'cms:items:delete',
		name: 'Delete item',
		description: 'Deletes an item from a collection.',
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
			}
		},
		callback: function(input)
		{
			const collection = store.collections[input.collection];

			if(!collection)
			{
				return 'Collection ' + input.collection + ' does not exist.';
			}

			if(!collection.items[input.id])
			{
				return 'Item ' + input.id + ' does not exist in ' + input.collection + '.';
			}

			delete collection.items[input.id];

			return 'Item ' + input.id + ' deleted from ' + input.collection + '.';
		}
	});
});
