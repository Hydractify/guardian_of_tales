import { createHash } from "crypto";
import { Column, Entity, Generated } from "typeorm";

@Entity({ name: "accounts" })
export class Account
{
	@Generated("increment")
	@Column({ primary: true, type: "int", width: 11 })
	public readonly id: number;

	@Column({ type: "varchar", length: 32 })
	public readonly name: string;

	// Ensure the password is hashed by doing this when assigning it
	@Column({ type: "char", length: 40, select: false })
	public get password(): string
	{
		return this._password;
	}
	public set password(password: string)
	{
		this._password = createHash("sha1").update(password).digest("hex");
	}
	private _password: string;

	@Column({ name: "premium_ends_at", type: "int", width: 11 })
	public premiumEndsAt: number;

	@Column({ name: "discord_id", type: "bigint", width: 20 })
	public readonly discordID: string;

	@Column({ name: "creation_date", type: "int", width: 11 })
	public readonly creationDate: number;


	@Column({ name: "tokens", type: "int", width: 11 })
	public tokens: number;
}
