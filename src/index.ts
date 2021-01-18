import "reflect-metadata";

import "./structures/User";

import { Client } from "./structures/Client";

const client: Client = new Client({
	allowedMentions: { parse: ["users"] },
	ws: {
		intents: [
			"GUILDS",
			"GUILD_MESSAGES",
		],
	},
});

client
	.login()
	.catch((error) =>
	{
		console.error(error);
		process.exit(1);
	});
