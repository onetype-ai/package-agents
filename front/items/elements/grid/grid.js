onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'agents-grid',
		icon: 'hub',
		name: 'Agents grid',
		description: 'Every registered agent of the instance as a card: name, purpose and how many tools it carries.',
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

			this.load = async () =>
			{
				const { data, code } = await $ot.command('agents:many', {}, true);

				this.agents = code === 200 ? data.agents : [];
			};

			this.load();

			this.meta = (agent) =>
			{
				const total = agent.tools.length;

				return total ? [total + (total === 1 ? ' tool' : ' tools')] : ['No own tools'];
			};

			this.open = (agent) => () =>
			{
				if(this._open)
				{
					this._open({ value: agent });
				}
			};

			return /* html */ `
				<e-status-loading ot-if="!agents" :background="0"></e-status-loading>
				<e-status-empty ot-if="agents && !agents.length" icon="hub" title="No agents yet" description="Install a package that ships an agent, or declare one of your own." :background="0"></e-status-empty>
				<div ot-if="agents && agents.length" class="grid">
					<e-cards-item
						ot-for="agent in agents"
						:ot-key="agent.id"
						icon="smart_toy"
						color="blue"
						eyebrow="Agent"
						:title="agent.name ? agent.name : agent.id"
						:description="agent.description"
						badge=""
						:meta="meta(agent)"
						:_click="open(agent)"
					>
						<div slot="bottom">
							<e-global-tags ot-if="agent.tools.length" :items="agent.tools" :background="2"></e-global-tags>
						</div>
					</e-cards-item>
				</div>
			`;
		}
	});
});
