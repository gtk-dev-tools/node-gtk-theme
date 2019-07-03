# gtk-theme

Get the current GTK theme at the time of calling the function.

## Usage
### Theme object

The `theme` object returned from this package will have the following;

```
{
    name: String;
    gtk: {
        css: String;
        folder: String;
        root: String;
    };
    supported: {
        buttons: String[];
        csd: Boolean
    },
    layout: {
        buttons: 'right' | 'left';
        decoration: String (EG/ ':minimize,maximize,close')
    }
}

```
* name
    * Theme name
* gtk
    * GTK Theme object
    * css
        * The stringified CSS
    * folder
        * Folder for the CSS (if found)
    * root
        * Root of the gtk theme
* supported
    * Supported elements of gtk (buttons etc)
    * buttons
        * Array of buttons enabled (min, max & close etc)
    * csd
        * Whether CSD is supported on the current gtk version
* layout
    * GTK Layout (whether buttons are right/left aligned etc)
    * buttons
        * Whether they're on left or right of the window
    * decorations
        * Window decorations enabled (minimize, maximize, close etc)

### Events
* layoutChange
    * When the layout has changed (eg/ align decorations to left & then right)
    * Gets the theme objected
* themeChange
    * When the theme has changed
    * Gets the theme object

Example usage. (console logs each theme change)
```ts
import { GtkTheme, GtkData } from '@jakejarrett/gtk-theme';

new GtkTheme({
    events: {
        layoutChange: console.log,
        themeChange: (data: GtkData) => {
            console.log('data changed', data.name);
        }
    }
}); 
```

## Requirements
* GTK3+
* gsettings

## Performance

Performance will vary depending on if you have a Harddrive or SSD, but was `~0.055s` on an SSD.