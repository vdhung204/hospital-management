package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.DispenseItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DispenseItemRepository extends JpaRepository<DispenseItem, Long> {
}
