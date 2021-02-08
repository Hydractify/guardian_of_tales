/* eslint-disable @typescript-eslint/no-explicit-any */

import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { RESTGetAPIApplicationGuildCommandsResult } from "discord-api-types/v8";

import { commands } from "../structures/slashCommands";

export default class SlashCommandsCommand extends Command
{
	public constructor()
	{
		super("slashcommands", {
			aliases: ["slashcommands"],
			description: "Manage slash commands for this guild.",
			channel: "guild",
			ownerOnly: true,
			args: [{
				id: "action",
				type: ["install", "uninstall"],
			}],
		});
	}
	public async exec(message: Message, { action }: { action: "install" | "uninstall"; }): Promise<Message>
	{
		if (action === "install")
		{
			for (const command of commands)
			{
				await (this.client["api"] as any).applications(this.client.user!.id).guilds(message.guild!.id).commands.post({ data: command });
			}

			return message.reply("added all slash commands to this guild!");
		}
		else if (action === "uninstall")
		{
			const commands: RESTGetAPIApplicationGuildCommandsResult =
				await (this.client["api"] as any).applications(this.client.user!.id).guilds(message.guild!.id).commands.get();

			for (const command of commands)
			{
				await (this.client["api"] as any).applications(this.client.user!.id).guilds(message.guild!.id).commands(command.id).delete();
			}

			return message.reply("removed all slash commands from this guild!");
		}

		throw new Error(`Unknown action ${action}`);
	}
}
