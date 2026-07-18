import onetype from '@onetype/framework';
import store from '#agents/items/tools/test/cms/store.js';

/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'cms:translate',
		name: 'Translate item field',
		description: 'Translates a text field of an item into a language and stores it as field_language. The translation itself must be provided.',
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
			field: {
				type: 'string',
				required: true,
				description: 'Field to translate.'
			},
			language: {
				type: 'string',
				required: true,
				description: 'Target language code, like en or de.'
			},
			translation: {
				type: 'string',
				required: true,
				description: 'The translated text to store.'
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

			item[input.field + '_' + input.language] = input.translation;

			return 'Field ' + input.field + ' of item ' + input.id + ' translated to ' + input.language + '.';
		}
	});
});
