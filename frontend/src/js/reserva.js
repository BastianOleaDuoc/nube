document.addEventListener('DOMContentLoaded', function() {

  const API_BASE = "https://nube-nz47.onrender.com/api";

  const reservaForm = document.getElementById('reservaForm');
  const areaPrincipal = document.querySelector('.area-principal');
  const mesaSeleccionadaInput = document.getElementById('mesaSeleccionada');
  const fechaInput = document.getElementById('fecha');

  let mesaSeleccionada = null;
  let mesasOcupadas = [];

  const posicionesMesas = [
    { id: 1, top: '10%', left: '10%' }, { id: 2, top: '10%', left: '30%' },
    { id: 3, top: '10%', left: '50%' }, { id: 4, top: '10%', left: '70%' },
    { id: 5, top: '30%', left: '10%' }, { id: 6, top: '30%', left: '30%' },
    { id: 7, top: '30%', left: '50%' }, { id: 8, top: '30%', left: '70%' },
    { id: 9, top: '50%', left: '20%' }, { id: 10, top: '50%', left: '40%' },
    { id: 11, top: '50%', left: '60%' }, { id: 12, top: '70%', left: '15%' },
    { id: 13, top: '70%', left: '35%' }, { id: 14, top: '70%', left: '55%' },
    { id: 15, top: '70%', left: '75%' }
  ];

  async function consultarMesasOcupadas() {
    if (!fechaInput || !fechaInput.value) return;

    try {
      // CORREGIDO: Cambiado de http://localhost:8080/api a la URL de Render
      const response = await fetch(`${API_BASE}/reservas/ocupadas?fecha=${fechaInput.value}`);
      if (response.ok) {
        mesasOcupadas = await response.json();
      }
    } catch (error) {
      console.error("Error al obtener mesas ocupadas:", error);
      mesasOcupadas = [];
    } finally {
      generarMesas();
    }
  }

  function generarMesas() {
    if (!areaPrincipal) return;
    areaPrincipal.innerHTML = '';
    
    posicionesMesas.forEach(pos => {
      const mesaDiv = document.createElement('div');
      mesaDiv.className = 'mesa';
      mesaDiv.textContent = pos.id;
      mesaDiv.style.position = 'absolute';
      mesaDiv.style.top = pos.top;
      mesaDiv.style.left = pos.left;

      if (mesasOcupadas.includes(pos.id)) {
        mesaDiv.classList.add('ocupada');
      } else {
        mesaDiv.classList.add('libre');
        mesaDiv.addEventListener('click', () => seleccionarMesa(pos.id, mesaDiv));
      }
      areaPrincipal.appendChild(mesaDiv);
    });
  }

  function seleccionarMesa(numero, elemento) {
    document.querySelectorAll('.mesa.seleccionada').forEach(el => {
      el.classList.remove('seleccionada');
      el.classList.add('libre');
    });
    
    elemento.classList.remove('libre');
    elemento.classList.add('seleccionada');
    mesaSeleccionada = numero;
    if (mesaSeleccionadaInput) mesaSeleccionadaInput.value = numero;
  }

  if (fechaInput) fechaInput.addEventListener('change', consultarMesasOcupadas);

  if (reservaForm) {
    reservaForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const payload = {
        nombreCliente: document.getElementById('nombre').value.trim(),
        fecha: fechaInput.value,
        hora: document.getElementById('hora').value,
        cantidadPersonas: parseInt(document.getElementById('personas').value),
        numeroMesa: parseInt(mesaSeleccionada),
        emailUsuario: localStorage.getItem("usuarioActivo") || "Invitado",
        estado: "Pendiente"
      };

      if (!payload.numeroMesa) return alert('Por favor, selecciona una mesa.');

      try {
        // CORREGIDO: Cambiado de http://localhost:8080/api a la URL de Render
        const response = await fetch(`${API_BASE}/reservas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Error al procesar reserva");

        alert("¡Reserva realizada con éxito!");
        reservaForm.reset();
        mesaSeleccionada = null;
        consultarMesasOcupadas();
      } catch (error) {
        alert("Error de conexión con el servidor de reservas.");
      }
    });
  }
});