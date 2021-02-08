import { ApplicationCommandOptionType, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v8";

const checkCoins: RESTPostAPIApplicationCommandsJSONBody = {
	name: "checkCoins",
	description: "Check how many Tibia coins you have!",
	options: [{
		name: "show",
		description: "Do you want to show everyone how rich you are? (Defaults to False)",
		type: ApplicationCommandOptionType.BOOLEAN,
		required: false,
	}],
};

export { checkCoins as checkCoins };
