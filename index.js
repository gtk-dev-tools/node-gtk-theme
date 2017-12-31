const fs = require('fs');
const { gtk_theme } = require('./get_theme_name');
const home_dir = require('os').homedir();
const corrected_theme = gtk_theme.split(`'`).join('').replace(/\n$/, '')

const try_folder = folder => {
    try {
        fs.statSync(folder);
        return folder;
    } catch (error) {
        return false;
    }
}

const global_theme = try_folder(`/usr/share/themes/${corrected_theme}`);
const user_theme = try_folder(`${home_dir}/.themes/${corrected_theme}`);
let theme = null;

if (false !== user_theme) {
    theme = user_theme;
}

if (false !== global_theme) {
    theme = global_theme;
}

exports.theme = {
    root: theme,
    gtk_folder: `${theme}/gtk-3.0/`,
    css: fs.readFileSync(`${theme}/gtk-3.0/gtk.css`, { encoding: 'utf8' })
};