package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Thay thế hàm search cũ bằng @Query này:
    @Query("SELECT a FROM Appointment a WHERE " +
            "(:patientId IS NULL OR a.patient.id = :patientId) AND " +
            "(:doctorId IS NULL OR a.doctor.id = :doctorId) AND " +
            "(:fromDate IS NULL OR a.scheduledAt >= :fromDate) AND " +
            "(:status IS NULL OR a.status = :status)")
    List<Appointment> searchAppointments(@Param("patientId") Long patientId,
                                         @Param("doctorId") Long doctorId,
                                         @Param("fromDate") LocalDateTime fromDate,
                                         @Param("status") String status);
    List<Appointment> findByPatient_Id(Long patientId);

    List<Appointment> findByDepartment_Id(Long departmentId);

    List<Appointment> findByDoctor_Id(Long doctorId);

    List<Appointment> findByScheduledAtBetween(LocalDateTime from, LocalDateTime to);
    List<Appointment> findByPatientIdAndScheduledAtAfterOrderByScheduledAtAsc(Long patientId, LocalDateTime now);
}
