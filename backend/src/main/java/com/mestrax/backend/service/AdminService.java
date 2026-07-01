package com.mestrax.backend.service;

import com.mestrax.backend.model.Admin;
import com.mestrax.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    public Optional<Admin> authenticate(String email, String password) {
        return adminRepository.findByEmail(email)
                .filter(admin -> admin.getPassword().equals(password));
    }
}