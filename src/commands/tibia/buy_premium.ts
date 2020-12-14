import { Argument, ArgumentOptions, Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

import { Account } from "../../entities/Account";
import { ICustomCommandInhibitor } from "../../inhibitors/custom";
import { Tibia } from "../../structures/Tibia";

export default class BuyPremiumCommand extends Command implements ICustomCommandInhibitor
{
	public constructor()
	{
		super("tibia:buy_premium", {
			category: "tibia",
			aliases: ["buy-premium", "buy_premium", "buypremium"],
			description: "If you boost our guild or support us on patreon, premium is on us.",
		});
	}

	public * args(): IterableIterator<ArgumentOptions | Flag>
	{
		const options = Tibia.PREMIUM_BUY_OPTIONS.map(([days, price]) => `- ${days} days for ${price.toLocaleString()} tokens`).join("\n");

		const days = yield {
			type: Argument.validate("integer", (message, phrase, value: number) => Tibia.PREMIUM_BUY_OPTIONS.some(([days]) => days === value)),
			prompt: {
				start: `How many days of premium would you like to buy? Available options:\n${options}`,
				retry: `That is not a valid amount of days. Available options:\n${options}`,
			},
		};

		const tokens = Tibia.PREMIUM_BUY_OPTIONS.find(([d]) => d === days)![1];

		return { days, tokens };
	}

	public async inhibit(message: Message): Promise<boolean>
	{
		if (!await Tibia.fetchAccount(message.author.id))
		{
			await message.reply("you do not have a Tibia account.");
			return true;
		}

		return false;
	}

	public async exec(message: Message, { days, tokens }: { days: number; tokens: number; }): Promise<Message>
	{
		const account = await Tibia.fetchAccount(message.author.id) as Account;

		if (account.tokens < tokens)
		{
			return message.reply(`you do not have the required ${tokens.toLocaleString()} tokens in order to buy ${days} days of premium.`);
		}

		await Tibia.buyPremium(account, days, tokens);

		return message.reply(`you successfully added ${days} days of premium to your account.`);
	}
}
