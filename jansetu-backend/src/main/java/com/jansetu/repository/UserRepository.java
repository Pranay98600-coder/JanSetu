package com.jansetu.repository;

import java.util.Optional;
import com.jansetu.entity.User;
import com.jansetu.enums.Role;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jansetu.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
    List<User> findAllByRoleOrderByCreatedAtDesc(Role role);
}