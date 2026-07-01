package com.mestrax.backend.controller;

import com.mestrax.backend.model.Admin;
import com.mestrax.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Admin> adminOptional = adminService.authenticate(email, password);

        if (adminOptional.isPresent()) {
            Admin admin = adminOptional.get();
            admin.setPassword(null); // Seguridad: no enviar contraseña
            return ResponseEntity.ok(admin);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Credenciales incorrectas");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}