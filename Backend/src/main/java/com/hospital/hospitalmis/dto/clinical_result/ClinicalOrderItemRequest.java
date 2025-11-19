package com.hospital.hospitalmis.dto.clinical_result;

public class ClinicalOrderItemRequest {

    private String itemType;       // LAB_TEST hoặc IMG_PROC
    private Long serviceItemId;    // bắt buộc
    private Long labTestId;        // nếu LAB_TEST
    private Long imagingProcedureId; // nếu IMG_PROC

    // getters/setters

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public Long getServiceItemId() {
        return serviceItemId;
    }

    public void setServiceItemId(Long serviceItemId) {
        this.serviceItemId = serviceItemId;
    }

    public Long getLabTestId() {
        return labTestId;
    }

    public void setLabTestId(Long labTestId) {
        this.labTestId = labTestId;
    }

    public Long getImagingProcedureId() {
        return imagingProcedureId;
    }

    public void setImagingProcedureId(Long imagingProcedureId) {
        this.imagingProcedureId = imagingProcedureId;
    }
}
