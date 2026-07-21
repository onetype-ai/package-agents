import agents from '#agents/addon.js';

/* Core */
import '#agents/_/schemas/agent.js';

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
import '#agents/items/tools/agent.js';
import '#agents/items/tools/test/time.js';
import '#agents/items/tools/test/user.js';
import '#agents/items/providers/anthropic.js';
import '#agents/items/providers/openai.js';
import '#agents/items/providers/local.js';
import '#agents/items/providers/claude-code.js';
import '#agents/items/vault/keys.js';

/* Back facade */
$ot.agents = {
	run: (options) => agents.Fn('run', options),
	client: (options) => agents.Fn('client', options),
	items: () => Object.values(agents.Items())
};

export default agents;
