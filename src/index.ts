import { gtk_theme } from './get_theme_name';
import { gtk_decoration_layout } from './get_button_layout';
import { try_folder } from './try_folder';
import fs from 'fs';
import path from 'path';
import { homedir } from 'os';

interface GtkData {
    name: string;
    layout: {
        buttons: "left" | "right";
        decoration: string;
    };
    supported: {
        buttons: string[];
        // This is a feature to be detected by version currently.
        // A proposal was written to address this here; https://github.com/jakejarrett/desktop-hinting
        csd: boolean;
    }
    gtk: {
        root: string;
        folder: string;
        css: string;
    }
}

interface IGtkThemeEventList {
    themeChange?: (data: any) => void;
    layoutChange?: () => void;
}

export class GtkTheme {

    private themeName: string;
    private direction: string;

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

                if (this.)
            }
        });
    }

    public getTheme (): GtkData {
        const correctedThemeName = gtk_theme().split(`'`).join('').replace(/\n$/, '');
        const correctedLayout = gtk_decoration_layout().split(`'`).join('').replace(/\n$/, '');
        const arrayOfButtons = correctedLayout.split(":");
        const supportedButtons = arrayOfButtons.filter((button: string) => button !== 'appmenu')[0].split(',');
        const themes = {
            global: try_folder(`/usr/share/themes/${correctedThemeName}`);
            user: try_folder(`${homedir()}/.themes/${correctedThemeName}`);
            snap: try_folder(`/snap/${correctedThemeName.toLocaleLowerCase()}/current/share/themes/${correctedThemeName}`);
        };

        let theme = null;
        let css = null;
        let buttonLayout: 'left' | 'right' = 'right';

        if (false !== themes.user) {
            theme = themes.user;
        }

        if (false !== themes.global) {
            theme = themes.global;
        }

        if (false !== themes.snap) {
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