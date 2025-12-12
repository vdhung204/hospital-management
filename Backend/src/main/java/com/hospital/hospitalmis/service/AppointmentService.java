package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.appointment.AppointmentDetailDto;
import com.hospital.hospitalmis.dto.appointment.AppointmentListItem;
import com.hospital.hospitalmis.dto.appointment.AppointmentRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {

    AppointmentDetailDto create(AppointmentRequest request);

    AppointmentDetailDto getById(Long id);

    List<AppointmentListItem> search(
            Long patientId,
            Long departmentId,
            Long doctorId,
            LocalDate fromDate,
            LocalDate toDate,
            String status
    );
    List<AppointmentDetailDto> getUpcomingByPatient(Long patientId);
    AppointmentDetailDto cancel(Long id);

    AppointmentDetailDto markDone(Long id);  // DONE theo status trong DB
    AppointmentDetailDto createForPatientByDoctor(Long patientId, Long doctorId, LocalDateTime scheduledAt);

    Long checkIn(Long id);

    List<String> getDoctorAvailableSlots(Long doctorId, LocalDate date);
    List<AppointmentDetailDto> getAllByPatient(Long patientId);
}
