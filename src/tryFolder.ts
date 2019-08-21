import { statSync } from "fs";

export const tryFolder = (folder: string) => {
  try {
    statSync(folder);
    return folder;
  } catch (error) {
    if (process.env.G_MESSAGES_DEBUG === "all") {
      console.error(error);
    }
    return "";
  }
};
