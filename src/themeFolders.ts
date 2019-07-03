import { tryFolder } from "./tryFolder";
import { homedir } from "os";

export const themeFolders = (theme: string) => ({
    global: tryFolder(`/usr/share/themes/${theme}`),
    user: tryFolder(`${homedir()}/.themes/${theme}`),
    snap: tryFolder(`/snap/${theme.toLocaleLowerCase()}/current/share/themes/${theme}`),
})