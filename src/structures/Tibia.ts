import { getConnection, getRepository } from "typeorm";

import { Account } from "../entities/Account";
import { Character, CharacterSex } from "../entities/Character";
import { Guild } from "../entities/Guild";
import { GuildMembership } from "../entities/GuildMembership";
import { GuildRank } from "../entities/GuildRank";

const items: Item[] = require("../../data/shop.json");

export class Tibia
{
	private constructor()
	{
		throw new TypeError("This class may not be instantiated.");
	}

	public static readonly SHOP_ITEMS: Item[] = items;
	public static readonly PREMIUM_BUY_OPTIONS: [number, number][] = [[30, 10_000], [60, 20_000], [90, 30_000]];

	/** Checks whether a string is a valid account name. (Only consists of lowercase letters) */
	public static checkAccountNameCasing(name: string): boolean
	{
		return !/[^a-z]/.test(name);
	}

	/**
	 * Checks whether a string is a valid character or guild name.
	 * This means that the name must only consist of lower case letters, upper case, letters and spaces.
	 * Additionally must each 'word' start with a upper case letter and must not have any further upper case letters.
	 */
	public static checkNameCasing(name: string): boolean
	{
		if (/[^A-Za-z ]/.test(name)) return false;

		return name.split(/ +/).every(word =>
			word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase(),
		);
	}

	/** Checks whether an account name is not yet in use. */
	public static async checkAccountNameAvailable(name: string): Promise<boolean>
	{
		const accounts = await getRepository(Account).find({ where: { name } });

		return accounts.length === 0;
	}

	public static async createAccount(discordID: string, name: string, password: string): Promise<Account>
	{
		const accountRepo = getRepository(Account);

		const account = accountRepo.create({
			discordID,
			name,
			password,
			creationDate: Math.trunc(Date.now() / 1000),
		});

		return accountRepo.save(account);
	}

	public static async fetchAccount(discordID: string): Promise<Account | undefined>
	{
		return getRepository(Account).findOne({ discordID });
	}

	public static async resetPassword(account: Account, password: string): Promise<void>
	{
		account.password = password;
		await getRepository(Account).save(account);
	}

	public static async checkCharacterNameAvailable(name: string): Promise<boolean>
	{
		const characters = await getRepository(Character).find({ where: { name } });

		return characters.length === 0;
	}

	public static async createCharacter(account: Account, name: string, sex: CharacterSex): Promise<Character>
	{
		const characterRepo = getRepository(Character);

		const character = characterRepo.create({
			accountID: account.id,
			name,
			sex,
			conditions: 0,
		});

		return characterRepo.save(character);
	}

	public static async buyPremium(account: Account, days: number, tokens: number): Promise<Account>
	{
		account.premiumEndsAt = Math.max(account.premiumEndsAt, Date.now() / 1000) + days * 24 * 60 * 60;
		account.tokens -= tokens;

		return getRepository(Account).save(account);
	}

	public static async setPremiumDays(account: Account, days: number): Promise<Account>
	{
		const premiumEndsAt = (Date.now() / 1000) + days * 24 * 60 * 60;
		if (account.premiumEndsAt >= premiumEndsAt) return account;
		account.premiumEndsAt = premiumEndsAt;
		return getRepository(Account).save(account);
	}

	public static async fetchCharacters(account: Account): Promise<Character[]>
	{
		return getRepository(Character).find({ where: { accountID: account.id }, relations: ["guildMembership"] });
	}

	public static async checkGuildNameAvailable(name: string): Promise<boolean>
	{
		const guilds = await getRepository(Guild).find({ where: { name } });

		return guilds.length === 0;
	}

	public static async createGuild(owner: Character, name: string, motd: string): Promise<Guild>
	{
		return getConnection().transaction<Guild>(async entitiyManager =>
		{
			const guild = entitiyManager.create(Guild, {
				ownerID: owner.id,
				motd,
				name,
				creationDate: Math.trunc(Date.now() / 1000),
			});

			await entitiyManager.save(guild);

			const [rank] = await entitiyManager.find(GuildRank, {
				where: { guildID: guild.id },
				order: { level: "DESC" },
				take: 1,
			});

			const guildMembership = entitiyManager.create(GuildMembership, {
				characterID: owner.id,
				guildID: guild.id,
				rankId: rank.id,
			});

			await entitiyManager.save(guildMembership);

			return guild;
		});
	}

	/* returns whether there was account for that discord id */
	public static async grantTokens(discordID: string, tokens: number): Promise<boolean>
	{
		const accountRepo = getRepository(Account);

		const result = await accountRepo.increment({ discordID }, "tokens", tokens);

		return result.affected !== 0;
	}

}


export type Item = {
	name: string;
	price: number;
	image: string;
	/** URL */
	wiki: string;
	description: string;
};
