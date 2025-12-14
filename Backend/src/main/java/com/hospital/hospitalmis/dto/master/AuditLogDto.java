package com.hospital.hospitalmis.dto.master;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AuditLogDto {
    private Long id;
    private Long userId;
    private String username;
    private String action;
    private String entityName;
    private Long entityId;
    private LocalDateTime createdAt;
    private String details;
}