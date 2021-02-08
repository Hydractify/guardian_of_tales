import { getRepository } from "typeorm";

import { Account } from "../entities/Account";

export class Tibia
{
	private constructor()
	{
		throw new TypeError("This class may not be instantiated.");
	}

	public static async fetchAccount(discordID: string): Promise<Account | undefined>
	{
		return getRepository(Account).findOne({ discordID });
	}

	/* returns whether there was account for that discord id */
	public static async grantCoins(discordID: string, coins: number): Promise<boolean>
	{
		const accountRepo = getRepository(Account);

		const result = await accountRepo.increment({ discordID }, "coins", coins);

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
