// ============================================================================
// CLOUD CLINIGEST SGCM - MOCK DATA ENGINE (Fase 5 - UI/UX Prototipado)
// ============================================================================

window.CLINIC_MOCK_DATA = {
  // PACIENTES (HU-01, HU-02, HU-03)
  pacientes: [
    {
      id: "PAC-1020029712",
      tipoDoc: "CC",
      numeroDoc: "1020029712",
      nombres: "Carlos Alberto",
      apellidos: "Mendoza Pérez",
      fechaNacimiento: "1984-05-14",
      edad: 42,
      sexo: "M",
      telefono: "3104567890",
      email: "carlos.mendoza@email.com",
      direccion: "Cra 45 # 128-40, Apto 502, Bogotá",
      eps: "Sura Salud",
      tipoRegimen: "Contributivo",
      contactoEmergencia: "Laura Pérez (Esposa) - 3159988771",
      alergias: "Penicilina (Reacción Anafiláctica Severa)",
      antecedentes: "Hipertensión Grado 2 (Dx 2021), Diabetes Mellitus Tipo 2",
      estado: "Activo",
      fechaRegistro: "2026-01-15"
    },
    {
      id: "PAC-52891044",
      tipoDoc: "CC",
      numeroDoc: "52891044",
      nombres: "Laura Valentina",
      apellidos: "Rivas Cárdenas",
      fechaNacimiento: "1991-08-22",
      edad: 35,
      sexo: "F",
      telefono: "3152209182",
      email: "laura.rivas@clinigest.com",
      direccion: "Calle 116 # 15-28, Bogotá",
      eps: "Sanitas EPS",
      tipoRegimen: "Contributivo",
      contactoEmergencia: "Ricardo Rivas (Padre) - 3108877665",
      alergias: "Ninguna conocida",
      antecedentes: "Arritmia supraventricular paroxística en estudio",
      estado: "Activo",
      fechaRegistro: "2026-02-10"
    },
    {
      id: "PAC-79841203",
      tipoDoc: "CC",
      numeroDoc: "79841203",
      nombres: "Andrés Felipe",
      apellidos: "Torres Morales",
      fechaNacimiento: "1968-11-03",
      edad: 58,
      sexo: "M",
      telefono: "3189013344",
      email: "andres.torres@empresa.com",
      direccion: "Av. Suba # 100-15, Bogotá",
      eps: "Compensar EPS",
      tipoRegimen: "Contributivo",
      contactoEmergencia: "Patricia Vega (Cónyuge) - 3112233445",
      alergias: "Sulfamidas, AINES (Broncoespasmo)",
      antecedentes: "Enfermedad coronaria tratada con stent en 2022",
      estado: "Activo",
      fechaRegistro: "2026-03-01"
    },
    {
      id: "PAC-1017234988",
      tipoDoc: "CC",
      numeroDoc: "1017234988",
      nombres: "María Camila",
      apellidos: "Orozco Jaramillo",
      fechaNacimiento: "1997-03-19",
      edad: 29,
      sexo: "F",
      telefono: "3117742001",
      email: "camila.orozco@gmail.com",
      direccion: "Cra 7 # 72-10, Bogotá",
      eps: "Sura Salud",
      tipoRegimen: "Contributivo",
      contactoEmergencia: "Mateo Orozco (Hermano) - 3145566778",
      alergias: "Yodo / Medios de Contraste",
      antecedentes: "Post-quirúrgica septoplastia (2 semanas)",
      estado: "Activo",
      fechaRegistro: "2026-04-12"
    },
    {
      id: "PAC-1098765432",
      tipoDoc: "TI",
      numeroDoc: "1098765432",
      nombres: "Sofía",
      apellidos: "Gómez Morales",
      fechaNacimiento: "2018-09-05",
      edad: 8,
      sexo: "F",
      telefono: "3001234567",
      email: "acudiente.sofia@gmail.com",
      direccion: "Calle 140 # 9-45, Bogotá",
      eps: "Sanitas EPS",
      tipoRegimen: "Beneficiario",
      contactoEmergencia: "Lucía Morales (Madre) - 3001234567",
      alergias: "Dipirona",
      antecedentes: "Asma infantil controlada",
      estado: "Activo",
      fechaRegistro: "2026-05-20"
    }
  ],

  // MEDICOS (HU-04, HU-05)
  medicos: [
    {
      id: "MED-01",
      nombres: "Roberto",
      apellidos: "Gómez Valenzuela",
      registroMedico: "RM-449102-BOG",
      especialidad: "Cardiología",
      email: "roberto.gomez@clinigest.com",
      telefono: "3148899001",
      consultorio: "Box 03",
      turno: "Mañana (07:00 - 13:00)",
      diasAtencion: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      estado: "Activo"
    },
    {
      id: "MED-02",
      nombres: "Carla",
      apellidos: "Mendoza Ortiz",
      registroMedico: "RM-884102-BOG",
      especialidad: "Neurología",
      email: "carla.mendoza@clinigest.com",
      telefono: "3167788992",
      consultorio: "Box 05",
      turno: "Tarde (13:00 - 19:00)",
      diasAtencion: ["Lunes", "Miércoles", "Viernes"],
      estado: "Activo"
    },
    {
      id: "MED-03",
      nombres: "Santiago",
      apellidos: "Herrera Salazar",
      registroMedico: "RM-109234-BOG",
      especialidad: "Medicina General",
      email: "santiago.herrera@clinigest.com",
      telefono: "3103344556",
      consultorio: "Box 01",
      turno: "Jornada Completa",
      diasAtencion: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      estado: "Activo"
    },
    {
      id: "MED-04",
      nombres: "Elena",
      apellidos: "Silva Restrepo",
      registroMedico: "RM-554210-BOG",
      especialidad: "Pediatría",
      email: "elena.silva@clinigest.com",
      telefono: "3129900112",
      consultorio: "Box 02",
      turno: "Mañana (08:00 - 14:00)",
      diasAtencion: ["Lunes", "Martes", "Jueves"],
      estado: "Activo"
    }
  ],

  // CITAS MÉDICAS (HU-07, HU-08, RN-02, RN-03)
  citas: [
    {
      id: "CT-4091",
      pacienteId: "PAC-1020029712",
      pacienteNombre: "Carlos Alberto Mendoza Pérez",
      pacienteDoc: "CC 1020029712",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez",
      especialidad: "Cardiología",
      fecha: "2026-11-10",
      horaInicio: "08:30",
      horaFin: "09:00",
      consultorio: "Box 03",
      motivo: "Control de Hipertensión Arterial y revisión de esquema Losartán.",
      tipoCita: "Presencial",
      estado: "En Espera", // Agendada, En Espera, En Consulta, Atendida, Cancelada
      tiempoLlegada: "08:15 AM",
      tiempoEsperaMin: 15
    },
    {
      id: "CT-4092",
      pacienteId: "PAC-52891044",
      pacienteNombre: "Laura Valentina Rivas Cárdenas",
      pacienteDoc: "CC 52891044",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez",
      especialidad: "Cardiología",
      fecha: "2026-11-10",
      horaInicio: "09:00",
      horaFin: "09:30",
      consultorio: "Box 03",
      motivo: "Evaluación de taquicardias y lectura de Holter 24 horas.",
      tipoCita: "Presencial",
      estado: "En Espera",
      tiempoLlegada: "08:40 AM",
      tiempoEsperaMin: 20
    },
    {
      id: "CT-4093",
      pacienteId: "PAC-79841203",
      pacienteNombre: "Andrés Felipe Torres Morales",
      pacienteDoc: "CC 79841203",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez",
      especialidad: "Cardiología",
      fecha: "2026-11-10",
      horaInicio: "10:00",
      horaFin: "10:30",
      consultorio: "Box 03",
      motivo: "Control post-stent y electrocardiograma de esfuerzo.",
      tipoCita: "Presencial",
      estado: "Agendada",
      tiempoLlegada: null,
      tiempoEsperaMin: 0
    },
    {
      id: "CT-4094",
      pacienteId: "PAC-1017234988",
      pacienteNombre: "María Camila Orozco Jaramillo",
      pacienteDoc: "CC 1017234988",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez",
      especialidad: "Cardiología",
      fecha: "2026-11-10",
      horaInicio: "10:30",
      horaFin: "11:00",
      consultorio: "Box 03",
      motivo: "Valoración pre-operatoria cardiovascular.",
      tipoCita: "Presencial",
      estado: "Agendada",
      tiempoLlegada: null,
      tiempoEsperaMin: 0
    },
    {
      id: "CT-4090",
      pacienteId: "PAC-1098765432",
      pacienteNombre: "Sofía Gómez Morales",
      pacienteDoc: "TI 1098765432",
      medicoId: "MED-04",
      medicoNombre: "Dra. Elena Silva",
      especialidad: "Pediatría",
      fecha: "2026-11-10",
      horaInicio: "08:00",
      horaFin: "08:30",
      consultorio: "Box 02",
      motivo: "Control de crecimiento, desarrollo y refuerzo vacunas.",
      tipoCita: "Presencial",
      estado: "Atendida",
      tiempoLlegada: "07:50 AM",
      tiempoEsperaMin: 10
    }
  ],

  // HISTORIAL Y CONSULTAS ATENDIDAS (HU-09, HU-10)
  consultas: [
    {
      id: "EXP-2026-001",
      citaId: "CT-4090",
      pacienteId: "PAC-1098765432",
      medicoId: "MED-04",
      medicoNombre: "Dra. Elena Silva",
      fecha: "2026-11-10",
      hora: "08:25 AM",
      signosVitales: {
        presionArterial: "95/60",
        frecuenciaCardiaca: 88,
        temperatura: 36.6,
        saturacionOxigeno: 99,
        pesoKg: 26.5,
        tallaCm: 124
      },
      anamnesis: "Paciente acude en compañía de su madre a control programado de crecimiento. No refiere sintomatología respiratoria en las últimas 4 semanas.",
      exploracionFisica: "Normocéfala, orofaringe sin exudados, campos pulmonares bien ventilados sin sibilancias, ruidos cardiacos rítmicos sin soplos.",
      diagnosticoPrincipal: {
        codigo: "Z00.1",
        descripcion: "Control de salud de rutina del niño"
      },
      planTratamiento: "Continuar alimentación balanceada, actividad física escolar y esquema preventivo. Cita de control en 6 meses.",
      receta: [
        { medicamento: "Vitamina D3 Gotas", dosis: "400 UI", frecuencia: "Una vez al día", duracion: "3 meses" }
      ]
    },
    {
      id: "EXP-2025-089",
      citaId: "CT-3180",
      pacienteId: "PAC-1020029712",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez",
      fecha: "2026-08-15",
      hora: "09:15 AM",
      signosVitales: {
        presionArterial: "142/90",
        frecuenciaCardiaca: 76,
        temperatura: 36.8,
        saturacionOxigeno: 97,
        pesoKg: 82.0,
        tallaCm: 175
      },
      anamnesis: "Paciente masculino con antecedentes de HTA en tratamiento. Refiere cefaleas ocasionales en región occipital asociadas a estrés laboral.",
      exploracionFisica: "Fondo de ojo sin hemorragias activas. Apex no desplazado. Sin edemas en miembros inferiores.",
      diagnosticoPrincipal: {
        codigo: "I10",
        descripcion: "Hipertensión esencial (primaria)"
      },
      planTratamiento: "Ajuste de dosis antihipertensiva. Dieta hiposódica estricta y monitoreo domiciliario de PA (AMPA).",
      receta: [
        { medicamento: "Losartán Potásico", dosis: "50 mg", frecuencia: "Cada 12 horas", duracion: "30 días" },
        { medicamento: "Hidroclorotiazida", dosis: "12.5 mg", frecuencia: "En las mañanas", duracion: "30 días" }
      ]
    }
  ],

  // CATÁLOGO DE DIAGNÓSTICOS CIE-10 (Búsqueda rápida)
  catalogoCie10: [
    { codigo: "I10", descripcion: "Hipertensión esencial (primaria)" },
    { codigo: "I20.9", descripcion: "Angina de pecho, no especificada" },
    { codigo: "I47.1", descripcion: "Taquicardia supraventricular" },
    { codigo: "E11.9", descripcion: "Diabetes mellitus tipo 2 sin complicaciones" },
    { codigo: "J45.9", descripcion: "Asma, no especificada" },
    { codigo: "Z00.0", descripcion: "Examen médico general de adultos" },
    { codigo: "Z00.1", descripcion: "Control de salud de rutina del niño" },
    { codigo: "M54.5", descripcion: "Lumbago no especificado" },
    { codigo: "R51", descripcion: "Cefalea" }
  ]
};
