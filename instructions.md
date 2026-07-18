# Instructions — where we are and what comes next

Written 2026-07-18, at the point where we paused. The system is PROVEN — a local
9B model chains ten fake CMS tools, delegates to a vault agent and reports back
honestly. What follows is the state, the decisions we locked, and the open work.

## What this package is

The agentic engine of the instance. The ONLY layer that talks to a model API.
No personality, no conversation — registries, one client, one executor, receipts.

- **Root addon `agents`** — the agent registry itself. An agent is an item:
  id, name, description (one line callers read to pick it), instructions,
  tools (ids, on top of the globals), model (provider/model override).
- **`agents.providers`** — each provider item carries `send`/`receive` callbacks
  translating the standardized shape to its API dialect (anthropic, openai;
  local borrows the OpenAI pair via `ItemGet('openai').Get('send')`). On
  `ItemOn('add')` a provider declares its own vault keys (`AGENTS_<ID>_ENDPOINT`
  with the default as declared value, `AGENTS_<ID>_API_KEY` secret) under the
  Agents category, one group per provider. Models carry input/output prices in
  cents per million tokens.
- **`agents.tools`** — a tool runs a `command` (direct, skips condition) or a
  `callback`. `isGlobal: true` = every agent gets it. `Fn('for', agent)` resolves
  an agent's tools + globals, `Fn('definition')` builds the model-facing schema,
  `Fn('run')` executes by sanitized name.
- **`agents.requests`** — every model call leaves a receipt: input/output JSON,
  tokens, cost (computed from model prices), duration, caller, run, status.
  Recording is best effort — it never sinks the call. This is the money log.
- **`agents.runs`** — table exists, NOT wired yet. Meant for the async layer.
- **`Fn('client')`** — the one model caller. Standardized contract:
  in `{ model: 'provider/model', system, messages, tools, caller, run }`,
  messages are `{ role: user|assistant, text, calls }` and `{ role: tool, id, output }`,
  out `{ text, calls, stop: end|tools|length, usage: { input, output } }`.
- **`Fn('run')`** — the executor. Modes `conversation | research | task` (mode is
  a property of the CALL, not the agent — that is what makes Orah just an agent).
  Tool loop up to 24 rounds, returns `{ text, messages, steps }`. Extends
  `context._agents` (the delegation chain) and pushes every tool call into
  `context._trace` when the caller opened one.
- **Global tools**: `agents:list` (catalog as id | description) and `agents:run`
  (REAL delegation — research/task on another agent, cycle guard via the chain,
  depth capped at 4).
- **Vault**: `AGENTS_MODEL` = default `provider/model` selector
  (currently `local/qwen3.6-27b` — the vLLM at 192.168.1.3:8199, actually a 9B
  AWQ; needs `--enable-auto-tool-choice --tool-call-parser qwen3_xml`).

## Temporary — DELETE when real packages ship their own

- `back/items/tools/test/` — time, user, 10 fake in-memory CMS tools (store.js).
- `back/items/tools/test/vault/` + `back/items/agents/test/vault.js` — the vault
  agent and its four real tools belong in the VAULT package, declared through
  `AddonReady('agents', ...)` / `AddonReady('agents.tools', ...)`.

## Decisions locked

- LLM API is called EXCLUSIVELY here. Consumers use `$ot.agents.run/client`.
- Orchestration is not a system — it is a capability an agent gets through
  `agents:list` + `agents:run`. Whoever holds them is an orchestrator.
- Packages ship their own agents and tools; install a package, the instance
  can do something new.
- Secret values never reach a model. Tools report "stored", nothing more.

## Next, in rough order

1. **Think the system through before building more** — that is why we stopped.
2. **Runner / async layer** — wire `agents.runs`: a run row per `agents:run`
   (parent, depth, status, steps, result), background execution, emitters
   feeding a LIVE trace (today the chat shows steps only after completion).
   Decision already made: runner/daemon model, message in DB → runner picks it
   up → front polls or listens. NOT a long HTTP request chain.
3. **Requests → runs linkage** — client already accepts `run`, nobody passes it.
4. **Real agents in real packages** — vault first (move the test one), then
   connect (providers/actions as tools — actions map 1:1), then cms when it exists.
5. **Model routing** — cheap local model for mechanical agents, frontier for
   orchestration; the per-agent `model` field already supports it.
6. **History discipline** — every round resends the whole history (a 10-tool
   chain burned ~40k input tokens). Truncation / summarization needed.
7. **Streaming** — client is single-shot JSON; SSE streaming exists in git
   history (orah package, commit `8a40c04`) if needed.
8. **Reasoning leak** — small models sometimes narrate internals; consider an
   instruction line or output filter.
