package com.hospital.hospitalmis.dto.master;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TariffDto {

    private Long id;
    private String payerType;
    private BigDecimal price;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPayerType() { return payerType; }
    public void setPayerType(String payerType) { this.payerType = payerType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public LocalDate getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo; }
}
