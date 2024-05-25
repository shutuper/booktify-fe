import { ApiRequestService } from "../services/api-requests.js";

export default class MasterApi {
  static async getMaster(salonId, masterId) {
    return ApiRequestService.get(
      `/public/salons/${salonId}/masters/${masterId}`,
    );
  }

  static async getMasters(salonId, params) {
    return ApiRequestService.get(`/public/salons/${salonId}/masters`, {
      params,
    });
  }

  static async getMastersPrivate(salonId, params) {
    return ApiRequestService.get(`/private/salons/${salonId}/masters`, {
      params,
    });
  }
}
