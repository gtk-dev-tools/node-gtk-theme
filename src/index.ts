import { themeName } from "./themeName";
import { decorationLayout } from "./decorationLayout";
import fs from "fs";
import path from "path";
import { homedir } from "os";
import {
	IGtkTheme,
	GtkData,
	IGtkThemeEventList,
	prefetch,
	GTKThemeHooks,
	GTKThemeOptions,
	NGtkCSSData,
	NGtkSupportedData
} from "./interfaces";
import { themeFolders } from "./themeFolders";
import { findGResourceAsset } from "./findGResourceAsset";

class GtkTheme implements IGtkTheme {
	private themeName: string;
	private buttonLayout: "right" | "left";

	on: IGtkThemeEventList = {};

	private hooks: GTKThemeHooks = { prefetch: [], postfetch: [] };

	private themeChanged = (event: string) => {
		if (event === "change") {
			const data = this.getTheme();

			if (this.themeName !== data.name) {
				this.themeName = data.name;
				if (this.on.themeChange) {
					this.on.themeChange(data);
				}
			}

			if (this.buttonLayout !== data.layout.buttons) {
				this.buttonLayout = data.layout.buttons;

				if (this.on.layoutChange) {
					this.on.layoutChange(data);
				}
			}
		}
	};

	constructor(options: GTKThemeOptions) {
		const { hooks, events } = options;

		if (hooks != null) {
			const prefetch = hooks.prefetch;
			const postfetch = hooks.postfetch;

			if (prefetch && Array.isArray(prefetch) && prefetch.length > 0) {
				this.hooks.prefetch = prefetch;
			}

			if (postfetch && Array.isArray(postfetch) && postfetch.length > 0) {
				this.hooks.postfetch = postfetch;
			}
		}

		if (events != null) {
			if (events.layoutChange) {
				this.on.layoutChange = events.layoutChange;
			}

			if (events.themeChange) {
				this.on.themeChange = events.themeChange;
			}
		}

		fs.watch(
			path.resolve(`${homedir()}/.config/dconf`),
			{ encoding: "utf8" },
			this.themeChanged
		);
	}

	/**
	 * Get the supported buttons & whether CSD is supported.
	 */
	private getSupported(decoration: string = ""): NGtkSupportedData {
		return {
			buttons: decoration
				.split(":")
				.filter((button: string) => button !== "appmenu")[0]
				.split(","),
			// TODO: Make this check for version of GTK.
			csd: true
		};
	}

	/**
	 * Gets the relevant information for the GTK css.
	 */
	private getGtkObj(name: string): NGtkCSSData {
		const themes = themeFolders(name);
		let theme: string = "";
		let css: string;

		if ("" !== themes.snap) {
			theme = themes.snap;
		}

		if ("" !== themes.user) {
			theme = themes.user;
		}

		if ("" !== themes.global || "" === theme) {
			theme = themes.global;
		}

		try {
			css = fs.readFileSync(`${theme}/gtk-3.0/gtk.css`, {
				encoding: "utf8"
			});
		} catch (error) {
			if (process.env.G_MESSAGES_DEBUG === "all") {
				console.error("Reading file caused this error:", error);
			}
			css = "";
		}

		if (css === "" || css == null) {
			try {
				console.log();
			} catch (err) {
				console.error(err);
			}
		}

		return {
			css,
			folder: `${theme}/gtk-3.0/`,
			root: theme || ""
		};
	}

	private clone(obj: any) {
		return JSON.parse(JSON.stringify(obj));
	}

	public getTheme(): GtkData {
		// Hook into a pre fetch of the theme.
		// Synchronous
		if (this.hooks.prefetch.length > 0) {
			for (const hook of this.hooks.prefetch) {
				hook(this);
			}
		}

		const name: string = themeName()
			.split(`'`)
			.join("")
			.replace(/\n$/, "");
		const decoration: string = decorationLayout()
			.split(`'`)
			.join("")
			.replace(/\n$/, "");
		const gtk: NGtkCSSData = this.getGtkObj(name);
		const supported: NGtkSupportedData = this.getSupported(decoration);
		const buttons: "left" | "right" =
			decoration.indexOf(":") === decoration.length - 1
				? "left"
				: "right";

		const gresourceFound = findGResourceAsset({
			theme: name,
			folder: gtk.folder
		});

		if (gresourceFound) {
		}

		const theme = {
			name,
			gtk,
			supported,
			layout: {
				buttons,
				decoration
			}
		};

		let postfetchedTheme = this.clone(theme);

		if (this.hooks.postfetch.length > 0) {
			for (const hook of this.hooks.postfetch) {
				const r = this.clone(hook(theme));
				if (!!r) {
					postfetchedTheme = r;
				}
			}
		}

		return postfetchedTheme;
	}
}

export {
	GtkTheme,
	IGtkTheme,
	GtkData,
	IGtkThemeEventList,
	prefetch,
	GTKThemeHooks,
	GTKThemeOptions
};
