package com.jansetu.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminPasswordGenerator {

    @Bean
    CommandLineRunner generateAdminHash(
            PasswordEncoder passwordEncoder) {

        return args -> System.out.println(
                "ADMIN PASSWORD HASH: " +
                passwordEncoder.encode("Admin@12345")
        );
    }
}