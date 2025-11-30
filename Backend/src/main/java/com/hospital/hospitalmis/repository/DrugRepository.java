package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Drug;
import com.hospital.hospitalmis.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DrugRepository extends JpaRepository<Drug, Long> {
    boolean existsByCode(String code);
    List<Drug> findByIsDeletedFalse();

    // Tìm theo ID và chưa xóa
    Optional<Drug> findByIdAndIsDeletedFalse(Long id);
}
