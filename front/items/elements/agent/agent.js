elements.ItemAdd({
	id: 'agents-agent',
	icon: 'smart_toy',
	name: 'Agent',
	description: 'Single agent page: persona header, a section sidebar, the bio and instructions, the tools it carries and the child agents it commands.',
	category: 'Agents',
	collection: 'Agents',
	author: 'OneType',
	metadata: { addon: 'agents' },
	config: {
		id: {
			type: 'string',
			description: 'Id of the agent the page shows.'
		}
	},
	render: function()
	{
		this.agent = null;
		this.team = [];
		this.tools = [];
		this.section = 'overview';

		this.load = async () =>
		{
			const { data, code } = await $ot.command('agents:many', {}, true);

			if(code !== 200)
			{
				return;
			}

			const agent = data.agents.find((entry) => entry.id === this.id);

			if(!agent)
			{
				return;
			}

			const catalog = data.tools.reduce((map, tool) => ({ ...map, [tool.id]: tool }), {});

			this.agent = agent;
			this.team = data.agents.filter((entry) => entry.parent === agent.id);
			this.tools = agent.tools.map((tool) => catalog[tool] ? catalog[tool] : { id: tool, name: tool, description: '', input: {} });
		};

		this.title = () => this.agent.persona ? this.agent.persona.name + ' ' + this.agent.persona.surname : (this.agent.name ? this.agent.name : this.agent.id);

		this.sections = () => [
			{ id: 'overview', label: 'Overview', icon: 'info' },
			{ id: 'instructions', label: 'Instructions', icon: 'menu_book' },
			{ id: 'tools', label: 'Tools', icon: 'construction', hint: this.tools.length + (this.tools.length === 1 ? ' tool' : ' tools') },
			{ id: 'team', label: 'Team', icon: 'group', hint: this.team.length + (this.team.length === 1 ? ' agent' : ' agents') }
		];

		this.jump = ({ value }) =>
		{
			this.section = value.id;

			const target = this.Element.querySelector('[data-section="' + value.id + '"]');

			target && target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		};

		this.details = () => [
			{ label: 'Id', value: this.agent.id, type: 'mono' },
			{ label: 'Role', value: this.agent.name, type: 'chips' },
			{ label: 'Age', value: this.agent.persona && this.agent.persona.age ? String(this.agent.persona.age) : null, type: 'mono' },
			{ label: 'Parent', value: this.agent.parent ? this.agent.parent : null, type: 'chips' },
			{ label: 'Tools', value: String(this.tools.length), type: 'mono', icon: 'construction' }
		];

		this.teamRows = () =>
		{
			return this.team.map((entry) => ({
				id: entry.id,
				title: entry.persona ? entry.persona.name + ' ' + entry.persona.surname : (entry.name ? entry.name : entry.id),
				description: entry.description,
				icon: entry.persona ? 'face' : 'smart_toy',
				status: { label: entry.name ? entry.name : 'Agent', color: entry.persona && entry.persona.color ? entry.persona.color : 'brand' },
				onClick: () => $ot.page('/agents/' + entry.id)
			}));
		};

		this.parameters = (schema) =>
		{
			return Object.entries(schema || {}).map(([name, config]) => ({ name, ...config }));
		};

		this.crumbs = () => [
			{ label: 'Agents', icon: 'hub', onClick: () => $ot.page('/agents') },
			{ label: this.title() }
		];

		this.chips = () => this.tools.map((tool) => ({ id: tool.id, label: tool.name ? tool.name : tool.id, tooltip: tool.description }));

		this.OnReady(() => this.load());

		return /* html */ `
			<div ot-if="agent" class="box">
				<e-global-header
					icon="smart_toy"
					:accent="agent.persona && agent.persona.color ? agent.persona.color : 'brand'"
					eyebrow="Agent"
					:title="title()"
					:description="agent.persona && agent.persona.bio ? agent.persona.bio : agent.description"
					:meta="[agent.name ? agent.name : agent.id, tools.length + (tools.length === 1 ? ' tool' : ' tools')]"
					:background="1"
					container="m"
					pattern="dots"
				>
					<div slot="top">
						<e-navigation-breadcrumbs :items="crumbs()"></e-navigation-breadcrumbs>
					</div>
					<div slot="bottom" class="ot-flex-vertical ot-gap-s">
						<e-global-tags ot-if="tools.length" :items="chips()" :background="3"></e-global-tags>
					</div>
				</e-global-header>

				<div class="columns ot-container-m ot-py-l">
					<aside class="side">
						<e-views-sidebar :items="sections()" :active="section" :_select="jump"></e-views-sidebar>
					</aside>

					<div class="content">
						<div class="block" data-section="overview">
							<e-global-heading title="Overview" description="Who this agent is and what it exists for." element="h3" :border="true"></e-global-heading>
							<e-global-markdown :content="agent.description" :background="0"></e-global-markdown>
							<e-data-details :items="details()" :background="1"></e-data-details>
						</div>

						<div class="block" data-section="instructions">
							<e-global-heading title="Instructions" description="The system instructions the agent runs with." element="h3" :border="true"></e-global-heading>
							<e-global-markdown ot-if="agent.instructions" :content="agent.instructions" :background="1"></e-global-markdown>
							<e-status-empty ot-if="!agent.instructions" icon="menu_book" title="No instructions" description="This agent runs without custom instructions."></e-status-empty>
						</div>

						<div class="block" data-section="tools">
							<e-global-heading title="Tools" description="What this agent may run on its own." element="h3" :border="true"></e-global-heading>
							<e-status-empty ot-if="!tools.length" icon="construction" title="No own tools" description="This agent only carries the global tools every agent receives."></e-status-empty>
							<div class="ot-flex-vertical ot-gap-s">
								<div ot-for="tool in tools" :ot-key="tool.id">
									<e-core-section :title="tool.name ? tool.name : tool.id" :description="tool.description" icon="construction" :collapsible="true" :collapsed="true">
										<div slot="content" class="ot-flex-vertical ot-gap-m">
											<div ot-if="parameters(tool.input).length" class="ot-flex-vertical ot-gap-s">
												<e-global-heading title="Input" element="h3"></e-global-heading>
												<e-global-parameters :items="parameters(tool.input)" :background="2"></e-global-parameters>
											</div>
											<p ot-if="!parameters(tool.input).length" class="quiet">The tool runs without parameters.</p>
										</div>
									</e-core-section>
								</div>
							</div>
						</div>

						<div class="block" data-section="team">
							<e-global-heading title="Team" description="Child agents only this one sees and delegates to." element="h3" :border="true"></e-global-heading>
							<e-views-list ot-if="team.length" :items="teamRows()" :background="1"></e-views-list>
							<e-status-empty ot-if="!team.length" icon="group" title="No team" description="This agent works alone."></e-status-empty>
						</div>
					</div>
				</div>
			</div>
		`;
	}
});
