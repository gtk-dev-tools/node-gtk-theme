import { execSync } from "child_process";

// Return a function to get the current theme.
export const themeName = () =>
	execSync("gsettings get org.gnome.desktop.interface gtk-theme", {
		encoding: "utf8"
	});
