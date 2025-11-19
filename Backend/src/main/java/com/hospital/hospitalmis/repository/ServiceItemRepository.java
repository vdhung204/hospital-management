package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByServiceType(String serviceType); // CONSULT / LAB / IMG / DRUG
}
