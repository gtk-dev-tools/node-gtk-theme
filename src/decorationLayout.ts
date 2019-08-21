const { execSync } = require("child_process");

// Return a function to get the current theme.
export const decorationLayout = () =>
	execSync("gsettings get org.gnome.desktop.wm.preferences button-layout", {
		encoding: "utf8"
	});
