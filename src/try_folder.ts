import { statSync } from 'fs';

export const tryFolder = (folder: string) => {
    try {
        statSync(folder);
        return folder;
    } catch (error) {
        console.error(error);
        return '';
    }
}