const fs = require('fs');

exports.try_folder = folder => {
    try {
        fs.statSync(folder);
        return folder;
    } catch (error) {
        console.error(error);
        return false;
    }
}