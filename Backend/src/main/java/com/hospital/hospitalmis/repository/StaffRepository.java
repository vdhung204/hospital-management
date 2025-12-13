package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<Staff> findByIsDeletedFalse();

    // Tìm theo ID và chưa xóa
    Optional<Staff> findByIdAndIsDeletedFalse(Long id);
    @Query("SELECT s FROM Staff s WHERE " +
            "s.staffType = 'DOCTOR' " +
            "AND (:deptId IS NULL OR s.department.id = :deptId) " +
            "AND s.isDeleted = false") // Nhớ check isDeleted nếu đã thêm cột này
    List<Staff> findDoctorsByDepartment(@Param("deptId") Long deptId);
    Optional<Staff> findByUser_Id(Long userId);
    @Query("select coalesce(max(s.id), 0) from Staff s")
    Long findMaxId();
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByIdNumber(String idNumber);
}
