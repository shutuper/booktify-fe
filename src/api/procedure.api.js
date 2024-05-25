import { ApiRequestService } from "../services/api-requests.js";

export default class ProcedureApi {
  static async getMasterProceduresPage(masterId, params) {
    return ApiRequestService.get(`/public/masters/${masterId}/procedures`, {
      params,
    });
  }

  static async createProcedure(procedureDto) {
    return ApiRequestService.post("/private/procedures", procedureDto);
  }

  static async patchProcedure({ procedureId, procedureDto }) {
    return ApiRequestService.patch(
      `/private/procedures/${procedureId}`,
      procedureDto,
    );
  }

  static async delete(procedureId) {
    return ApiRequestService.delete(`/private/procedures/${procedureId}`);
  }

  static async getTimeslots(procedureId, month) {
    return ApiRequestService.get(
      `/public/procedures/${procedureId}/available-timeslots`,
      {
        params: {
          startDate: month.startOf("month").toISOString(),
          endDate: month.endOf("month").toISOString(),
        },
      },
    );
  }
}
