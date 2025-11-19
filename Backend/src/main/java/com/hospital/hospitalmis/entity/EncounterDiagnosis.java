package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "encounter_diagnosis")
public class EncounterDiagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK Encounter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id", nullable = false)
    private Encounter encounter;

    // FK ICD10Code qua cột code
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "icd10_code", referencedColumnName = "code", nullable = false)
    private ICD10Code icd10Code;

    @Column(name = "is_primary")
    private Boolean isPrimary;

    // getters/setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Encounter getEncounter() { return encounter; }

    public void setEncounter(Encounter encounter) { this.encounter = encounter; }

    public ICD10Code getIcd10Code() { return icd10Code; }

    public void setIcd10Code(ICD10Code icd10Code) { this.icd10Code = icd10Code; }

    public Boolean getIsPrimary() { return isPrimary; }

    public void setIsPrimary(Boolean primary) { isPrimary = primary; }
}
