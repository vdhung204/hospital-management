package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "drug")
public class Drug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // code VARCHAR(50) NOT NULL UNIQUE
    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    // name VARCHAR(200) NOT NULL
    @Column(name = "name", nullable = false, length = 200)
    private String name;

    // form VARCHAR(50) NULL
    @Column(name = "form", length = 50)
    private String form;     // dạng bào chế: viên, ống, gói...

    // strength VARCHAR(50) NULL
    @Column(name = "strength", length = 50)
    private String strength; // hàm lượng: 500mg, 1g...

    // service_item_id BIGINT NOT NULL
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_item_id", nullable = false)
    private ServiceItem serviceItem;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    public Boolean getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }

    // ===== getters / setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getForm() { return form; }
    public void setForm(String form) { this.form = form; }

    public String getStrength() { return strength; }
    public void setStrength(String strength) { this.strength = strength; }

    public ServiceItem getServiceItem() { return serviceItem; }
    public void setServiceItem(ServiceItem serviceItem) { this.serviceItem = serviceItem; }
}
