package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
