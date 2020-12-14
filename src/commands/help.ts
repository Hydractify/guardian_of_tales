import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class HelpCommand extends Command
{
	public constructor()
	{
		super("help", {
			aliases: ["help"],
			description: "A list of all available commands.",
		});
	}

	public exec(message: Message): Promise<Message>
	{
		const help =
			this.client.commandHandler.categories.map((category, categoryName) =>
			{
				const commands = category.map(command => `- ${command.aliases[0]} - ${command.description}`).join("\n");

				return `__**${this.capitalize(categoryName)}**__:\n${commands}`;
			});
		return message.channel.send(help);
	}

	private capitalize(s: string): string
	{
		return s[0].toUpperCase() + s.slice(1);
	}
}
