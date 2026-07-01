package com.mestrax.backend.controller;

import com.mestrax.backend.model.Producto;
import com.mestrax.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    // GET para listar todos los productos
    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    // GET para ver un producto por id
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        Optional<Producto> producto = productoRepository.findById(id);
        return producto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST para agregar un producto (útil para tu panel admin después)
    @PostMapping
    public Producto agregarProducto(@RequestBody Producto producto) {
        if (producto.getEstado() == null || producto.getEstado().isBlank()) {
            producto.setEstado("Disponible");
        }
        return productoRepository.save(producto);
    }

    // PUT para editar un producto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        return productoRepository.findById(id)
                .map(actual -> {
                    actual.setNombre(producto.getNombre());
                    actual.setCategoria(producto.getCategoria());
                    actual.setPrecio(producto.getPrecio());
                    actual.setStock(producto.getStock());
                    actual.setEstado(producto.getEstado() == null || producto.getEstado().isBlank() ? actual.getEstado() : producto.getEstado());
                    actual.setImg(producto.getImg());
                    return ResponseEntity.ok(productoRepository.save(actual));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT para alternar estado de disponibilidad
    @PutMapping("/{id}/toggle")
    public ResponseEntity<Producto> alternarEstado(@PathVariable Long id) {
        return productoRepository.findById(id)
                .map(producto -> {
                    String nuevoEstado = "Disponible".equalsIgnoreCase(producto.getEstado()) ? "No disponible" : "Disponible";
                    producto.setEstado(nuevoEstado);
                    return ResponseEntity.ok(productoRepository.save(producto));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE para eliminar un producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        if (!productoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}