import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PrefixCommand extends Command
{
	public constructor()
	{
		super("prefix", {
			aliases: ["prefix"],
			description: "The command prefix.",
		});
	}

	public exec(message: Message): Promise<Message>
	{
		return message.reply(`the command prefix is ${this.getPrefix()}`);
	}

	private getPrefix(): string
	{
		const prefix = this.client.commandHandler.prefix;
		if (typeof prefix === "string") return prefix;
		if (prefix instanceof Array) return prefix.join(", ");
		return this.client.user!.toString();
	}
}
