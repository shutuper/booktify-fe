import { ApiRequestService } from "../services/api-requests.js";

export default class FileApi {
  static async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return ApiRequestService.post("/private/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async downloadFile(fileId) {
    const { data } = await ApiRequestService.get(`/public/files/${fileId}`, {
      params: {
        silent: true,
      },
      responseType: "blob",
    });

    return URL.createObjectURL(data);
  }
}
