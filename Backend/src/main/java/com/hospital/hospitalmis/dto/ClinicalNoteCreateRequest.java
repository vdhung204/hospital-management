package com.hospital.hospitalmis.dto;

public class ClinicalNoteCreateRequest {

    private String noteType;
    private String content;
    private Long createdBy; // id user (bác sĩ, điều dưỡng)

    public String getNoteType() { return noteType; }
    public void setNoteType(String noteType) { this.noteType = noteType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
}
