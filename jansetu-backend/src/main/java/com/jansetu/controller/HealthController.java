package com.jansetu.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {

        Map<String, Object> response = Map.of(
                "application", "JanSetu",
                "status", "UP",
                "message", "JanSetu Backend is running successfully!",
                "timestamp", LocalDateTime.now().toString()
        );

        return ResponseEntity.ok(response);
    }
}