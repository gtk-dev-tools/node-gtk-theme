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

	/**
	 * Get the supported buttons & whether CSD is supported.
	 */
	private getSupported (decoration: string = '') {
		return {
			buttons: decoration.split(":").filter((button: string) => button !== 'appmenu')[0].split(','),
			// TODO: Make this check for version of GTK.
			csd: true,
		};
	}

	/**
	 * Gets the relevant information for the GTK css.
	 */
	private getGtkObj () {
		const themes = themeFolders(name);
		let theme = '';
		let css = null;

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

		return {
			css,
			folder: `${theme}/gtk-3.0/`,
			root: theme || '',
		};
	}

	public getTheme (): GtkData {
		// Hook into a pre fetch of the theme.
		// Synchronous
		if (this.hooks.prefetch.length > 0) {
			for (const hook of this.hooks.prefetch) {
				hook(this);
			}
		}

		const name = themeName().split(`'`).join('').replace(/\n$/, '');
		const decoration = decorationLayout().split(`'`).join('').replace(/\n$/, '');
		let buttons: 'left' | 'right' = 'right';

		if (decoration.indexOf(':') === decoration.length - 1) {
			buttons = 'left';
		}

		return {
			name,
			gtk: this.getGtkObj(),
			supported: this.getSupported(decoration),
			layout: {
				buttons,
				decoration
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