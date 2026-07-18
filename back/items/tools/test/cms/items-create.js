import onetype from '@onetype/framework';
import store from '#agents/items/tools/test/cms/store.js';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'cms:items:create',
		name: 'Create item',
		description: 'Creates an item in a collection. Values arrive as a JSON object string keyed by field names.',
		isGlobal: true,
		input: {
			collection: {
				type: 'string',
				required: true,
				description: 'Collection to create the item in.'
			},
			values: {
				type: 'string',
				required: true,
				description: 'JSON object string, like {"title":"Hello"}.'
			}
		},
		callback: function(input)
		{
			const collection = store.collections[input.collection];

			if(!collection)
			{
				return 'Collection ' + input.collection + ' does not exist.';
			}

			const values = JSON.parse(input.values);
			const id = String(++collection.sequence);

			collection.items[id] = values;

			return 'Item ' + id + ' created in ' + input.collection + '.';
		}
	});
});
