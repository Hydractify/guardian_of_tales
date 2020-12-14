import { Argument, ArgumentOptions, Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

import { Account } from "../../entities/Account";
import { ICustomCommandInhibitor } from "../../inhibitors/custom";
import { Tibia } from "../../structures/Tibia";

export default class GambleTokensCommand extends Command implements ICustomCommandInhibitor
{
	public constructor()
	{
		super("tibia:gamble_tokens", {
			category: "tibia",
			aliases: ["gamble-tokens", "gamble_tokens", "gambletokens"],
			description: "Gamble your tokens.",
		});
	}

	public async * args(message: Message): AsyncIterator<ArgumentOptions | Flag, unknown, string>
	{
		const account = await Tibia.fetchAccount(message.author.id) as Account;

		const tokens = yield {
			type: Argument.range("integer", 1, account.tokens, true),
			prompt: {
				start: `How many tokens would you like to gamble? You have ${account.tokens} tokens.`,
				retry: `You have to gamble at least one and at most ${account.tokens} tokens.`,
			},
		};

		return { account, tokens };
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
		// TODO: Make them actually lose.
		return message.reply("you lost. :)");
	}
}
