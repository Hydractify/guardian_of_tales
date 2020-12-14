import { Command } from "discord-akairo";
import { Constants, Message } from "discord.js";

import { Account } from "../../entities/Account";
import { ICustomCommandInhibitor } from "../../inhibitors/custom";
import { Tibia } from "../../structures/Tibia";

export default class ClaimPremiumCommand extends Command implements ICustomCommandInhibitor
{
	public constructor()
	{
		super("tibia:claim_premium", {
			category: "tibia",
			aliases: ["claim-premium", "claim_premium", "claimpremium"],
			description: "If you boost our guild or support us on patreon, premium is on us.",
		});
	}

	public async inhibit(message: Message): Promise<boolean>
	{
		if (!process.env.HOME_GUILD)
		{
			console.error("There is no home guild configured, but claim premium was used!");

			await message.reply("there is no home guild configured, this should not happen.");
			return true;
		}

		const guild = this.client.guilds.resolve(process.env.HOME_GUILD!);
		if (!guild)
		{
			console.error("Could not find the configured home guild.");

			await message.reply("could not find the home guild, this should not happen.");
			return true;
		}

		const member = await guild.members.fetch({ user: message.author, force: true }).catch(error =>
		{
			if (error.code === Constants.APIErrors.UNKNOWN_MEMBER) return null;
			throw error;
		});
		if (!member)
		{
			await message.reply("could not find you in the home guild, this should not happen.");
			return true;
		}

		if (!await Tibia.fetchAccount(message.author.id))
		{
			await message.reply("you do not have a Tibia account.");
			return true;
		}

		if (!member.premiumSinceTimestamp && !member.roles.cache.has(process.env.PATRON_ROLE!))
		{
			await message.reply("you either have to boost our guild or support us on patreon to use this command.");

			return true;
		}

		return false;
	}

	public async exec(message: Message): Promise<Message>
	{
		const account = await Tibia.fetchAccount(message.author.id) as Account;

		await Tibia.setPremiumDays(account, 30);

		return message.reply("enjoy your 30 days of premium starting now.");
	}
}
