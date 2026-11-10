// ============================================================================
// CLOUD CLINIGEST SGCM - LOCAL STORE & PERSISTENCE (LocalStorage)
// ============================================================================

class ClinicStore {
  constructor() {
    this.STORAGE_KEY = "clinigest_sgcm_state_v1";
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Error loading state from localStorage:", e);
    }
    // Deep clone initial seed data
    const initial = JSON.parse(JSON.stringify(window.CLINIC_MOCK_DATA || {}));
    this.saveState(initial);
    return initial;
  }

  saveState(stateToSave = this.state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error saving state to localStorage:", e);
    }
  }

  resetToDefault() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.state = JSON.parse(JSON.stringify(window.CLINIC_MOCK_DATA || {}));
    this.saveState(this.state);
  }

  // --- PACIENTES (HU-01, HU-02, HU-03) ---
  getPacientes() {
    return this.state.pacientes || [];
  }

  getPacienteById(id) {
    return this.getPacientes().find(p => p.id === id || p.numeroDoc === id);
  }

  addPaciente(pacienteData) {
    const id = pacienteData.id || `PAC-${pacienteData.numeroDoc}`;
    const newPaciente = {
      ...pacienteData,
      id,
      estado: pacienteData.estado || "Activo",
      fechaRegistro: new Date().toISOString().split("T")[0]
    };
    
    // Check duplicate
    const exists = this.state.pacientes.some(p => p.numeroDoc === newPaciente.numeroDoc);
    if (exists) {
      throw new Error(`Ya existe un paciente registrado con el documento ${newPaciente.numeroDoc}`);
    }

    this.state.pacientes.unshift(newPaciente);
    this.saveState();
    return newPaciente;
  }

  updatePaciente(id, updatedFields) {
    const idx = this.state.pacientes.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new Error(`Paciente con ID ${id} no encontrado.`);
    }
    this.state.pacientes[idx] = {
      ...this.state.pacientes[idx],
      ...updatedFields
    };
    this.saveState();
    return this.state.pacientes[idx];
  }

  // --- MEDICOS (HU-04, HU-05) ---
  getMedicos() {
    return this.state.medicos || [];
  }

  getMedicoById(id) {
    return this.getMedicos().find(m => m.id === id);
  }

  addMedico(medicoData) {
    const id = medicoData.id || `MED-0${this.state.medicos.length + 1}`;
    const newMedico = {
      ...medicoData,
      id,
      estado: medicoData.estado || "Activo"
    };

    // Check duplicate license
    const exists = this.state.medicos.some(m => m.registroMedico === newMedico.registroMedico);
    if (exists) {
      throw new Error(`El registro médico ${newMedico.registroMedico} ya está asignado a otro facultativo.`);
    }

    this.state.medicos.push(newMedico);
    this.saveState();
    return newMedico;
  }

  // --- CITAS & VALIDACIÓN RN-02 (PREVENCIÓN TRASLAPE 30 MIN) ---
  getCitas() {
    return this.state.citas || [];
  }

  getCitasByFecha(fecha) {
    return this.getCitas().filter(c => c.fecha === fecha && c.estado !== "Cancelada");
  }

  getCitasByDoctor(medicoId, fecha) {
    return this.getCitas().filter(c => c.medicoId === medicoId && (!fecha || c.fecha === fecha));
  }

  addCita(citaData) {
    // RN-02: Validar colisión de horario de 30 minutos para el mismo médico
    const colisionMedico = this.state.citas.find(c => 
      c.medicoId === citaData.medicoId &&
      c.fecha === citaData.fecha &&
      c.horaInicio === citaData.horaInicio &&
      c.estado !== "Cancelada"
    );

    if (colisionMedico) {
      throw new Error(`Conflicto de horario (RN-02): El médico ya tiene una cita asignada el ${citaData.fecha} a las ${citaData.horaInicio}.`);
    }

    // Validar colisión para el mismo paciente
    const colisionPaciente = this.state.citas.find(c =>
      c.pacienteId === citaData.pacienteId &&
      c.fecha === citaData.fecha &&
      c.horaInicio === citaData.horaInicio &&
      c.estado !== "Cancelada"
    );

    if (colisionPaciente) {
      throw new Error(`El paciente ya cuenta con una cita en esa misma franja horaria (${citaData.horaInicio}).`);
    }

    const id = `CT-${Math.floor(4000 + Math.random() * 9000)}`;
    const newCita = {
      ...citaData,
      id,
      estado: citaData.estado || "Agendada",
      tiempoLlegada: null,
      tiempoEsperaMin: 0
    };

    this.state.citas.push(newCita);
    this.saveState();
    return newCita;
  }

  // RN-03: Cancelación con motivo obligatorio
  cancelarCita(citaId, motivoCancelacion) {
    if (!motivoCancelacion || motivoCancelacion.trim().length < 5) {
      throw new Error("El motivo de cancelación es obligatorio y debe tener al menos 5 caracteres (RN-03).");
    }

    const cita = this.state.citas.find(c => c.id === citaId);
    if (!cita) {
      throw new Error(`Cita ${citaId} no encontrada.`);
    }

    cita.estado = "Cancelada";
    cita.motivoCancelacion = motivoCancelacion;
    cita.fechaCancelacion = new Date().toISOString();
    this.saveState();
    return cita;
  }

  marcarCheckInLlegada(citaId) {
    const cita = this.state.citas.find(c => c.id === citaId);
    if (!cita) return;
    cita.estado = "En Espera";
    const now = new Date();
    cita.tiempoLlegada = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    cita.tiempoEsperaMin = 1;
    this.saveState();
    return cita;
  }

  llamarAConsulta(citaId) {
    const cita = this.state.citas.find(c => c.id === citaId);
    if (!cita) return;
    cita.estado = "En Consulta";
    this.saveState();
    return cita;
  }

  // --- CONSULTAS & EXPEDIENTE CLÍNICO (HU-09, HU-10) ---
  getConsultas() {
    return this.state.consultas || [];
  }

  getConsultasByPacienteId(pacienteId) {
    return this.getConsultas().filter(c => c.pacienteId === pacienteId);
  }

  addConsulta(consultaData) {
    const id = `EXP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newConsulta = {
      ...consultaData,
      id,
      fecha: consultaData.fecha || new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Actualizar estado de la cita si aplica
    if (consultaData.citaId) {
      const cita = this.state.citas.find(c => c.id === consultaData.citaId);
      if (cita) {
        cita.estado = "Atendida";
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

    const pacientes = this.state.pacientes.filter(p => 
      p.numeroDoc.includes(term) ||
      p.nombres.toLowerCase().includes(term) ||
      p.apellidos.toLowerCase().includes(term) ||
      p.telefono.includes(term) ||
      p.eps.toLowerCase().includes(term)
    ).slice(0, 5);

    const medicos = this.state.medicos.filter(m =>
      m.nombres.toLowerCase().includes(term) ||
      m.apellidos.toLowerCase().includes(term) ||
      m.especialidad.toLowerCase().includes(term) ||
      m.consultorio.toLowerCase().includes(term)
    ).slice(0, 4);

    const citas = this.state.citas.filter(c =>
      c.id.toLowerCase().includes(term) ||
      c.pacienteNombre.toLowerCase().includes(term) ||
      c.pacienteDoc.includes(term) ||
      c.medicoNombre.toLowerCase().includes(term)
    ).slice(0, 4);

    return { pacientes, medicos, citas };
  }
}

// Instanciar almacén global
window.clinicStore = new ClinicStore();
