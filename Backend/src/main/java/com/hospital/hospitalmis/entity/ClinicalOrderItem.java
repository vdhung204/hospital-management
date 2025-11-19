package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clinical_order_item")
public class ClinicalOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK clinical_order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinical_order_id", nullable = false)
    private ClinicalOrder clinicalOrder;

    @Column(name = "item_type", nullable = false, length = 20)
    private String itemType; // LAB_TEST, IMG_PROC

    @Column(name = "service_item_id", nullable = false)
    private Long serviceItemId;

    @Column(name = "lab_test_id")
    private Long labTestId;

    @Column(name = "imaging_procedure_id")
    private Long imagingProcedureId;

    @Column(name = "status", length = 20)
    private String status; // ORDERED, DONE...

    // getters/setters

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getImagingProcedureId() {
        return imagingProcedureId;
    }

    public void setImagingProcedureId(Long imagingProcedureId) {
        this.imagingProcedureId = imagingProcedureId;
    }

    public Long getLabTestId() {
        return labTestId;
    }

    public void setLabTestId(Long labTestId) {
        this.labTestId = labTestId;
    }

    public Long getServiceItemId() {
        return serviceItemId;
    }

    public void setServiceItemId(Long serviceItemId) {
        this.serviceItemId = serviceItemId;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public ClinicalOrder getClinicalOrder() {
        return clinicalOrder;
    }

    public void setClinicalOrder(ClinicalOrder clinicalOrder) {
        this.clinicalOrder = clinicalOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
