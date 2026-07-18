import agents from '#agents/addon.js';

/* Core */
import '#agents/core/schemas/agent.js';

/* Addons */
import '#agents/addons/tools/load.js';
import '#agents/addons/runs/load.js';

/* Functions */
import '#agents/functions/client.js';

/* Items */
import '#agents/items/commands/crud/many.js';
import '#agents/items/tools/list.js';
import '#agents/items/vault/keys.js';

export default agents;
