package com.jansetu.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestAuthorizationController {

    @GetMapping("/citizen/test")
    public String citizenTest() {
        return "Citizen access granted";
    }

    @GetMapping("/admin/test")
    public String adminTest() {
        return "Admin access granted";
    }

    @GetMapping("/officer/test")
    public String officerTest() {
        return "Officer access granted";
    }
}