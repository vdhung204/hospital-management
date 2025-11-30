package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<Staff> findByIsDeletedFalse();

    // Tìm theo ID và chưa xóa
    Optional<Staff> findByIdAndIsDeletedFalse(Long id);
    Optional<Staff> findByUser_Id(Long userId);
    @Query("select coalesce(max(s.id), 0) from Staff s")
    Long findMaxId();
}
