package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clinical_note")
public class ClinicalNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK Encounter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id", nullable = false)
    private Encounter encounter;

    @Column(name = "note_type", length = 20)
    private String noteType; // SOAP, NURSING,...

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_by")
    private Long createdBy; // tạm để user_id dạng Long

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // getters/setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Encounter getEncounter() { return encounter; }

    public void setEncounter(Encounter encounter) { this.encounter = encounter; }

    public String getNoteType() { return noteType; }

    public void setNoteType(String noteType) { this.noteType = noteType; }

    public String getContent() { return content; }

    public void setContent(String content) { this.content = content; }

    public Long getCreatedBy() { return createdBy; }

    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
