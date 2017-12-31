# gtk-theme

Get the current GTK theme at the time of calling the function.

## Usage

The `theme` object returned from this package will have the following;
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