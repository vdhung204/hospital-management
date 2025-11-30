package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.master.ServiceItemDto;
import com.hospital.hospitalmis.dto.master.ServiceItemRequest;
import com.hospital.hospitalmis.dto.master.TariffDto;
import com.hospital.hospitalmis.dto.master.TariffRequest;
import com.hospital.hospitalmis.service.ServiceItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-items")
public class ServiceItemController {

    private final ServiceItemService serviceItemService;

    public ServiceItemController(ServiceItemService serviceItemService) {
        this.serviceItemService = serviceItemService;
    }

    // GET /api/service-items
    @GetMapping
    public ResponseEntity<List<ServiceItemDto>> getAll() {
        return ResponseEntity.ok(serviceItemService.getAll());
    }

    // GET /api/service-items/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ServiceItemDto> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(serviceItemService.getById(id));
    }

    // POST /api/service-items
    @PostMapping
    public ResponseEntity<ServiceItemDto> create(@RequestBody ServiceItemRequest request) {
        ServiceItemDto dto = serviceItemService.create(request);
        return ResponseEntity.ok(dto);
    }

    // PUT /api/service-items/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ServiceItemDto> update(
            @PathVariable Long id,
            @RequestBody ServiceItemRequest request
    ) {
        ServiceItemDto dto = serviceItemService.update(id, request);
        return ResponseEntity.ok(dto);
    }

    // DELETE /api/service-items/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceItemService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/service-items/{id}/tariffs
    @GetMapping("/{id}/tariffs")
    public ResponseEntity<List<TariffDto>> getTariffs(@PathVariable Long id) {
        return ResponseEntity.ok(serviceItemService.getTariffs(id));
    }

    // POST /api/service-items/{id}/tariffs
    @PostMapping("/{id}/tariffs")
    public ResponseEntity<TariffDto> addTariff(
            @PathVariable Long id,
            @RequestBody TariffRequest request
    ) {
        TariffDto dto = serviceItemService.addTariff(id, request);
        return ResponseEntity.ok(dto);
    }
}
