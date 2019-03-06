const { execSync } = require('child_process');

// Return a function to get the current theme.
exports.gtk_theme = () => execSync('gsettings get org.gnome.desktop.interface gtk-theme', { encoding: 'utf8' });