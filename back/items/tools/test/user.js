/* Temporary test tool — delete once real tools exist. */

onetype.AddonReady('agents.tools', (tools) =>
{
	tools.Item({
		id: 'test:user',
		name: 'Logged user',
		description: 'Returns who the signed in user is.',
		isGlobal: true,
		input: {},
		callback: function()
		{
			const user = this.http?.state?.user;

			if(!user)
			{
				return 'Nobody is signed in.';
			}

			return JSON.stringify({ id: user.id, name: user.name || null, email: user.email || null });
		}
	});
});
