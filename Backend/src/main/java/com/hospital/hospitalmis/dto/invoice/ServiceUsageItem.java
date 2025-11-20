package com.hospital.hospitalmis.dto.invoice;

public class ServiceUsageItem {

    // Nhóm dịch vụ lớn: CONSULT / LAB / IMG / DRUG
    private String group;

    // Kiểu source dùng trong invoice_line: CONSULT / LAB / IMG / DRUG
    private String sourceType;

    // ID nguồn:
    // - CONSULT: encounter_id
    // - LAB/IMG: clinical_order_item.id
    // - DRUG: prescription_item.id
    private Long sourceId;

    // Thông tin service item (dùng cho billing)
    private Long serviceItemId;
    private String serviceItemCode;
    private String serviceItemName;

    // Mô tả hiển thị cho người dùng (tên dịch vụ / tên thuốc)
    private String description;

    private Integer quantity;

    // Trạng thái billing
    private boolean billed;   // đã đưa vào invoice_line hay chưa
    private Long invoiceId;   // nếu billed = true, thuộc invoice nào (id)

    // --- getters/setters ---

    public String getGroup() { return group; }
    public void setGroup(String group) { this.group = group; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public Long getServiceItemId() { return serviceItemId; }
    public void setServiceItemId(Long serviceItemId) { this.serviceItemId = serviceItemId; }

    public String getServiceItemCode() { return serviceItemCode; }
    public void setServiceItemCode(String serviceItemCode) { this.serviceItemCode = serviceItemCode; }

    public String getServiceItemName() { return serviceItemName; }
    public void setServiceItemName(String serviceItemName) { this.serviceItemName = serviceItemName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public boolean isBilled() { return billed; }
    public void setBilled(boolean billed) { this.billed = billed; }

    public Long getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }
}
