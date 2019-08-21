const { readdirSync } = require("fs");
const { execSync } = require("child_process");
const { knownGResourceAssets } = require("./knownGResourceAssets");

interface Props {
	theme: string;
	folder: string;
}

export const findGResourceAsset = ({ theme, folder }: Props) => {
	const asset = knownGResourceAssets[theme.toLocaleLowerCase()];

	if (asset != null) {
		console.log(asset);
		return asset;
	} else {
		try {
			const files = readdirSync(`${folder}/`);
			console.log(files);
		} catch (err) {
			if (process.env.G_MESSAGES_DEBUG === "all") {
				console.error("Reading file caused this error:", err);
			}
		}
	}
};
