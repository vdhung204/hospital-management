package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Chỉ lấy bệnh nhân chưa xóa
    List<Patient> findByIsDeletedFalse();
    // Tìm theo ID và chưa xóa
    Optional<Patient> findByIdAndIsDeletedFalse(Long id);
    Optional<Patient> findByPatientCode(String patientCode);
    @Query("select coalesce(max(p.id), 0) from Patient p")
    Long findMaxId();
    boolean existsByPhone(String phone);
    boolean existsByIdNumber(String idNumber);
}
