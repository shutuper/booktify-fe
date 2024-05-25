import { ApiRequestService } from "../services/api-requests.js";

export default class AppointmentApi {
  static async bookAppointmentByMaster(appointmentDto) {
    return ApiRequestService.post(
      `/private/masters/appointments`,
      appointmentDto,
    );
  }
  static async bookAppointment(appointmentDto) {
    return ApiRequestService.post(`/private/appointments`, appointmentDto);
  }
  static async getAppointments(pageable) {
    return ApiRequestService.get(`/private/appointments`, {
      params: { ...pageable },
    });
  }

  static async cancelAppointment({ appointmentId, cancelReason }) {
    return ApiRequestService.put(`/private/appointments/${appointmentId}`, {
      cancelReason,
    });
  }
}
