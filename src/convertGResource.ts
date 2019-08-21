import { homedir } from "os";

const { execSync } = require("child_process");

// Converts given gresource file if it has a css file.
export const convertGResource = (theme: string, gresource: string) => {
	execSync(`mkdir -p ${homedir()}/.config/node-gtk-theme/${theme}`, {
		encoding: "utf8"
	});
};
