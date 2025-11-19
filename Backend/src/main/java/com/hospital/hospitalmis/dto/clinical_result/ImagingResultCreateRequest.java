package com.hospital.hospitalmis.dto.clinical_result;

public class ImagingResultCreateRequest {

    private String reportText;
    private String impression;
    private Long radiologistId;
    private String pacsStudyUid;
    private String viewerUrl;

    public String getReportText() { return reportText; }
    public void setReportText(String reportText) { this.reportText = reportText; }

    public String getImpression() { return impression; }
    public void setImpression(String impression) { this.impression = impression; }

    public Long getRadiologistId() { return radiologistId; }
    public void setRadiologistId(Long radiologistId) { this.radiologistId = radiologistId; }

    public String getPacsStudyUid() { return pacsStudyUid; }
    public void setPacsStudyUid(String pacsStudyUid) { this.pacsStudyUid = pacsStudyUid; }

    public String getViewerUrl() { return viewerUrl; }
    public void setViewerUrl(String viewerUrl) { this.viewerUrl = viewerUrl; }
}
