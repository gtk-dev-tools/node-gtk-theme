import { readdirSync } from "fs";
import { execSync } from "child_process";
import { knownGResourceAssets } from "./knownGResourceAssets";

interface Props {
	theme: string;
	folder: string;
}

export const findGResourceAsset = ({ theme, folder }: Props) => {
	const asset = knownGResourceAssets[theme.toLocaleLowerCase()];

	if (asset != null) {
		return asset;
	} else {
		try {
			const files = readdirSync(`${folder}/`);

			for (const file of files) {
				if (file.includes(".gresource")) {
					return file;
				}
			}
		} catch (err) {
			if (process.env.G_MESSAGES_DEBUG === "all") {
				console.error("Reading file caused this error:", err);
			}
		}
	}
};
