package com.jansetu.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class EvidenceStorageService {

    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    @Value("${app.upload.dir}")
    private String uploadDirectory;

    public String store(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Evidence image cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "Each image must be 5 MB or smaller"
            );
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Only JPG, PNG and WEBP images are allowed"
            );
        }

        String extension = switch (contentType.toLowerCase()) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new IllegalArgumentException("Unsupported image type");
        };

        String storedFileName = UUID.randomUUID() + extension;

        try {
            Path directory = Paths.get(uploadDirectory)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(directory);

            Path destination = directory.resolve(storedFileName).normalize();

            if (!destination.startsWith(directory)) {
                throw new IllegalArgumentException("Invalid file path");
            }

            file.transferTo(destination);

            return storedFileName;

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to store evidence image",
                    exception
            );
        }
    }

    public void delete(String storedFileName) {

        try {
            Path directory = Paths.get(uploadDirectory)
                    .toAbsolutePath()
                    .normalize();

            Path file = directory.resolve(storedFileName).normalize();

            if (file.startsWith(directory)) {
                Files.deleteIfExists(file);
            }

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to delete evidence image",
                    exception
            );
        }
    }
}