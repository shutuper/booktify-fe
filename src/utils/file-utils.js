import { ENV } from "../config/env.js";

export function getFileUrlByFileId(fileId) {
  if (!fileId) {
    return null;
  }

  return ENV.VITE_API_BASE_URL + "/public/files/" + fileId;
}
