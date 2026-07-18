import onetype from '@onetype/framework';
import store from '#agents/items/tools/test/cms/store.js';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'cms:collections:create',
		name: 'Create collection',
		description: 'Creates a CMS collection with the given name.',
		isGlobal: true,
		input: {
			name: {
				type: 'string',
				required: true,
				description: 'Name of the collection, like posts or products.'
			}
		},
		callback: function(input)
		{
			if(store.collections[input.name])
			{
				return 'Collection ' + input.name + ' already exists.';
			}

			store.collections[input.name] = { fields: {}, items: {}, sequence: 0 };

			return 'Collection ' + input.name + ' created.';
		}
	});
});
