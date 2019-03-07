const fs = require('fs');
const path = require('path');
const home_dir = require('os').homedir();

let themeName = '';

const onChange = (done = () => null) => {
    fs.watch(path.resolve(`${home_dir}/.config/dconf`), { encoding: 'utf8' }, event => {
        if (event === 'change') {
            const data = getData();

            if (themeName !== data.theme_name) {
                themeName = data.theme_name;
                done(data);
            }
        }
    })
}

const getData = () => {
    const { gtk_theme } = require('./get_theme_name');
    const { gtk_decoration_layout } = require('./get_button_layout');
    const { try_folder } = require('./try_folder');

    const corrected_theme = gtk_theme().split(`'`).join('').replace(/\n$/, '');
    const corrected_layout = gtk_decoration_layout().split(`'`).join('').replace(/\n$/, '');;
    const array_of_buttons = corrected_layout.split(":");
    const supported_buttons = array_of_buttons.filter(button => button !== 'appmenu')[0].split(',');

    const global_theme = try_folder(`/usr/share/themes/${corrected_theme}`);
    const user_theme = try_folder(`${home_dir}/.themes/${corrected_theme}`);
    const snap_theme = try_folder(`/snap/${corrected_theme.toLocaleLowerCase()}/current/share/themes/${corrected_theme}`);
    let theme = null;
    let css = null;
    let button_layout = 'right';

    if (false !== user_theme) {
        theme = user_theme;
    }

    if (false !== global_theme) {
        theme = global_theme;
    }

    if (false !== snap_theme) {
        theme = snap_theme;
    }

    try {
        css = fs.readFileSync(`${theme}/gtk-3.0/gtk.css`, { encoding: 'utf8' })
    } catch (error) {
        console.error('Reading file caused this error:', error);
        css = '';
    }

    if (corrected_layout.indexOf(':') === corrected_layout.length - 1) {
        button_layout = 'left';
    }

    return {
        theme_name: corrected_theme,
        gtk_decoration_layout: corrected_layout,
        button_layout: button_layout,
        supported_buttons: supported_buttons,
        root: theme || {},
        gtk_folder: `${theme}/gtk-3.0/`,
        css: css,
        onChange
    };
};

const initialData = getData();
themeName = initialData.theme_name;

exports.theme = initialData;

console.log(initialData)

onChange(() => null);