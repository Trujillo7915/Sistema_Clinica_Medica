// ============================================================================
// CLINIGEST SGCM - MOTOR DE PERSISTENCIA Y REGLAS DE NEGOCIO (RN-01 a RN-08)
// ============================================================================

class ClinicStore {
  constructor() {
    this.STORAGE_KEY = "clinigest_sgcm_state_v2";
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.pacientes) && Array.isArray(parsed.medicos)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error cargando estado desde localStorage:", e);
    }
    const initial = JSON.parse(JSON.stringify(window.CLINIC_MOCK_DATA || {}));
    this.saveState(initial);
    return initial;
  }

  saveState(stateToSave = this.state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error guardando estado en localStorage:", e);
    }
  }

  resetToDefault() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.state = JSON.parse(JSON.stringify(window.CLINIC_MOCK_DATA || {}));
    this.saveState(this.state);
  }

  // --- VALIDACIONES DE DOMINIO COMPARTIDAS (RN-01, RN-04, RN-05) ---
  validarTelefono(telefono) {
    const limpio = String(telefono || "").trim();
    // RN-04 / RF-01.2: Solo dígitos (o +, -, espacios) y al menos 7 dígitos numéricos
    const soloDigitos = limpio.replace(/[\s+\-]/g, "");
    if (!/^\d+$/.test(soloDigitos) || soloDigitos.length < 7) {
      throw new Error("Regla RN-04 (RF-01.2): El teléfono debe contener únicamente números y tener mínimo 7 dígitos.");
    }
    return limpio;
  }

  calcularEdad(fechaNacimiento, edadManual) {
    if (edadManual !== undefined && edadManual !== null && String(edadManual).trim() !== "") {
      const n = Number(edadManual);
      if (!Number.isNaN(n) && n >= 0 && n <= 125) return n;
    }
    if (!fechaNacimiento) return 30;
    const hoy = new Date("2026-11-10T00:00:00");
    const nac = new Date(fechaNacimiento + "T00:00:00");
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
      edad--;
    }
    return Math.max(0, edad);
  }

  // --- PACIENTES (HU-01, HU-02, HU-03 | RF-01..03 | RN-01, RN-04) ---
  getPacientes() {
    return this.state.pacientes || [];
  }

  getPacienteById(id) {
    return this.getPacientes().find(p => p.id === id || p.numeroDoc === id);
  }

  addPaciente(pacienteData) {
    const numeroDoc = String(pacienteData.numeroDoc || "").trim();
    const nombres = String(pacienteData.nombres || "").trim();
    const apellidos = String(pacienteData.apellidos || "").trim();
    const direccion = String(pacienteData.direccion || "").trim();

    if (!numeroDoc) {
      throw new Error("El número de identificación del paciente es obligatorio (RN-01).");
    }
    if (!nombres || !apellidos) {
      throw new Error("Regla RF-01.3: El nombre completo del paciente no puede enviarse vacío.");
    }
    if (!direccion) {
      throw new Error("La dirección de residencia es obligatoria según el esquema de base de datos (RF-01.1).");
    }

    const telefono = this.validarTelefono(pacienteData.telefono);
    const edad = this.calcularEdad(pacienteData.fechaNacimiento, pacienteData.edad);
    if (edad < 0 || edad > 125) {
      throw new Error("La edad del paciente debe estar entre 0 y 125 años.");
    }

    // RN-01: Unicidad de identificación
    const exists = this.state.pacientes.some(
      p => p.numeroDoc.toLowerCase() === numeroDoc.toLowerCase() || p.id.toLowerCase() === `pac-${numeroDoc.toLowerCase()}`
    );
    if (exists) {
      throw new Error(`Regla RN-01: Ya existe un paciente registrado con el documento ${numeroDoc}.`);
    }

    const fechaHoy = new Date().toISOString().split("T")[0];
    const id = pacienteData.id || `PAC-${numeroDoc}`;
    const newPaciente = {
      ...pacienteData,
      id,
      numeroDoc,
      nombres,
      apellidos,
      edad,
      telefono,
      direccion,
      grupoSanguineo: pacienteData.grupoSanguineo || "O+",
      contactoEmergencia: pacienteData.contactoEmergencia || "Sin contacto registrado",
      antecedentes: pacienteData.antecedentes || "Sin antecedentes patológicos reportados",
      alergias: pacienteData.alergias || "Ninguna conocida",
      estado: "Activo",
      fechaCreacionHistoria: fechaHoy,
      fechaRegistro: fechaHoy
    };

    this.state.pacientes.unshift(newPaciente);
    this.saveState();
    return newPaciente;
  }

  updatePaciente(id, updatedFields) {
    const idx = this.state.pacientes.findIndex(p => p.id === id || p.numeroDoc === id);
    if (idx === -1) {
      throw new Error(`Regla RF-03.2: Paciente con ID ${id} no encontrado en el sistema.`);
    }

    if (updatedFields.telefono !== undefined) {
      this.validarTelefono(updatedFields.telefono);
    }
    if (updatedFields.direccion !== undefined && !String(updatedFields.direccion).trim()) {
      throw new Error("La dirección del paciente no puede quedar vacía.");
    }

    this.state.pacientes[idx] = {
      ...this.state.pacientes[idx],
      ...updatedFields
    };
    this.saveState();
    return this.state.pacientes[idx];
  }

  // --- MÉDICOS (HU-04, HU-05, HU-06 | RF-04..06 | RN-01, RN-04, RN-05, RN-08) ---
  getMedicos() {
    return this.state.medicos || [];
  }

  getMedicoById(id) {
    return this.getMedicos().find(m => m.id === id);
  }

  addMedico(medicoData) {
    const nombres = String(medicoData.nombres || "").trim();
    const apellidos = String(medicoData.apellidos || "").trim();
    const especialidad = String(medicoData.especialidad || "").trim();
    const registroMedico = String(medicoData.registroMedico || "").trim();
    const edad = Number(medicoData.edad);

    if (!nombres || !apellidos) {
      throw new Error("El nombre y apellidos del facultativo son obligatorios.");
    }
    if (!especialidad) {
      throw new Error("Regla RF-04.3: El campo de especialidad médica no puede estar vacío.");
    }
    if (Number.isNaN(edad) || edad < 18 || edad > 99) {
      throw new Error("Regla RN-05 (RF-04.2): La edad laboral del médico debe estar entre 18 y 99 años.");
    }

    const telefono = this.validarTelefono(medicoData.telefono);

    // RN-01: Validar registro médico o documento duplicado
    const exists = this.state.medicos.some(
      m => m.registroMedico.toLowerCase() === registroMedico.toLowerCase()
    );
    if (exists) {
      throw new Error(`Regla RN-01: El registro médico ${registroMedico} ya está asignado a otro facultativo.`);
    }

    const nextNum = this.state.medicos.length + 1;
    const id = medicoData.id || `MED-${String(nextNum).padStart(2, "0")}`;
    const newMedico = {
      ...medicoData,
      id,
      nombres,
      apellidos,
      edad,
      especialidad,
      registroMedico,
      telefono,
      activo: true,
      estado: "Activo"
    };

    this.state.medicos.push(newMedico);
    this.saveState();
    return newMedico;
  }

  // HU-06 / RF-06 / RN-08: Eliminar o dar de baja médico validando citas futuras agendadas
  getCitasActivasByMedico(medicoId) {
    return this.getCitas().filter(
      c => c.medicoId === medicoId && (c.estado === "Agendada" || c.estado === "En Espera" || c.estado === "En Consulta")
    );
  }

  eliminarMedico(medicoId) {
    const idx = this.state.medicos.findIndex(m => m.id === medicoId);
    if (idx === -1) {
      throw new Error(`Regla RF-06.3: El médico con ID ${medicoId} no existe en el sistema.`);
    }

    const citasActivas = this.getCitasActivasByMedico(medicoId);
    if (citasActivas.length > 0) {
      const codigos = citasActivas.map(c => `${c.id} (${c.fecha} ${c.horaInicio})`).join(", ");
      throw new Error(
        `Bloqueo RN-08 (RF-06.2): No se puede dar de baja al facultativo porque tiene ${citasActivas.length} cita(s) activa(s) en estado AGENDADA: ${codigos}. Debe cancelarlas o reasignarlas primero.`
      );
    }

    const removed = this.state.medicos[idx];
    this.state.medicos.splice(idx, 1);
    this.saveState();
    return removed;
  }

  // --- CITAS & MATRIZ DE DISPONIBILIDAD EN VIVO (HU-07, HU-08 | RN-02, RN-03) ---
  getCitas() {
    return this.state.citas || [];
  }

  getCitasByDoctorAndDate(medicoId, fecha) {
    return this.getCitas().filter(
      c => c.medicoId === medicoId && c.fecha === fecha && c.estado !== "Cancelada"
    );
  }

  getSlotsDisponibilidad(medicoId, fecha) {
    const horariosBase = [
      { horaInicio: "08:00", horaFin: "08:30" },
      { horaInicio: "08:30", horaFin: "09:00" },
      { horaInicio: "09:00", horaFin: "09:30" },
      { horaInicio: "09:30", horaFin: "10:00" },
      { horaInicio: "10:00", horaFin: "10:30" },
      { horaInicio: "10:30", horaFin: "11:00" },
      { horaInicio: "11:00", horaFin: "11:30" },
      { horaInicio: "11:30", horaFin: "12:00" }
    ];

    const citasMedico = this.getCitasByDoctorAndDate(medicoId, fecha);

    return horariosBase.map(slot => {
      const ocupada = citasMedico.find(c => c.horaInicio === slot.horaInicio);
      return {
        horaInicio: slot.horaInicio,
        horaFin: slot.horaFin,
        etiqueta: `${slot.horaInicio} - ${slot.horaFin}`,
        libre: !ocupada,
        cita: ocupada || null
      };
    });
  }

  addCita(citaData) {
    const paciente = this.getPacienteById(citaData.pacienteId);
    if (!paciente) {
      throw new Error("Regla RF-07.2: El ID del paciente seleccionado no existe en el sistema.");
    }
    const medico = this.getMedicoById(citaData.medicoId);
    if (!medico) {
      throw new Error("Regla RF-07.2: El ID del médico seleccionado no existe en el sistema.");
    }
    if (!citaData.fecha || !citaData.horaInicio) {
      throw new Error("Regla RF-07.3: Debe especificar una fecha y franja horaria válidas.");
    }
    if (!citaData.motivo || String(citaData.motivo).trim().length < 4) {
      throw new Error("El motivo clínico de la consulta es obligatorio.");
    }

    // RN-02 / RF-07.4: Validar colisión de horario del mismo médico
    const colisionMedico = this.state.citas.find(
      c =>
        c.medicoId === citaData.medicoId &&
        c.fecha === citaData.fecha &&
        c.horaInicio === citaData.horaInicio &&
        c.estado !== "Cancelada"
    );

    if (colisionMedico) {
      throw new Error(
        `Conflicto de Agenda RN-02 (RF-07.4): ${medico.nombres} ${medico.apellidos} ya tiene la cita ${colisionMedico.id} asignada el ${citaData.fecha} a las ${citaData.horaInicio} con ${colisionMedico.pacienteNombre}.`
      );
    }

    // Validar colisión simultánea para el mismo paciente
    const colisionPaciente = this.state.citas.find(
      c =>
        c.pacienteId === citaData.pacienteId &&
        c.fecha === citaData.fecha &&
        c.horaInicio === citaData.horaInicio &&
        c.estado !== "Cancelada"
    );

    if (colisionPaciente) {
      throw new Error(
        `El paciente ${paciente.nombres} ${paciente.apellidos} ya tiene otra cita programada el ${citaData.fecha} a las ${citaData.horaInicio}.`
      );
    }

    const nextNum = 4096 + this.state.citas.length;
    const id = `CT-${nextNum}`;
    const newCita = {
      ...citaData,
      id,
      estado: "Agendada",
      estadoBd: "AGENDADA",
      tiempoLlegada: null,
      tiempoEsperaMin: 0
    };

    this.state.citas.unshift(newCita);
    this.saveState();
    return newCita;
  }

  // HU-08 / RF-08 / RN-03: Cancelar cita con motivo obligatorio y liberación de cupo
  cancelarCita(citaId, motivoCancelacion) {
    if (!motivoCancelacion || motivoCancelacion.trim().length < 5) {
      throw new Error("Regla RN-03: El motivo de cancelación es obligatorio (mínimo 5 caracteres).");
    }

    const cita = this.state.citas.find(c => c.id === citaId);
    if (!cita) {
      throw new Error(`Regla RF-08.2: La cita ${citaId} no existe.`);
    }
    if (cita.estado === "Cancelada" || cita.estado === "Atendida") {
      throw new Error(`Regla RF-08.2: No es posible cancelar una cita que ya se encuentra en estado ${cita.estado.toUpperCase()}.`);
    }

    cita.estado = "Cancelada";
    cita.estadoBd = "CANCELADA";
    cita.motivoCancelacion = motivoCancelacion.trim();
    cita.fechaCancelacion = new Date().toISOString();
    this.saveState();
    return cita;
  }

  marcarCheckInLlegada(citaId) {
    const cita = this.state.citas.find(c => c.id === citaId);
    if (!cita) return null;
    cita.estado = "En Espera";
    cita.estadoBd = "AGENDADA";
    const now = new Date();
    cita.tiempoLlegada = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    cita.tiempoEsperaMin = 1;
    this.saveState();
    return cita;
  }

  llamarAConsulta(citaId) {
    const cita = this.state.citas.find(c => c.id === citaId);
    if (!cita) return null;
    cita.estado = "En Consulta";
    cita.estadoBd = "AGENDADA";
    this.saveState();
    return cita;
  }

  // --- CONSULTAS & EXPEDIENTE CLÍNICO (HU-09, HU-10 | RF-09, RF-10 | RN-06, RN-07) ---
  getConsultas() {
    return this.state.consultas || [];
  }

  getConsultasByPacienteId(pacienteId) {
    return this.getConsultas()
      .filter(c => c.pacienteId === pacienteId)
      .sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  }

  addConsulta(consultaData) {
    if (!consultaData.pacienteId || !this.getPacienteById(consultaData.pacienteId)) {
      throw new Error("Regla RF-09.2: Debe seleccionar un paciente válido registrado en el sistema.");
    }
    if (!consultaData.diagnosticoPrincipal || !consultaData.diagnosticoPrincipal.descripcion) {
      throw new Error("Regla RF-09.1: El diagnóstico clínico es obligatorio.");
    }
    if (!consultaData.planTratamiento || !String(consultaData.planTratamiento).trim()) {
      throw new Error("Regla RF-09.1: El plan de tratamiento es obligatorio.");
    }

    const seq = String(this.state.consultas.length + 1).padStart(3, "0");
    const id = `EXP-2026-${seq}`;
    const newConsulta = {
      ...consultaData,
      id,
      fecha: consultaData.fecha || "2026-11-10",
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // RN-06: Transición automática del estado de la cita asociada a ATENDIDA
    if (consultaData.citaId) {
      const cita = this.state.citas.find(c => c.id === consultaData.citaId);
      if (cita) {
        cita.estado = "Atendida";
        cita.estadoBd = "ATENDIDA";
      }
    }

    this.state.consultas.unshift(newConsulta);
    this.saveState();
    return newConsulta;
  }

  // --- BÚSQUEDA GLOBAL MULTICRITERIO (Ctrl + K) ---
  buscarGlobal(termino) {
    if (!termino || termino.trim().length === 0) return { pacientes: [], medicos: [], citas: [] };
    const term = termino.toLowerCase().trim();

    const pacientes = this.state.pacientes
      .filter(
        p =>
          p.id.toLowerCase().includes(term) ||
          p.numeroDoc.toLowerCase().includes(term) ||
          `${p.nombres} ${p.apellidos}`.toLowerCase().includes(term) ||
          p.telefono.includes(term) ||
          p.eps.toLowerCase().includes(term)
      )
      .slice(0, 5);

    const medicos = this.state.medicos
      .filter(
        m =>
          m.id.toLowerCase().includes(term) ||
          `${m.nombres} ${m.apellidos}`.toLowerCase().includes(term) ||
          m.especialidad.toLowerCase().includes(term) ||
          m.consultorio.toLowerCase().includes(term) ||
          m.registroMedico.toLowerCase().includes(term)
      )
      .slice(0, 5);

    const citas = this.state.citas
      .filter(
        c =>
          c.id.toLowerCase().includes(term) ||
          c.pacienteNombre.toLowerCase().includes(term) ||
          c.medicoNombre.toLowerCase().includes(term) ||
          c.estado.toLowerCase().includes(term)
      )
      .slice(0, 5);

    return { pacientes, medicos, citas };
  }
}

window.clinicStore = new ClinicStore();
