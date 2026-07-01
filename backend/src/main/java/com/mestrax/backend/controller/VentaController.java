package com.mestrax.backend.controller;

import com.mestrax.backend.model.Venta;
import com.mestrax.backend.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaRepository ventaRepository;

    // Registrar una nueva venta
    @PostMapping
    public ResponseEntity<Venta> registrarVenta(@RequestBody Venta venta) {
        if (venta.getEstado() == null || venta.getEstado().isBlank()) {
            venta.setEstado("Pagada");
        }
        return ResponseEntity.ok(ventaRepository.save(venta));
    }

    // Listar todas las ventas (para el reporte del Admin)
    @GetMapping
    public List<Venta> listarVentas() {
        return ventaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> obtenerVenta(@PathVariable Long id) {
        Optional<Venta> venta = ventaRepository.findById(id);
        return venta.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> actualizarVenta(@PathVariable Long id, @RequestBody Venta venta) {
        return ventaRepository.findById(id)
                .map(actual -> {
                    actual.setCliente(venta.getCliente());
                    actual.setProducto(venta.getProducto());
                    actual.setTotal(venta.getTotal());
                    actual.setMetodo(venta.getMetodo());
                    actual.setEstado(venta.getEstado());
                    return ResponseEntity.ok(ventaRepository.save(actual));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Venta> actualizarEstado(@PathVariable Long id, @RequestBody Venta venta) {
        return ventaRepository.findById(id)
                .map(actual -> {
                    actual.setEstado(venta.getEstado());
                    return ResponseEntity.ok(ventaRepository.save(actual));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVenta(@PathVariable Long id) {
        if (!ventaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        ventaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}