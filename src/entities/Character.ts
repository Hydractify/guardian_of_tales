import { Column, Entity, Generated, OneToOne } from "typeorm";

import { GuildMembership } from "./GuildMembership";

@Entity({ name: "players" })
export class Character
{
	@Generated("increment")
	@Column({ primary: true, type: "int", width: 11 })
	public readonly id: number;

	@Column({ type: "varchar", length: 255 })
	public readonly name: string;

	@Column({ name: "account_id", type: "int", width: 11 })
	public readonly accountID: number;

	@Column({ type: "blob", select: false })
	public readonly conditions: number;

	@Column({ type: "int", width: 11 })
	public readonly sex: CharacterSex;

	@OneToOne(() => GuildMembership, membership => membership.character)
	public guildMembership: GuildMembership | undefined;
}

export enum CharacterSex {
	FEMALE = 0,
	MALE = 1,
}
