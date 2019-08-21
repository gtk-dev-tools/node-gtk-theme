import { homedir } from "os";
import { execSync } from "child_process";
import { writeFileSync } from "fs";

// Converts given gresource file if it has a css file.
export const convertGResource = (gresource: string) => {
	const stdout = execSync(`gresource list ${gresource}`);
	const output = stdout.toString();
	const candidates = output
		.split("\n")
		.filter(e => e.includes("gtk.css")) || [""];
	const assetName = candidates[0];

	if (output.includes("gtk.css")) {
		const data = execSync(`gresource extract ${gresource} ${assetName}`);
		return data.toString();
	}
};
