import { Structures } from "discord.js";

export default Structures.extend("User", DJS_User =>
	class User extends DJS_User
	{
		public lastCreditedMessageTimestamp: number = 0;
	});

declare module "discord.js"
{
	interface User
	{
		lastCreditedMessageTimestamp: number;
	}
}
