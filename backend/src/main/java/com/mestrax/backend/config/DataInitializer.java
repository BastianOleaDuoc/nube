package com.mestrax.backend.config;

import com.mestrax.backend.model.Admin;
import com.mestrax.backend.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final AdminRepository adminRepository;

    public DataInitializer(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) {
        crearAdminSiNoExiste("admin@mestrax.com", "admin123");
        crearAdminSiNoExiste("soporte@mestrax.com", "mestrax2026");
    }

    private void crearAdminSiNoExiste(String email, String password) {
        if (adminRepository.findByEmail(email).isPresent()) {
            return;
        }

        Admin admin = new Admin();
        admin.setEmail(email);
        admin.setPassword(password);
        adminRepository.save(admin);
    }
}
