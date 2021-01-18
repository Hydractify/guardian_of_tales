import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { Account } from "../../entities/Account";
import { ICustomCommandInhibitor } from "../../inhibitors/custom";
import { Tibia } from "../../structures/Tibia";

export default class CheckCoinsCommand extends Command implements ICustomCommandInhibitor
{
	public constructor()
	{
		super("tibia:check_coins", {
			category: "tibia",
			aliases: ["check-coins", "check_coins", "checkcoins", "coins"],
			description: "Check the amount of tibia coins you currently have.",
		});
	}

	public async inhibit(message: Message): Promise<boolean>
	{
		if (!await Tibia.fetchAccount(message.author.id))
		{
			await message.reply("You do not have a Tibia account.");
			return true;
		}

		return false;
	}

	public async exec(message: Message): Promise<Message>
	{
		const account = await Tibia.fetchAccount(message.author.id) as Account;

		return message.reply(`you currently have ${account.coins} tibi coins.`);
	}
}
