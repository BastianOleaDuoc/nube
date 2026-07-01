package com.mestrax.backend.repository;

import com.mestrax.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
	List<Reserva> findByFechaAndHoraAndMesaAndEstadoIn(String fecha, String hora, Integer mesa, Collection<String> estados);

	List<Reserva> findByFechaAndHoraAndEstadoIn(String fecha, String hora, Collection<String> estados);
}