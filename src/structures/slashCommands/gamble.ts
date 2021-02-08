import { ApplicationCommandOptionType, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v8";

const gamble: RESTPostAPIApplicationCommandsJSONBody = {
	name: "gamble",
	description: "Gamble using your Tibia coins!",
	options: [{
		name: "coins",
		description: "How many coins are you willing to lose?",
		type: ApplicationCommandOptionType.INTEGER,
		required: true,
	}],
};

export { gamble as gamble };
