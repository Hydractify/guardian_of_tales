import { Listener } from "discord-akairo";
import
{
	APIApplicationCommandInteractionDataOption,
	APIInteractionApplicationCommandCallbackData,
	APIInteractionResponseType,
	GatewayInteractionCreateDispatchData,
	InteractionType,
	MessageFlags,
	RESTPostAPIInteractionCallbackJSONBody,
	Snowflake,
} from "discord-api-types/v8";

import { Tibia } from "../structures/Tibia";

export default class InteractionCreateListener extends Listener
{
	public constructor()
	{
		super("interactionCreate", {
			emitter: "ws",
			event: "INTERACTION_CREATE",
		});
	}

	public async exec({ id, type, token, guild_id, member: { user: { id: userId } }, data }: GatewayInteractionCreateDispatchData): Promise<void>
	{
		if (!data || type !== InteractionType.ApplicationCommand) return;
		if (!guild_id) return;

		const {
			name,
			options,
		} = data;

		if (name === "checkcoins")
		{
			await this.checkCoins(id, token, userId, options || []);
		}
		else if (name === "gamble")
		{
			await this.gamble(id, token, userId, options || []);
		}
		else
		{
			await this.respondEphemeral(id, token, { content: `Unknown command ${name}.` });
		}
	}

	// These should probably be restructured, if more get added.
	private async checkCoins(id: Snowflake, token: string, userId: Snowflake, options: APIApplicationCommandInteractionDataOption[])
	{
		const account = await Tibia.fetchAccount(userId);
		if (!account) return this.respondAccountSignup(id, token);

		const show: boolean = options.find(option => option.name === "show")?.value as boolean ?? false;

		const response = `You currently have ${account.coins} coin${account.coins === 1 ? "" : "s"}.`;

		if (show)
		{
			return this.respondNormal(id, token, {
				content: `${response.slice(0, -1)}, <@${userId}>.`,
			});
		}
		else
		{
			return this.respondEphemeral(id, token, { content: response });
		}
	}

	private async gamble(id: Snowflake, token: string, userId: Snowflake, options: APIApplicationCommandInteractionDataOption[])
	{
		const account = await Tibia.fetchAccount(userId);
		if (!account) return this.respondAccountSignup(id, token);

		const coinsOption = options.find(option => option.name === "coins");
		if (!coinsOption || typeof coinsOption.value !== "number" || coinsOption.value <= 0)
		{
			return this.respondEphemeral(id, token, { content: "You need to gamble at least 1 coin." });
		}

		let coins = coinsOption.value;

		// Win -> double your stake, lose -> lose your stake
		const multiplier = Math.random() < 0.05 ** 3 ? 1 : -1;
		coins *= multiplier;
		await Tibia.grantCoins(userId, coins);

		if (multiplier < 0)
		{
			return this.respondNormal(id, token, { content: `<@${userId}>, you lost your stake.` });
		}
		else
		{
			return this.respondNormal(id, token, { content: `<@${userId}, you won and got double the coins back.` });
		}
	}

	private respondAccountSignup(id: Snowflake, token: string)
	{
		return this.respondEphemeral(id, token, {
			content: [
				"There is no Tibia account linked to your Discord account.",
				"Don't have a Tibia account yet?",
				"Signup here: <https://tibia.hydractify.org/account/create>",
				"",
				"Already got a Tibia account?",
				"Link your Discord account here: <https://tibia.hydractify.org/account/manage>",
			].join("\n"),
		});
	}

	private respondNormal(id: Snowflake, token: string, data: APIInteractionApplicationCommandCallbackData)
	{
		return this._respond(id, token, {
			type: APIInteractionResponseType.ChannelMessageWithSource,
			data,
		});

	}

	private respondEphemeral(id: Snowflake, token: string, data: APIInteractionApplicationCommandCallbackData)
	{
		return this._respond(id, token, {
			type: APIInteractionResponseType.ChannelMessage,
			data: {
				...data,
				flags: MessageFlags.EPHEMERAL,
			},
		});

	}
	private _respond(id: Snowflake, token: string, data: RESTPostAPIInteractionCallbackJSONBody): Promise<unknown>
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (this.client["api"] as any).interactions(id, token).callback.post({ data });
	}
}
