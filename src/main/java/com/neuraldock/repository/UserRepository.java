package com.neuraldock.repository;

import com.neuraldock.entity.User_;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User_, Integer> {
    boolean existsByEmailIgnoreCase(String email);
}