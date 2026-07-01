package com.mestrax.backend.repository;

import com.mestrax.backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VentaRepository extends JpaRepository<Venta, Long> {
}