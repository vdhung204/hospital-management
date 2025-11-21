package com.hospital.hospitalmis.repository;

import com.hospital.hospitalmis.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
}
