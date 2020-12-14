import { ArgumentOptions, Flag, Argument, Command } from "discord-akairo";
import { Message } from "discord.js";

import { ICustomCommandInhibitor } from "../../inhibitors/custom";
import { Tibia } from "../../structures/Tibia";

export default class CreateAccountCommand extends Command implements ICustomCommandInhibitor
{
	public constructor()
	{
		super("tibia:create_account", {
			category: "tibia",
			aliases: ["create-account", "create_account", "createaccount", "register"],
			channel: "dm",
			description: "Create a Tibia account. (DM only)",
		});
	}

	public * args(): IterableIterator<ArgumentOptions | Flag>
	{
		const name = yield {
			type: Argument.compose(
				Argument.range("string", 3, 32, true),
				(message, name) => Tibia.checkAccountNameCasing(name) ? name : Flag.fail("casing"),
				async (message, name) => (await Tibia.checkAccountNameAvailable(name)) ? name : Flag.fail("nameUsed"),
			),
			prompt: {
				start: "What should the name of your Tibia be? (3-32 characters, only lowercase letters)",
				modifyRetry: (message, text, data) =>
				{
					switch (data.failure && data.failure.value)
					{
						case "nameUsed":
							return "That account name is already in use, please choose another.\n\nType `cancel` to cancel this command.";

						case "casing":
							return "Account names may only consist of letters a to z, downcased.\n\nType `cancel` to cancel this command.";

						default:
							return "Account names must be 3 to 32 chars long.\n\nType `cancel` to cancel this command.";
					}
				},
			},
		};

		const password = yield {
			type: Argument.range("string", 6, 40, true),
			prompt: {
				start: "What should your Tibia password be? (6-40 characters long) [Make sure to delete it from here afterwards again.]",
				retry: "Your password must be 6 to 40 characters long. [Make sure to delete it from here afterwards again.]",
			},
		};

		return { name, password };
	}

	public async inhibit(message: Message): Promise<boolean>
	{
		if (await Tibia.fetchAccount(message.author.id))
		{
			await message.reply([
				"You already created a Tibia account, no need to do that again.",
				"If you want to reset its password use the `resetpassword` command instead.",
			].join("\n"));

			return true;
		}
		return false;
	}

	public async exec(message: Message, { name, password }: { name: string; password: string; }): Promise<Message>
	{
		await Tibia.createAccount(message.author.id, name, password);

		return message.channel.send("You successfully created your account. [Make sure to delete the password from this chat now.]");
	}
}
