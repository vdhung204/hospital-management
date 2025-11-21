package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "dispense_item")
public class DispenseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK -> dispense.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispense_id", nullable = false)
    private Dispense dispense;

    // FK -> drug_batch.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drug_batch_id", nullable = false)
    private DrugBatch drugBatch;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    // ===== getters / setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Dispense getDispense() { return dispense; }
    public void setDispense(Dispense dispense) { this.dispense = dispense; }

    public DrugBatch getDrugBatch() { return drugBatch; }
    public void setDrugBatch(DrugBatch drugBatch) { this.drugBatch = drugBatch; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
