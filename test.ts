import { GtkTheme, GtkData } from './src';

new GtkTheme({
    events: {
        layoutChange: console.log,
        themeChange: (data: GtkData) => {
            console.log('data changed', data.name);
        }
    }
});