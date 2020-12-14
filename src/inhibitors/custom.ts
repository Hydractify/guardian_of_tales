import { Command, Inhibitor } from "discord-akairo";
import { Message } from "discord.js";

export default class CustomInhibitor extends Inhibitor
{
	public constructor()
	{
		super("custom", {
			reason: "custom",
			type: "post",
		});
	}

	public exec(message: Message, command?: Command | Command & ICustomCommandInhibitor): boolean | Promise<boolean>
	{
		if (!command) return false;

		if ("inhibit" in command)
		{
			return command.inhibit(message);
		}

		return false;
	}
}

export interface ICustomCommandInhibitor
{
	inhibit(message: Message): boolean | Promise<boolean>;
}
