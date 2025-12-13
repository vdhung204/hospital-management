package com.hospital.hospitalmis.service;

import com.hospital.hospitalmis.dto.master.AuditLogDto;
import com.hospital.hospitalmis.entity.AuditLog;
import com.hospital.hospitalmis.repository.AuditLogRepository;
import com.hospital.hospitalmis.security.SecurityUtils; // Class utility lấy user hiện tại
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final SecurityUtils securityUtils;

    /**
     * Hàm ghi log thủ công (dùng khi cần ghi chi tiết logic nghiệp vụ)
     * Đánh dấu @Async để việc ghi log không làm chậm thao tác chính của user
     */
    @Async
    @Transactional
    public void log(String action, String entityName, Long entityId, String details) {
        Long userId = null;
        String username = "SYSTEM";

        try {
            userId = securityUtils.getCurrentUserId();
            // Giả sử SecurityUtils có hàm lấy username, nếu không thì query DB
            username = securityUtils.getCurrentUsername();
        } catch (Exception e) {
            // Ignore nếu là tác vụ hệ thống tự chạy (cron job) không có user login
        }

        AuditLog log = AuditLog.builder()
                .userId(userId)
                .username(username)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .createdAt(LocalDateTime.now())
                .build();

        auditLogRepository.save(log);
    }

    // Lấy danh sách log (cho Admin xem)
    public List<AuditLogDto> getLogsByEntity(String entityName, Long entityId) {
        return auditLogRepository.findByEntityNameAndEntityIdOrderByCreatedAtDesc(entityName, entityId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<AuditLogDto> getRecentLogs() {
        // Lấy 100 log gần nhất (Ví dụ)
        // Thực tế nên dùng Pageable
        return auditLogRepository.findAll().stream()
                .sorted((a,b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(100)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AuditLogDto mapToDto(AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        dto.setUserId(log.getUserId());
        dto.setUsername(log.getUsername());
        dto.setAction(log.getAction());
        dto.setEntityName(log.getEntityName());
        dto.setEntityId(log.getEntityId());
        dto.setCreatedAt(log.getCreatedAt());
        dto.setDetails(log.getDetails());
        return dto;
    }
}