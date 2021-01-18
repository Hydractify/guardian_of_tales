import { Message } from "discord.js";
import { Listener } from "discord-akairo";

import { Tibia } from "../structures/Tibia";

export default class MessageInvalidListener extends Listener
{
	public constructor()
	{
		super("messageInvalid", {
			emitter: "commandHandler",
			event: "messageInvalid",
		});
	}

	public async exec(message: Message): Promise<void>
	{
		if (message.author.bot) return;

		if (message.createdTimestamp > message.author.lastCreditedMessageTimestamp + 1_000)
		{
			message.author.lastCreditedMessageTimestamp = message.createdTimestamp;
			await Tibia.grantCoins(message.author.id, 1);
		}
	}
}
