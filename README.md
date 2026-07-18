# Orchestration

**The agentic engine of the instance.** Agents, tools and runs — packages declare what their agents can do, consumers hand them research questions and tasks, every run is recorded step by step.

Orchestration has no personality and no conversation. It is the machinery underneath: the one place that talks to the model API, the registries that say who exists and what they may run, and the log of everything that happened. Orah chats on top of it today; an automation package can drive the same agents tomorrow.

## The pieces

- **Agent** — a specialist: instructions, a one line description, and the list of tool ids it may run. Called two ways: `research` (a question expecting a precise answer) or `task` (an instruction expecting a report).
- **Tool** — what an agent actually runs: a command executed direct, or a plain callback. Declared with an input schema the model reads.
- **Run** — one execution: agent, mode, input, status (`pending → working → done | failed`), the tool calls made along the way, and the result. Stored in `orchestration_runs`, exposed for dashboards.
- **Client** — the single model API caller. Speaks Anthropic and OpenAI compatible dialects, picked by the endpoint, and returns one normalized shape either way.

## Declaring agents and tools

Packages ship their own agents. Install a package — the instance can do something new.

```js
onetype.AddonReady('orchestration.agents', (agents) =>
{
	agents.Item({
		id: 'slack',
		name: 'Slack',
		description: 'Sends messages and manages channels in the connected Slack workspace.',
		instructions: 'You operate the Slack workspace of this instance...',
		tools: ['slack:send', 'slack:channels']
	});
});

onetype.AddonReady('orchestration.tools', (tools) =>
{
	tools.Item({
		id: 'slack:send',
		description: 'Sends a message to a channel.',
		input: {
			channel: { type: 'string', required: true, description: 'Channel id or name.' },
			text: { type: 'string', required: true, description: 'The message.' }
		},
		command: 'connect:actions:run'
	});
});
```

## Model access

Configured through the vault, standard endpoint pattern — works with Claude, OpenAI or any compatible API:

| Key | What it is |
| --- | --- |
| `ORCHESTRATION_ENDPOINT` | Base URL of the model API |
| `ORCHESTRATION_API_KEY` | Key for that API, stored as a secret |
| `ORCHESTRATION_MODEL` | Model id to run |

## Commands

| Command | What it does |
| --- | --- |
| `orchestration:agents:many` | Lists every registered agent |
| `orchestration:tools:many` | Lists every registered tool |
| `orchestration:runs:many` | Lists the latest runs with their steps |

## Emitters

- `orchestration.runs.start` — a run began working
- `orchestration.runs.step` — a tool call was recorded inside a run
- `orchestration.runs.done` — a run finished, done or failed
