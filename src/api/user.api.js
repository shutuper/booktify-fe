import { ApiRequestService } from "../services/api-requests.js";

export default class UserApi {
  static async updateAvatar(dto) {
    return ApiRequestService.patch("/private/users/avatar", dto);
  }
}
