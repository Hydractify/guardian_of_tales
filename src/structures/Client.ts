import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { ClientOptions } from "discord.js";
import { join } from "path";

import { connect } from "./Database";

declare module "discord-akairo"
{
	interface AkairoClient
	{
		readonly commandHandler: CommandHandler;
		readonly listenerHandler: ListenerHandler;
	}
}

export class Client extends AkairoClient
{
	public readonly commandHandler: CommandHandler;
	public readonly listenerHandler: ListenerHandler;

	public constructor(options: ClientOptions)
	{
		super({
			ownerID: process.env.OWNERS?.split(","),
		}, options);

		this.commandHandler = new CommandHandler(this, {
			directory: join(__dirname, "..", "commands"),
			prefix: "t!",
			argumentDefaults: {
				prompt: {
					modifyStart: (message, text) => `${text}\n\nType \`cancel\` to cancel this command.`,
					modifyRetry: (message, text) => `${text}\n\nType \`cancel\` to cancel this command.`,
					timeout: "Time ran out, command has been cancelled.",
					cancel: "Command has been cancelled.",
					retries: Infinity,
					time: 30_000,
				},
			},
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: join(__dirname, "..", "listeners"),
		});

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			ws: this.ws,
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
	}

	public async login(token?: string): Promise<string>
	{
		await connect();
		return super.login(token);
	}
}
