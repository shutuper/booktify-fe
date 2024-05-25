import { ApiRequestService } from "../services/api-requests.js";

export default class SalonApi {
  static async getSalon(masterId, ignoreErrorMessages = false) {
    return ApiRequestService.get(`/private/masters/${masterId}/salons`, {
      ignoreErrorMessages,
    });
  }

  static async getSalonByLinkName({ salonLinkName }) {
    return ApiRequestService.get(`/public/salons/${salonLinkName}`);
  }

  static async getSalonFromInviteToken({ inviteToken }) {
    return ApiRequestService.get(`/public/salons/masters/invites`, {
      params: {
        inviteToken,
      },
    });
  }

  static async createSalon(salonDto) {
    return ApiRequestService.post("/private/salons", salonDto);
  }

  static async updateSalon(salonId, salonDto) {
    return ApiRequestService.put(`/private/salons/${salonId}`, salonDto);
  }

  static async inviteMaster(masterInviteDto) {
    return ApiRequestService.post(
      `/private/salons/masters/invites`,
      masterInviteDto,
    );
  }
}
