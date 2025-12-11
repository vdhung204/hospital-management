package com.hospital.hospitalmis.controller;

import com.hospital.hospitalmis.dto.master.ImagingProcedureDto;
import com.hospital.hospitalmis.dto.master.ImagingProcedureRequest;
import com.hospital.hospitalmis.service.impl.ImagingProcedureServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/imaging-procedures")
public class ImagingProcedureController {

    private final ImagingProcedureServiceImpl imagingService;

    public ImagingProcedureController(ImagingProcedureServiceImpl imagingService) {
        this.imagingService = imagingService;
    }

    @GetMapping
    public ResponseEntity<List<ImagingProcedureDto>> getAll() {
        return ResponseEntity.ok(imagingService.getAll());
    }

    @PostMapping
    public ResponseEntity<ImagingProcedureDto> create(@RequestBody ImagingProcedureRequest req) {
        return ResponseEntity.ok(imagingService.create(req));
    }

    // ... Put, Delete tương tự
}