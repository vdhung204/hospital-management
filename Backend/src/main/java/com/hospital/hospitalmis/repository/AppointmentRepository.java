package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatient_Id(Long patientId);

    List<Appointment> findByDepartment_Id(Long departmentId);

    List<Appointment> findByDoctor_Id(Long doctorId);

    List<Appointment> findByScheduledAtBetween(LocalDateTime from, LocalDateTime to);
}
