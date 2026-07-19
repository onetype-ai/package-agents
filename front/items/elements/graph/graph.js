onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'agents-graph',
		icon: 'graph_3',
		name: 'Agents graph',
		description: 'The whole crew on one wide canvas: personas as cards, child agents wired to their parents and every tool hanging off its owner.',
		category: 'Agents',
		collection: 'Agents',
		author: 'OneType',
		config: {
			_open: {
				type: 'function',
				description: 'Called with { value } holding the agent when a card is opened.'
			}
		},
		render: function()
		{
			this.agents = null;
			this.catalog = {};

			this.load = async () =>
			{
				const { data, code } = await $ot.command('agents:many', {}, true);

				this.catalog = code === 200 ? data.tools.reduce((map, tool) => ({ ...map, [tool.id]: tool }), {}) : {};
				this.agents = code === 200 ? data.agents : [];
			};

			this.load();

			this.title = (agent) =>
			{
				return agent.persona ? agent.persona.name + ' ' + agent.persona.surname : (agent.name ? agent.name : agent.id);
			};

			this.initials = (agent) =>
			{
				return agent.persona ? agent.persona.name.charAt(0) + agent.persona.surname.charAt(0) : '';
			};

			this.node = (agent) =>
			{
				return {
					id: agent.id,
					title: this.title(agent),
					subtitle: agent.name ? agent.name : agent.id,
					description: agent.persona && agent.persona.bio ? agent.persona.bio : agent.description,
					avatar: this.initials(agent),
					icon: 'smart_toy',
					color: agent.persona && agent.persona.color ? agent.persona.color : 'brand',
					badge: 'Agent',
					meta: agent.persona && agent.persona.age ? agent.persona.age + ' yrs' : '',
					tags: agent.tools.map((tool) => ({
						label: this.catalog[tool] && this.catalog[tool].name ? this.catalog[tool].name : tool,
						tooltip: this.catalog[tool] && this.catalog[tool].description ? this.catalog[tool].description : tool
					})),
					children: this.agents.filter((child) => child.parent === agent.id).map((child) => this.node(child)),
					agent: agent
				};
			};

			this.nodes = () => this.agents.filter((agent) => !agent.parent).map((agent) => this.node(agent));

			this.open = () => ({ value }) =>
			{
				if(this._open && value.agent)
				{
					this._open({ value: value.agent });
				}
			};

			return /* html */ `
				<e-status-loading ot-if="!agents" :background="0"></e-status-loading>
				<e-status-empty ot-if="agents && !agents.length" icon="hub" title="No agents yet" description="Install a package that ships an agent, or declare one of your own." :background="0"></e-status-empty>
				<e-views-graph ot-if="agents && agents.length" :items="nodes()" :background="0" :_open="open()"></e-views-graph>
			`;
		}
	});
});
