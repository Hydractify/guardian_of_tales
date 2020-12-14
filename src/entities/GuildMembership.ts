import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { Character } from "./Character";

@Entity({ name: "guild_membership" })
export class GuildMembership
{
	@OneToOne(() => Character)
	@JoinColumn({
		name: "player_id",
		referencedColumnName: "id",
	})
	public readonly character: Character;

	@Column({ primary: true, name: "player_id", type: "int", width: 11 })
	public readonly characterID: number;

	@Column({ name: "guild_id", type: "int", width: 11 })
	public readonly guildID: number;

	@Column({ name: "rank_id", type: "int", width: 11 })
	public readonly rankId: number;
}
