package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.ICD10Code;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICD10CodeRepository extends JpaRepository<ICD10Code, String> {
}
