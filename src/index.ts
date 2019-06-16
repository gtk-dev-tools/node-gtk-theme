import { themeName } from './themeName';
import { decorationLayout } from './decorationLayout';
import fs from 'fs';
import path from 'path';
import { homedir } from 'os';
import {
	IGtkTheme,
	GtkData,
	IGtkThemeEventList,
	prefetch,
	GTKThemeHooks,
	GTKThemeOptions,
} from './interfaces';
import { themeFolders } from './themeFolders';


class GtkTheme implements IGtkTheme {
	private themeName: string;
	private buttonLayout: "right" | "left";

	on: IGtkThemeEventList = {};

	private hooks: GTKThemeHooks = { prefetch: [] };

	private themeChanged = (event: string) => {
		if (event === 'change') {
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

	constructor (options: GTKThemeOptions) {
		const { hooks, events } = options;

		if (hooks != null) {
			const prefetch = hooks.prefetch;

			if (prefetch && Array.isArray(prefetch) && prefetch.length > 0) {
				this.hooks.prefetch = prefetch;
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

		fs.watch(path.resolve(`${homedir()}/.config/dconf`), { encoding: 'utf8' }, this.themeChanged);
	}

	public getTheme (): GtkData {
		// Hook into a pre fetch of the theme.
		// Synchronous
		if (this.hooks.prefetch.length > 0) {
			for (const hook of this.hooks.prefetch) {
				hook(this);
			}
		}

		const correctedThemeName = themeName().split(`'`).join('').replace(/\n$/, '');
		const correctedLayout = decorationLayout().split(`'`).join('').replace(/\n$/, '');
		const arrayOfButtons = correctedLayout.split(":");
		const supportedButtons = arrayOfButtons.filter((button: string) => button !== 'appmenu')[0].split(',');
		const themes = themeFolders(correctedThemeName);

		let theme = '';
		let css = null;
		let buttonLayout: 'left' | 'right' = 'right';

		if ('' !== themes.snap) {
			theme = themes.snap;
		}

		if ('' !== themes.user) {
			theme = themes.user;
		}

		if ('' !== themes.global || '' === theme) {
			theme = themes.global;
		}

		try {
			css = fs.readFileSync(`${theme}/gtk-3.0/gtk.css`, { encoding: 'utf8' })
		} catch (error) {
			if (process.env.G_MESSAGES_DEBUG === 'all') {
				console.error('Reading file caused this error:', error);
			}
			css = '';
		}

		if (correctedLayout.indexOf(':') === correctedLayout.length - 1) {
			buttonLayout = 'left';
		}

		return {
			name: correctedThemeName,
			gtk: {
				css,
				folder: `${theme}/gtk-3.0/`,
				root: theme || '',
			},
			supported: {
				buttons: supportedButtons,
				// TODO: Make this check for version of GTK.
				csd: true,
			},
			layout: {
				buttons: buttonLayout,
				decoration: correctedLayout
			}
		};
	}
}

export {
	GtkTheme,
	IGtkTheme,
	GtkData,
	IGtkThemeEventList,
	prefetch,
	GTKThemeHooks,
	GTKThemeOptions,
};