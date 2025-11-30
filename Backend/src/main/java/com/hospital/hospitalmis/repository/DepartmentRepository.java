package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Department;
import com.hospital.hospitalmis.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByCode(String code);
    List<Department> findByIsDeletedFalse();

    // Tìm theo ID và chưa xóa
    Optional<Department> findByIdAndIsDeletedFalse(Long id);
    boolean existsByCode(String code);
}
