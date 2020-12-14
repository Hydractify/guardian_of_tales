import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";

export default class CommandBlockedListener extends Listener
{
	public constructor()
	{
		super("commandBlocked", {
			emitter: "commandHandler",
			event: "commandBlocked",
		});
	}

	public async exec(message: Message, command: Command, reason: string): Promise<void>
	{
		console.log(`Command ${command} from ${message.author.id} blocked in ${message.channel.id} (${message.guild ? "guild" : "dm"}) with reason ${reason}`);

		switch (reason)
		{
			case "dm":
				await message.reply("this command may only be executed in DMs.");
				break;

			case "guild":
				await message.reply("this command may only be executed in the server.");
				break;

			case "owner":
				await message.reply("you may not use this command.");
				break;

		}
	}
}
