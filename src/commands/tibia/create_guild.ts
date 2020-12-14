import { Argument, ArgumentOptions, Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

import { Character } from "../../entities/Character";
import { ICustomCommandInhibitor } from "../../inhibitors/custom";
import { Tibia } from "../../structures/Tibia";

const PREMIUM_REQUIRED = process.env.GUILD_REQUIRE_PREMIUM === "true";

export default class CreateGuildCommand extends Command implements ICustomCommandInhibitor
{
	public constructor()
	{
		super("tibia:create_guild", {
			category: "tibia",
			aliases: ["create-guild", "create_guild", "createguild"],
			description: "Create a Tibia guild.",
		});
	}

	public async * args(message: Message): AsyncIterator<ArgumentOptions | Flag, unknown, string>
	{
		const account = await Tibia.fetchAccount(message.author.id);
		const characters = await Tibia.fetchCharacters(account!);

		const prompt = this._formatCharactersPrompt(characters);

		const characterID: string = yield {
			type: characters.filter(c => !c.guildMembership).map(c => [c.id.toString(), c.name]),
			prompt: {
				start: "Please select the character you want to use to create a guild:\n" + prompt,
				retry: "You have to either enter the character name or number, try again.\n" + prompt,
			},
		};

		const character = characters.find(character => character.id === parseInt(characterID));

		const name = yield {
			type: Argument.compose(
				Argument.range("string", 3, 255, true),
				(message, name) => Tibia.checkNameCasing(name) ? name : Flag.fail("casing"),
				async (message, name) => (await Tibia.checkGuildNameAvailable(name)) ? name : Flag.fail("nameUsed"),
			),
			prompt: {
				start: "What should your Tibia guild name be? (3-255 characters)",
				modifyRetry: (message, text, data) =>
				{
					switch (data.failure && data.failure.value)
					{
						case "nameUsed":
							return "That guild name is already in use, please choose another.\n\nType `cancel` to cancel this command.";

						case "casing":
							return [
								"A guild name may only consist of space delimited words starting with a capitalized letters followed by lowercase letters.",
								"",
								"Type `cancel` to cancel this command.",
							].join("\n");

						default:
							return "The guild name must be 3 to 255 chars long.\n\nType `cancel` to cancel this command.";
					}
				},
			},
		};

		const motd = yield {
			type: Argument.range("string", 0, 255, true),
			prompt: {
				start: "Please enter the initial message of the day for your guild. (May be at most 255 characters long)",
				retry: "That was too long, try to keep it shorter, the message of the day may at most be 255 characters long.",
			},
		};

		return { account, character, name, motd };
	}

	public async inhibit(message: Message): Promise<boolean>
	{
		const account = await Tibia.fetchAccount(message.author.id);
		if (!account)
		{
			await message.reply("you do not have a Tibia account.");

			return true;
		}

		if (PREMIUM_REQUIRED && account.premiumEndsAt < (Date.now() / 1000))
		{
			await message.reply("you need a premium account in order to create guilds");

			return true;
		}

		const characters = await Tibia.fetchCharacters(account);
		if (!characters.find(c => !c.guildMembership))
		{
			await message.reply("you do not have any character that is not in a guild.");

			return true;
		}

		return false;
	}

	public async exec(message: Message, { character, name, motd }: { character: Character; name: string; motd: string; }): Promise<Message>
	{
		await Tibia.createGuild(character, name, motd);

		return message.reply("you successfully created a guild.");
	}

	private _formatCharactersPrompt(characters: Character[]): string
	{
		const paddingID = Math.max(...characters.map(c => c.id.toString().length));

		return characters.map(character =>
		{
			const line = `\`${character.id.toString().padStart(paddingID, " ")}\` - ${character.name}`;
			return character.guildMembership ? `~~${line}~~ Already in a guild.` : line;
		}).join("\n");
	}
}
