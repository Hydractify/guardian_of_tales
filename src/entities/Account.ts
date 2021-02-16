import { Column, Entity, Generated } from "typeorm";

@Entity({ name: "accounts" })
export class Account
{
	@Generated("increment")
	@Column({ primary: true, type: "int", width: 11 })
	public readonly id: number;

	@Column({ name: "discord_id", type: "bigint", width: 20 })
	public readonly discordID: string;

	@Column({ name: "coins", type: "int", width: 12 })
	public coins: number;

	@Column({ name: "gambled_win", type: "int", width: 12 })
	public gambledWin: number;

	@Column({ name: "gambled_loss", type: "int", width: 12 })
	public gambledLoss: number;
}
