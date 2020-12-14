import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PingCommand extends Command
{
	public constructor()
	{
		super("ping", {
			aliases: ["ping"],
			description: "Pongs, just for you.",
		});
	}

	public exec(message: Message): Promise<Message>
	{
		return message.reply("pong");
	}
}
