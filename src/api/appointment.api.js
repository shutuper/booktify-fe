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

  static async getAppointments(showCanceled, pageable) {
    return ApiRequestService.get(`/private/appointments`, {
      params: { ...pageable, showCanceled },
    });
  }

  static async cancelAppointment({ appointmentId, cancelReason }) {
    return ApiRequestService.put(`/private/appointments/${appointmentId}`, {
      cancelReason,
    });
  }

  static async remindAppointment({ appointmentId, nHoursBefore }) {
    return ApiRequestService.put(
      `/private/appointments/${appointmentId}/reminders`,
      { hoursBefore: +nHoursBefore },
    );
  }
}
