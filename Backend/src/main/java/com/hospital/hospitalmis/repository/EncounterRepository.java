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
}
