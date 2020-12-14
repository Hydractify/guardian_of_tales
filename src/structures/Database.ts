import { join } from "path";
import { Connection, createConnection } from "typeorm";

export const connect = (): Promise<Connection> => createConnection({
	type: "mariadb",
	timezone: "Z",

	supportBigNumbers: true,
	bigNumberStrings: true,

	url: process.env.DATABASE_URL,

	logging: "all",
	entities: [
		`${join(__dirname, "..", "entities")}/**/*.js`,
	],
});
