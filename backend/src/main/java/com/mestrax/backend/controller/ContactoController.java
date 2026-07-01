package com.mestrax.backend.controller;

import com.mestrax.backend.model.Contacto;
import com.mestrax.backend.repository.ContactoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/contactos")
public class ContactoController {

    @Autowired
    private ContactoRepository contactoRepository;

    @GetMapping
    public List<Contacto> listarContactos() {
        return contactoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Contacto> crearContacto(@RequestBody Contacto contacto) {
        if (contacto.getFechaRegistro() == null) {
            contacto.setFechaRegistro(LocalDateTime.now());
        }

        return ResponseEntity.ok(contactoRepository.save(contacto));
    }
}