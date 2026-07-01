package com.mestrax.backend.controller;

import com.mestrax.backend.model.Reserva;
import com.mestrax.backend.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private static final List<String> ESTADOS_BLOQUEANTES = Arrays.asList("Pendiente", "Confirmada");

    @Autowired
    private ReservaRepository reservaRepository;

    // Listar todas las reservas (para el Admin)
    @GetMapping
    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }

    @GetMapping("/ocupadas")
    public List<Reserva> reservasOcupadas(@RequestParam String fecha, @RequestParam String hora) {
        return reservaRepository.findByFechaAndHoraAndEstadoIn(fecha, hora, ESTADOS_BLOQUEANTES);
    }

    // Crear una nueva reserva (desde el formulario del cliente)
    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva) {
        if (reserva.getEstado() == null || reserva.getEstado().isBlank()) {
            reserva.setEstado("Pendiente");
        }

        if (mesaOcupada(reserva.getFecha(), reserva.getHora(), reserva.getMesa(), null)) {
            return ResponseEntity.status(409).body("La mesa ya está reservada para ese horario.");
        }

        return ResponseEntity.ok(reservaRepository.save(reserva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarReserva(@PathVariable Long id, @RequestBody Reserva reserva) {
        Optional<Reserva> reservaExistente = reservaRepository.findById(id);
        if (reservaExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (mesaOcupada(reserva.getFecha(), reserva.getHora(), reserva.getMesa(), id)) {
            return ResponseEntity.status(409).body("La mesa ya está reservada para ese horario.");
        }

        Reserva actual = reservaExistente.get();
        actual.setCliente(reserva.getCliente());
        actual.setTelefono(reserva.getTelefono());
        actual.setEmail(reserva.getEmail());
        actual.setFecha(reserva.getFecha());
        actual.setHora(reserva.getHora());
        actual.setPersonas(reserva.getPersonas());
        actual.setMesa(reserva.getMesa());
        actual.setComentarios(reserva.getComentarios());
        actual.setEstado(reserva.getEstado());

        return ResponseEntity.ok(reservaRepository.save(actual));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestBody Reserva reserva) {
        return reservaRepository.findById(id)
                .map(actual -> {
                    String nuevoEstado = reserva.getEstado();
                    if (nuevoEstado == null || nuevoEstado.isBlank()) {
                        return ResponseEntity.badRequest().body("Estado inválido");
                    }

                    if (ESTADOS_BLOQUEANTES.contains(nuevoEstado) && mesaOcupada(actual.getFecha(), actual.getHora(), actual.getMesa(), id)) {
                        return ResponseEntity.status(409).body("La mesa ya está reservada para ese horario.");
                    }

                    actual.setEstado(nuevoEstado);
                    return ResponseEntity.ok(reservaRepository.save(actual));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Eliminar una reserva
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReserva(@PathVariable Long id) {
        if (!reservaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        reservaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private boolean mesaOcupada(String fecha, String hora, Integer mesa, Long excluirId) {
        if (fecha == null || hora == null || mesa == null) {
            return false;
        }

        return reservaRepository.findByFechaAndHoraAndMesaAndEstadoIn(fecha, hora, mesa, ESTADOS_BLOQUEANTES)
                .stream()
                .anyMatch(reserva -> excluirId == null || !excluirId.equals(reserva.getId()));
    }
}