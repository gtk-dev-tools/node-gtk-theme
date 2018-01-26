# gtk-theme

Get the current GTK theme at the time of calling the function.

## Usage

The `theme` object returned from this package will have the following;
* theme_name
    * The theme's name 
* gtk_decoration_layout
    * GTK Decoration Layout (Unmodified)
* button_layout
    * Button layout
        * String: Right; The default layout, all min/max/close buttons are rendered on right side
        * String: Left; All min/max/close buttons are rendered on left side
* supported_buttons
    * Array of supported buttons (close,min,max)
* root
    * The folder containing all GTK(2/3) folders etc
* gtk_folder
    * The GTK3 folder that contains all assets, gtk.css file etc.
* css
    * Stringified CSS of the current GTK Theme.

Example usage w/ React (pseudo code)
```js
const { theme } = require('@jakejarrett/gtk-theme');
const NativeStyle = require('native-css');
const converted = nativeCSS.convert(theme.css);
const React = require("react");

class MyComponent extends React.Component {
    render () {
        return (
            <ActionBar>
                <CloseButton style={converted.close} />
            </ActionBar>
        )
    }
}
```

## Requirements
* GTK3
* gsettings

## Performance

Performance will vary depending on if you have a Harddrive or SSD, but was `~0.055s` on an SSD.