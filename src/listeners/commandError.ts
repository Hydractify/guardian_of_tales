import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";

export default class CommandErrorListener extends Listener
{
	public constructor()
	{
		super("commandError", {
			emitter: "commandHandler",
			event: "error",
		});
	}

	public async exec(error: Error, message: Message, command?: Command): Promise<void>
	{
		console.error(
			[
				`An error occured in ${command?.constructor.name ?? "<An inhibitor>"} when handling a message from ${message.author.id}`,
				`in ${message.channel.id} (${message.guild ? "guild" : "dm"}) with the content ${message.content}`,
			].join(" "),
			error,
		);

		await message.reply("something went wrong.");
	}
}
