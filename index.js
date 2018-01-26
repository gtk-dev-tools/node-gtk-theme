const fs = require('fs');
const { gtk_theme } = require('./get_theme_name');
const { gtk_decoration_layout } = require('./get_button_layout');
const { try_folder } = require('./try_folder');
const home_dir = require('os').homedir();

const corrected_theme = gtk_theme.split(`'`).join('').replace(/\n$/, '');
const corrected_layout = gtk_decoration_layout.split(`'`).join('').replace(/\n$/, '');;
const array_of_buttons = corrected_layout.split(":");
const supported_buttons = array_of_buttons.filter(button => button !== 'appmenu');

const global_theme = try_folder(`/usr/share/themes/${corrected_theme}`);
const user_theme = try_folder(`${home_dir}/.themes/${corrected_theme}`);
let theme = null;
let css = null;
let button_layout = 'right';

if (false !== user_theme) {
    theme = user_theme;
}

if (false !== global_theme) {
    theme = global_theme;
}

try {
    css = fs.readFileSync(`${theme}/gtk-3.0/gtk.css`, { encoding: 'utf8' })
} catch (error) {
    console.error('Reading file caused this error:', error);
    css = '';
}

if (corrected_layout.indexOf('menu') !== -1 && array_of_buttons[array_of_buttons.length - 1] === 'appmenu') {
    button_layout = 'left';
}

exports.theme = {
    theme_name: corrected_theme,
    gtk_decoration_layout: corrected_layout,
    button_layout: button_layout,
    supported_buttons: supported_buttons,
    root: theme || {},
    gtk_folder: `${theme}/gtk-3.0/`,
    css: css
};