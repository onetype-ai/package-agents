import agents from '#agents/addon.js';

/* Core */
import '#agents/core/schemas/agent.js';

/* Addons */
import '#agents/addons/providers/load.js';
import '#agents/addons/tools/load.js';
import '#agents/addons/requests/load.js';
import '#agents/addons/runs/load.js';

/* Functions */
import '#agents/functions/client.js';
import '#agents/functions/run.js';

/* Items */
import '#agents/items/commands/crud/many.js';
import '#agents/items/tools/list.js';
import '#agents/items/tools/run.js';
import '#agents/items/tools/test/time.js';
import '#agents/items/tools/test/user.js';
import '#agents/items/tools/test/cms/collections-create.js';
import '#agents/items/tools/test/cms/collections-list.js';
import '#agents/items/tools/test/cms/fields-create.js';
import '#agents/items/tools/test/cms/fields-update.js';
import '#agents/items/tools/test/cms/fields-list.js';
import '#agents/items/tools/test/cms/items-create.js';
import '#agents/items/tools/test/cms/items-update.js';
import '#agents/items/tools/test/cms/items-list.js';
import '#agents/items/tools/test/cms/items-delete.js';
import '#agents/items/tools/test/cms/translate.js';
import '#agents/items/tools/test/vault/list.js';
import '#agents/items/tools/test/vault/get.js';
import '#agents/items/tools/test/vault/set.js';
import '#agents/items/tools/test/vault/clear.js';
import '#agents/items/agents/test/vault.js';
import '#agents/items/providers/anthropic.js';
import '#agents/items/providers/openai.js';
import '#agents/items/providers/local.js';
import '#agents/items/vault/keys.js';

/* Back facade */
$ot.agents = {
	run: (options) => agents.Fn('run', options),
	client: (options) => agents.Fn('client', options)
};

export default agents;
