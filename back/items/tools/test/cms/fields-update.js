import onetype from '@onetype/framework';
import store from '#agents/items/tools/test/cms/store.js';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'cms:fields:update',
		name: 'Update field',
		description: 'Renames a field or changes its type.',
		isGlobal: true,
		input: {
			collection: {
				type: 'string',
				required: true,
				description: 'Collection the field belongs to.'
			},
			field: {
				type: 'string',
				required: true,
				description: 'Current field name.'
			},
			name: {
				type: 'string',
				description: 'New name, empty to keep.'
			},
			type: {
				type: 'string',
				description: 'New type, empty to keep.'
			}
		},
		callback: function(input)
		{
			const collection = store.collections[input.collection];

			if(!collection)
			{
				return 'Collection ' + input.collection + ' does not exist.';
			}

			const definition = collection.fields[input.field];

			if(!definition)
			{
				return 'Field ' + input.field + ' does not exist on ' + input.collection + '.';
			}

			input.type && (definition.type = input.type);

			if(input.name && input.name !== input.field)
			{
				collection.fields[input.name] = definition;
				delete collection.fields[input.field];
			}

			return 'Field ' + input.field + ' updated.';
		}
	});
});
