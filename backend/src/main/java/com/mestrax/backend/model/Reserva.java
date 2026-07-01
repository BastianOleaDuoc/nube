package com.mestrax.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonAlias;

@Entity
@Table(name = "reservas")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonAlias({"nombre", "nombreCliente"})
    private String cliente;
    private String telefono;
    private String email;
    private String fecha;
    private String hora;
    private int personas;
    private Integer mesa;
    private String comentarios;
    private String estado; // Pendiente, Confirmada, Cancelada

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }
    public int getPersonas() { return personas; }
    public void setPersonas(int personas) { this.personas = personas; }
    public Integer getMesa() { return mesa; }
    public void setMesa(Integer mesa) { this.mesa = mesa; }
    public String getComentarios() { return comentarios; }
    public void setComentarios(String comentarios) { this.comentarios = comentarios; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}