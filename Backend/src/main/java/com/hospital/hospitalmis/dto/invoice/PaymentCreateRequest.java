package com.hospital.hospitalmis.dto.invoice;

import java.math.BigDecimal;

public class PaymentCreateRequest {

    private BigDecimal amount;
    private String method;
    private String refNumber;

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getRefNumber() { return refNumber; }
    public void setRefNumber(String refNumber) { this.refNumber = refNumber; }
}
