package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByServiceType(String serviceType); // CONSULT / LAB / IMG / DRUG
    Optional<ServiceItem> findByCode(String code);
    boolean existsByCode(String code);
}
