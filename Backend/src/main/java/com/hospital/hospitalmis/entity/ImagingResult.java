package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "imaging_result")
public class ImagingResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinical_order_item_id", nullable = false)
    private ClinicalOrderItem clinicalOrderItem;

    @Column(name = "report_text")
    private String reportText;

    @Column(name = "impression", length = 500)
    private String impression;

    @Column(name = "radiologist_id")
    private Long radiologistId;

    @Column(name = "pacs_study_uid", length = 255)
    private String pacsStudyUid;

    @Column(name = "viewer_url", length = 500)
    private String viewerUrl;

    // getters/setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ClinicalOrderItem getClinicalOrderItem() {
        return clinicalOrderItem;
    }

    public void setClinicalOrderItem(ClinicalOrderItem clinicalOrderItem) {
        this.clinicalOrderItem = clinicalOrderItem;
    }

    public String getReportText() {
        return reportText;
    }

    public void setReportText(String reportText) {
        this.reportText = reportText;
    }

    public String getImpression() {
        return impression;
    }

    public void setImpression(String impression) {
        this.impression = impression;
    }

    public Long getRadiologistId() {
        return radiologistId;
    }

    public void setRadiologistId(Long radiologistId) {
        this.radiologistId = radiologistId;
    }

    public String getPacsStudyUid() {
        return pacsStudyUid;
    }

    public void setPacsStudyUid(String pacsStudyUid) {
        this.pacsStudyUid = pacsStudyUid;
    }

    public String getViewerUrl() {
        return viewerUrl;
    }

    public void setViewerUrl(String viewerUrl) {
        this.viewerUrl = viewerUrl;
    }
}
