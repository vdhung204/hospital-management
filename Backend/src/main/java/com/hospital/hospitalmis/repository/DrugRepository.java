package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.Drug;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrugRepository extends JpaRepository<Drug, Long> {
    boolean existsByCode(String code);
}
