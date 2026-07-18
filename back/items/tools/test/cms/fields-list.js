import onetype from '@onetype/framework';
import store from '#agents/items/tools/test/cms/store.js';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'cms:fields:list',
		name: 'List fields',
		description: 'Lists the fields of a collection.',
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

			const names = Object.keys(collection.fields);

			return names.length ? names.map((name) => name + ': ' + collection.fields[name].type).join('\n') : 'No fields yet.';
		}
	});
});
