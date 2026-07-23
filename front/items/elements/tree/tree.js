onetype.AddonReady('elements', (elements) =>
{
    elements.ItemAdd({
        id: 'agents-tree',
        icon: 'account_tree',
        name: 'Agents tree',
        description: 'The whole crew of the instance as a living hierarchy: people-like personas, their child agents and the tools each one carries.',
        category: 'Agents',
        collection: 'Agents',
        author: 'OneType',
        config: {
            _open: {
                type: 'function',
                description: 'Called with { value } holding the agent when a row is opened.'
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

            this.title = (agent) =>
            {
                return agent.persona ? agent.persona.name + ' ' + agent.persona.surname : (agent.name ? agent.name : agent.id);
            };

            this.node = (agent) =>
            {
                const children = [
                    ...this.agents.filter((child) => child.parent === agent.id).map((child) => this.node(child)),
                    ...agent.tools.map((tool) => ({
                        id: agent.id + ':' + tool,
                        title: tool,
                        icon: 'construction',
                        color: 'orange',
                        badge: 'Tool'
                    }))
                ];

                return {
                    id: agent.id,
                    title: this.title(agent),
                    subtitle: agent.name ? agent.name : agent.description,
                    icon: agent.persona ? 'face' : 'smart_toy',
                    color: agent.persona && agent.persona.color ? agent.persona.color : 'brand',
                    badge: 'Agent',
                    meta: agent.persona && agent.persona.age ? String(agent.persona.age) : '',
                    children: children,
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
                <e-admin-status-loading ot-if="!agents" :background="0"></e-admin-status-loading>
                <e-admin-status-empty ot-if="agents && !agents.length" icon="hub" title="No agents yet" description="Install a package that ships an agent, or declare one of your own." :background="0"></e-admin-status-empty>
                <e-admin-views-tree ot-if="agents && agents.length" :items="nodes()" placeholder="Search agents and tools..." :background="1" :_open="open()"></e-admin-views-tree>
            `;
        }
    });
});
