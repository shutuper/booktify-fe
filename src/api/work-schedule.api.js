import { ApiRequestService } from "../services/api-requests.js";

export default class WorkScheduleApi {
  static async updateWorkSchedule(dto) {
    return ApiRequestService.put("/private/masters/work-schedule", dto);
  }

  static async getWorkSchedules() {
    return ApiRequestService.get("/private/masters/work-schedule");
  }
}
