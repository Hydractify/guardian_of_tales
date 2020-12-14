import { Column, Entity, Generated } from "typeorm";

@Entity({ name: "guilds" })
export class Guild
{
	@Generated("increment")
	@Column({ primary: true, type: "int", width: 11 })
	public readonly id: number;

	@Column({ type: "varchar", width: 255 })
	public readonly name: string;

	/**
	 * Friendly reminder: This is a character id.
	 */
	@Column({ name: "ownerid", type: "int", width: 11 })
	public readonly ownerID: number;

	@Column({ name: "creation_date", type: "int", width: 11 })
	public readonly creationDate: number;

	@Column({ type: "varchar", length: 255 })
	public readonly motd: string;
}
