export interface IGtkTheme {
	on: IGtkThemeEventList;
	getTheme (): GtkData;
}

export interface NGtkLayoutData {
	buttons: "left" | "right";
	decoration: string;
}

export interface NGtkSupportedData {
	buttons: string[];
	// Currently defaults to true always. Need to figure out detection (checking versions of specific DE's is not maintainable..)
	// A proposal was written to address this here; https://github.com/jakejarrett/desktop-hinting
	csd: boolean;
}

export interface NGtkCSSData {
	root: string;
	folder: string;
	css: string;
}

export interface GtkData {
	name: string;
	layout: NGtkLayoutData;
	supported: NGtkSupportedData;
	gtk: NGtkCSSData;
}

export interface IGtkThemeEventList {
	themeChange?: (data: GtkData) => void;
	layoutChange?: (data: GtkData) => void;
}

export type prefetch = (context: IGtkTheme) => void;
export type postfetch = (theme: GtkData) => GtkData;

export interface GTKThemeHooks {
	prefetch?: prefetch[];
	postfetch?: postfetch[];
}

export interface GTKThemeOptions {
	hooks?: GTKThemeHooks;
	events: IGtkThemeEventList;
}