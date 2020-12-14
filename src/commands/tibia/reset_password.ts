import { Argument, Command } from "discord-akairo";
import { Message } from "discord.js";

import { Account } from "../../entities/Account";
import { ICustomCommandInhibitor } from "../../inhibitors/custom";
import { Tibia } from "../../structures/Tibia";

export default class ResetPasswordCommand extends Command implements ICustomCommandInhibitor
{
	public constructor()
	{
		super("tibia:reset_password", {
			category: "tibia",
			aliases: ["reset-password", "reset_password", "resetpassword"],
			channel: "dm",
			description: "Reset the password for your Tibia account. (DM only)",
			args: [{
				id: "password",
				type: Argument.range("string", 6, 40, true),
				prompt: {
					start: "What should your new Tibia password be? (6-40 characters long) [Make sure to delete it from here afterwards again.]",
					retry: "Your new password must be 6 to 40 characters long. [Make sure to delete it from here afterwards again.]",
				},
			}],
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

	public async exec(message: Message, { password }: { password: string; }): Promise<Message>
	{
		const account = await Tibia.fetchAccount(message.author.id) as Account;

		await Tibia.resetPassword(account, password);

		return message.channel.send("You sucessfully reset your password. [Make sure to delete it from this chat now.]");
	}
}
