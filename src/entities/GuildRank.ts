import { Column, Entity, Generated } from "typeorm";

@Entity({ name: "guild_ranks" })
export class GuildRank
{
	@Generated("increment")
	@Column({ primary: true, type: "int", width: 11 })
	public readonly id: number;

	@Column({ name: "guild_id", type: "int", width: 11 })
	public readonly guildID: number;

	@Column({ type: "int", width: 11 })
	public readonly level: number;
}

