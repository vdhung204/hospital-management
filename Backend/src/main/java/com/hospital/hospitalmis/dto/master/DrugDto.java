package com.hospital.hospitalmis.dto.master;

public class DrugDto {

    private Long id;
    private String code;
    private String name;
    private String activeIngredient;
    private String form;
    private String strength;

    private Long serviceItemId;
    private String serviceItemCode;
    private String serviceItemName;

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

    public Long getServiceItemId() { return serviceItemId; }
    public void setServiceItemId(Long serviceItemId) { this.serviceItemId = serviceItemId; }

    public String getServiceItemCode() { return serviceItemCode; }
    public void setServiceItemCode(String serviceItemCode) { this.serviceItemCode = serviceItemCode; }

    public String getServiceItemName() { return serviceItemName; }
    public void setServiceItemName(String serviceItemName) { this.serviceItemName = serviceItemName; }

    public String getActiveIngredient() {
        return activeIngredient;
    }

    public void setActiveIngredient(String activeIngredient) {
        this.activeIngredient = activeIngredient;
    }
}
