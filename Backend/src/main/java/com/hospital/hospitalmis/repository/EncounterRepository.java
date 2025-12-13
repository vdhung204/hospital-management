package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Encounter;
import com.hospital.hospitalmis.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EncounterRepository extends JpaRepository<Encounter, Long> {
    // 1. Hàm tìm số thứ tự lớn nhất trong ngày của khoa để +1
    @Query("SELECT MAX(e.queueNumber) FROM Encounter e " +
            "WHERE e.department.id = :deptId " +
            "AND e.visitDate BETWEEN :startOfDay AND :endOfDay")
    Integer findMaxQueueNumber(@Param("deptId") Long deptId,
                               @Param("startOfDay") LocalDateTime start,
                               @Param("endOfDay") LocalDateTime end);

    // 2. Hàm lấy danh sách chưa bị xóa
    List<Encounter> findByIsDeletedFalse();
    // Lấy lịch sử khám theo bệnh nhân
    List<Encounter> findByPatient_Id(Long patientId);

    // Đếm số ca khám trong ngày
    @Query("SELECT COUNT(e) FROM Encounter e " +
            "WHERE e.visitDate BETWEEN :start AND :end AND e.isDeleted = false")
    Long countEncounters(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // src/main/java/com/hospital/hospitalmis/repository/EncounterRepository.java

    @Query("SELECT e FROM Encounter e WHERE " +
            "e.doctorId = :doctorId " +
            "AND e.visitDate BETWEEN :start AND :end " +
            "AND e.status IN ('WAITING', 'IN_PROGRESS') " +
            "AND e.isDeleted = false " +
            "ORDER BY e.status DESC, e.queueNumber ASC")
    List<Encounter> findDoctorQueue(@Param("doctorId") Long doctorId,
                                    @Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end);

    long countByVisitDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

    long countByStatus(String inProgress);
    List<Encounter> findByPatientIdOrderByVisitDateDesc(Long patientId);

    @Query("SELECT e FROM Encounter e " +
            "WHERE (:keyword IS NULL OR :keyword = '' OR " +
            "       LOWER(e.patient.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "       LOWER(e.patient.patientCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:departmentId IS NULL OR e.department.id = :departmentId) " +
            "AND (:status IS NULL OR :status = '' OR e.status = :status) " +
            "AND (e.visitDate BETWEEN :fromDate AND :toDate) " +
            "ORDER BY e.visitDate DESC")
    List<Encounter> searchEncounters(
            @Param("keyword") String keyword,
            @Param("departmentId") Long departmentId,
            @Param("status") String status,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate
    );
}
