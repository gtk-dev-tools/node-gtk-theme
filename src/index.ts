import { themeName } from './theme_name';
import { decorationLayout } from './button_layout';
import { tryFolder } from './try_folder';
import fs from 'fs';
import path from 'path';
import { homedir } from 'os';

export interface GtkData {
    name: string;
    layout: {
        buttons: "left" | "right";
        decoration: string;
    };
    supported: {
        buttons: string[];
        // Currently defaults to true always. Need to figure out detection (checking versions of specific DE's is not maintainable..)
        // A proposal was written to address this here; https://github.com/jakejarrett/desktop-hinting
        csd: boolean;
    }
    gtk: {
        root: string;
        folder: string;
        css: string;
    }
}

export interface IGtkThemeEventList {
    themeChange?: (data: GtkData) => void;
    layoutChange?: (data: GtkData) => void;
}

export class GtkTheme {

    private themeName: string;
    private buttonLayout: "right" | "left";

    on: IGtkThemeEventList = {};

    constructor () {
        fs.watch(path.resolve(`${homedir()}/.config/dconf`), { encoding: 'utf8' }, event => {
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
        });
    }

    public getTheme (): GtkData {
        const correctedThemeName = themeName().split(`'`).join('').replace(/\n$/, '');
        const correctedLayout = decorationLayout().split(`'`).join('').replace(/\n$/, '');
        const arrayOfButtons = correctedLayout.split(":");
        const supportedButtons = arrayOfButtons.filter((button: string) => button !== 'appmenu')[0].split(',');
        const themes = {
            global: tryFolder(`/usr/share/themes/${correctedThemeName}`),
            user: tryFolder(`${homedir()}/.themes/${correctedThemeName}`),
            snap: tryFolder(`/snap/${correctedThemeName.toLocaleLowerCase()}/current/share/themes/${correctedThemeName}`),
        };

        let theme = '';
        let css = null;
        let buttonLayout: 'left' | 'right' = 'right';

        if ('' !== themes.user) {
            theme = themes.user;
        }

        if ('' !== themes.global) {
            theme = themes.global;
        }

        if ('' !== themes.snap) {
            theme = themes.snap;
        }

        try {
            css = fs.readFileSync(`${theme}/gtk-3.0/gtk.css`, { encoding: 'utf8' })
        } catch (error) {
            console.error('Reading file caused this error:', error);
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
                csd: true,
            },
            layout: {
                buttons: buttonLayout,
                decoration: correctedLayout
            }
        };
    }

}