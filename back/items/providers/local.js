onetype.AddonReady('agents.providers', (providers) =>
{
    providers.Item({
        id: 'local',
        name: 'Local',
        description: 'The self hosted vLLM server on the local network. Speaks the OpenAI dialect, so it borrows the OpenAI callbacks.',
        endpoint: 'http://192.168.1.3:8199',
        models: [
            {
                id: 'qwen3.5-9b',
                input: 0,
                output: 0,
                name: 'Qwen 3.5 9B',
                description: 'The local workhorse, runs on our own metal.'
            }
        ],
        send: (request) =>
        {
            const built = providers.ItemGet('openai').Get('send')(request);

            /* Flip to true to let the model think before answering. */
            built.body.chat_template_kwargs = { enable_thinking: false };

            return built;
        },
        receive: (raw) => providers.ItemGet('openai').Get('receive')(raw)
    });
});
