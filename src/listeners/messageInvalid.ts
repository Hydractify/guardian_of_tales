import { Message } from "discord.js";
import { Listener } from "discord-akairo";

import { Tibia } from "../structures/Tibia";

const COIN_INTERVAL = parseInt(process.env.COIN_INTERVAL!);

if (Number.isNaN(COIN_INTERVAL))
{
	console.error("COIN_INTERVAL is not specified or NaN, users won't get any coins for activity");
}

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
		if (Number.isNaN(COIN_INTERVAL)) return;
		if (message.author.bot) return;
		if (!message.guild) return;

		if (message.createdTimestamp > message.author.lastCreditedMessageTimestamp + COIN_INTERVAL)
		{
			message.author.lastCreditedMessageTimestamp = message.createdTimestamp;
			await Tibia.grantCoins(message.author.id, 1);
		}
	}
}
