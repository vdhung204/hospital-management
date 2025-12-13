package com.hospital.hospitalmis.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId; // Lưu ID user thao tác (có thể null nếu là system)

    @Column(name = "username")
    private String username; // Lưu thêm username để tra cứu nhanh mà không cần join bảng

    @Column(nullable = false, length = 50)
    private String action; // CREATE, UPDATE, DELETE, LOGIN...

    @Column(name = "entity_name", nullable = false, length = 100)
    private String entityName; // Encounter, Invoice, Patient...

    @Column(name = "entity_id")
    private Long entityId; // ID của đối tượng bị tác động

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String details; // JSON chi tiết thay đổi hoặc ghi chú

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}