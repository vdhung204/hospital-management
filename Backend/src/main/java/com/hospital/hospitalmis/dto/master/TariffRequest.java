package com.hospital.hospitalmis.dto.master;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TariffRequest {

    private String payerType;     // CASH, INSURANCE...
    private BigDecimal price;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo; // có thể null

    // getters/setters
    public String getPayerType() { return payerType; }
    public void setPayerType(String payerType) { this.payerType = payerType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public LocalDate getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo; }
}
