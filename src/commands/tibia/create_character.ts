import { ArgumentOptions, Argument, Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

import { Account } from "../../entities/Account";
import { CharacterSex } from "../../entities/Character";
import { ICustomCommandInhibitor } from "../../inhibitors/custom";
import { Tibia } from "../../structures/Tibia";

export default class CreateCharacterCommand extends Command implements ICustomCommandInhibitor
{
	public constructor()
	{
		super("tibia:create_character", {
			category: "tibia",
			aliases: ["create-character", "create_character", "createcharacter"],
			description: "Create a Tibia character.",
		});
	}

	public * args(): IterableIterator<ArgumentOptions | Flag>
	{
		const name = yield {
			type: Argument.compose(
				Argument.range("string", 3, 255, true),
				(message, name) => Tibia.checkNameCasing(name) ? name : Flag.fail("casing"),
				async (message, name) => (await Tibia.checkCharacterNameAvailable(name)) ? name : Flag.fail("nameUsed"),
			),
			prompt: {
				start: "What should your new character's name be? (3-32 characters)",
				modifyRetry: (message, text, data) =>
				{
					switch (data.failure && data.failure.value)
					{
						case "nameUsed":
							return "That character name is already in use, please choose another.\n\nType `cancel` to cancel this command.";

						case "casing":
							return [
								"A character name may only consist of space delimited words starting with a capitalized letters followed by lowercase letters.",
								"",
								"Type `cancel` to cancel this command.",
							].join("\n");

						default:
							return "Your character's name must be 3 to 255 chars long.\n\nType `cancel` to cancel this command.";
					}
				},
			},
		};

		const sex = yield {
			type: [
				[CharacterSex.FEMALE.toString(), CharacterSex[CharacterSex.FEMALE], "f"],
				[CharacterSex.MALE.toString(), CharacterSex[CharacterSex.MALE], "m"],
			],
			prompt: {
				start: "Do you want your character to be female or male?",
				retry: "Do you want your character to be female or male?",
			},
		};

		return { name, sex };
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

	public async exec(message: Message, { name, sex }: { name: string, sex: /* enum key as string */ string; }): Promise<Message>
	{
		const account = await Tibia.fetchAccount(message.author.id) as Account;
		await Tibia.createCharacter(account, name, parseInt(sex) as CharacterSex);

		return message.reply("you successfully created a character.");
	}
}
