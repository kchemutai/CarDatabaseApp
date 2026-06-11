package com.packt.CarDatabase.repository;

import com.packt.CarDatabase.domain.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Optional<Owner> findByFirstname(String firstname);
}
