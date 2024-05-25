import { ApiRequestService } from "../services/api-requests.js";

export default class AuthApi {
  static async me() {
    return ApiRequestService.get("/private/users/me", {
      ignoreErrorMessages: true,
    });
  }

  static async signUpMaster(dto) {
    return ApiRequestService.post("/public/users/masters/sign-up", dto);
  }
  static async signUpClient(dto) {
    return ApiRequestService.post("/public/users/clients/sign-up", dto);
  }

  static async signInStep1(dto) {
    return ApiRequestService.post("/public/users/sign-in/step-1", dto);
  }

  static async signInStep2(dto) {
    return ApiRequestService.post("/public/users/sign-in/step-2", dto);
  }
}
