import onetype from '@onetype/framework';
import store from '#agents/items/tools/test/cms/store.js';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'cms:fields:create',
		name: 'Create field',
		description: 'Adds a field to a collection.',
		isGlobal: true,
		input: {
			collection: {
				type: 'string',
				required: true,
				description: 'Collection to add the field to.'
			},
			name: {
				type: 'string',
				required: true,
				description: 'Field name, like title or price.'
			},
			type: {
				type: 'string',
				required: true,
				description: 'Field type: text, number, boolean or date.'
			}
		},
		callback: function(input)
		{
			const collection = store.collections[input.collection];

			if(!collection)
			{
				return 'Collection ' + input.collection + ' does not exist.';
			}

			if(collection.fields[input.name])
			{
				return 'Field ' + input.name + ' already exists on ' + input.collection + '.';
			}

			collection.fields[input.name] = { type: input.type };

			return 'Field ' + input.name + ' (' + input.type + ') added to ' + input.collection + '.';
		}
	});
});
