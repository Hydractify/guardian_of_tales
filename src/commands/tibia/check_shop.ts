import { ArgumentOptions, Flag, Command } from "discord-akairo";
import { Message } from "discord.js";

import { Item, Tibia } from "../../structures/Tibia";

export default class CheckShopCommand extends Command
{
	public constructor()
	{
		super("tibia:check_shop", {
			category: "tibia",
			aliases: ["check-shop", "check_shop", "checkshop", "shop"],
			description: "Check what the shop has to offer.",
		});
	}

	public * args(): IterableIterator<ArgumentOptions | Flag>
	{
		const itemNames = Tibia.SHOP_ITEMS.map(item => item.name);
		const joinedItemNames = itemNames.join("\n");

		const itemName = yield {
			type: itemNames,
			prompt: {
				start: "What item would you like to see details of?" + joinedItemNames,
				retry: "That does not look right, try one of the following:" + joinedItemNames,
				optional: true,
			},
			default: null,
		};

		let item: Item | null = null;

		if (itemName)
		{
			item = Tibia.SHOP_ITEMS.find(item => item.name === itemName)!;
		}


		return { item, joinedItemNames };

	}

	public async exec(message: Message, { item, joinedItemNames }: { item: Item | null; joinedItemNames: string; }): Promise<Message>
	{
		if (item)
		{
			const embed = this.client.util.embed()
				.setAuthor(item.name, undefined, item.wiki)
				.setThumbnail(item.wiki)
				.setDescription(`Price: ${item.price} tokens\n\n${item.description}`);

			return message.reply(embed);
		}

		return message.reply(`Available items are:\n${joinedItemNames}`);
	}
}
