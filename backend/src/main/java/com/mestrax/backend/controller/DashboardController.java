package com.mestrax.backend.controller;

import com.mestrax.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private VentaRepository ventaRepository;
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/resumen")
    public Map<String, Object> obtenerResumen() {
        Map<String, Object> resumen = new HashMap<>();
        
        // Contadores para el dashboard
        resumen.put("totalVentas", ventaRepository.count());
        resumen.put("totalReservas", reservaRepository.count());
        resumen.put("totalUsuarios", usuarioRepository.count());
        
        // Suma total de ingresos
        double ingresosTotales = ventaRepository.findAll().stream()
                .mapToDouble(v -> v.getTotal())
                .sum();
        resumen.put("ingresosTotales", ingresosTotales);
        
        return resumen;
    }
}