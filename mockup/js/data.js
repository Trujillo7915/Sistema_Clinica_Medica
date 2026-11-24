// ============================================================================
// CLINIGEST SGCM - ENGINE DE DATOS SEMILLA (Alineado 100% con Fase 1-4 y SQL)
// ============================================================================

window.CLINIC_MOCK_DATA = {
  // USUARIOS INSTITUCIONALES PARA LOGIN RBAC
  usuarios: [
    {
      username: "rgomez@clinigest.com",
      role: "medico",
      medicoId: "MED-01",
      nombre: "Dr. Roberto Gómez Valenzuela",
      cargo: "Especialista en Cardiología • Box 03",
      avatar: "RG"
    },
    {
      username: "agarzon@clinigest.com",
      role: "recepcionista",
      medicoId: null,
      nombre: "Alexandra Garzón",
      cargo: "Recepción Principal y Admisiones",
      avatar: "AG"
    },
    {
      username: "ftrujillo@clinigest.com",
      role: "admin",
      medicoId: null,
      nombre: "Fabián Trujillo",
      cargo: "Administrador General SGCM",
      avatar: "FT"
    }
  ],

  // PACIENTES (HU-01, HU-02, HU-03 | RF-01, RF-02, RF-03 | RN-01, RN-04)
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
      antecedentes: "Hipertensión Arterial Grado 2 (Dx 2021), Dislipidemia en control",
      grupoSanguineo: "O+",
      estado: "Activo",
      fechaCreacionHistoria: "2026-01-15",
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
      antecedentes: "Arritmia supraventricular paroxística en seguimiento por Holter",
      grupoSanguineo: "A+",
      estado: "Activo",
      fechaCreacionHistoria: "2026-02-10",
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
      antecedentes: "Enfermedad coronaria revascularizada con stent en 2022",
      grupoSanguineo: "B+",
      estado: "Activo",
      fechaCreacionHistoria: "2026-03-01",
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
      antecedentes: "Control post-quirúrgico septoplastia funcional",
      grupoSanguineo: "O-",
      estado: "Activo",
      fechaCreacionHistoria: "2026-04-12",
      fechaRegistro: "2026-04-12"
    },
    {
      id: "PAC-1098765432",
      tipoDoc: "TI",
      numeroDoc: "1098765432",
      nombres: "Sofía Isabela",
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
      antecedentes: "Asma infantil intermitente controlada",
      grupoSanguineo: "A+",
      estado: "Activo",
      fechaCreacionHistoria: "2026-05-20",
      fechaRegistro: "2026-05-20"
    }
  ],

  // MÉDICOS (HU-04, HU-05, HU-06 | RF-04, RF-05, RF-06 | RN-01, RN-04, RN-05, RN-08)
  medicos: [
    {
      id: "MED-01",
      numeroDoc: "79451820",
      nombres: "Roberto",
      apellidos: "Gómez Valenzuela",
      edad: 48,
      registroMedico: "RM-449102-BOG",
      especialidad: "Cardiología",
      email: "roberto.gomez@clinigest.com",
      telefono: "3148899001",
      consultorio: "Box 03",
      turno: "Mañana (07:00 - 13:00)",
      diasAtencion: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      activo: true,
      estado: "Activo"
    },
    {
      id: "MED-02",
      numeroDoc: "52884102",
      nombres: "Carla",
      apellidos: "Mendoza Ortiz",
      edad: 41,
      registroMedico: "RM-884102-BOG",
      especialidad: "Neurología",
      email: "carla.mendoza@clinigest.com",
      telefono: "3167788992",
      consultorio: "Box 05",
      turno: "Tarde (13:00 - 19:00)",
      diasAtencion: ["Lunes", "Miércoles", "Viernes"],
      activo: true,
      estado: "Activo"
    },
    {
      id: "MED-03",
      numeroDoc: "1018432109",
      nombres: "Santiago",
      apellidos: "Herrera Salazar",
      edad: 39,
      registroMedico: "RM-109234-BOG",
      especialidad: "Medicina General",
      email: "santiago.herrera@clinigest.com",
      telefono: "3103344556",
      consultorio: "Box 01",
      turno: "Jornada Completa",
      diasAtencion: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      activo: true,
      estado: "Activo"
    },
    {
      id: "MED-04",
      numeroDoc: "53109876",
      nombres: "Elena",
      apellidos: "Silva Restrepo",
      edad: 42,
      registroMedico: "RM-554210-BOG",
      especialidad: "Pediatría",
      email: "elena.silva@clinigest.com",
      telefono: "3129900112",
      consultorio: "Box 02",
      turno: "Mañana (08:00 - 14:00)",
      diasAtencion: ["Lunes", "Martes", "Jueves"],
      activo: true,
      estado: "Activo"
    },
    {
      id: "MED-05",
      numeroDoc: "80234901",
      nombres: "Andrés Felipe",
      apellidos: "Vargas Duarte",
      edad: 35,
      registroMedico: "RM-672319-BOG",
      especialidad: "Dermatología",
      email: "andres.vargas@clinigest.com",
      telefono: "3145678901",
      consultorio: "Box 04",
      turno: "Tarde (13:00 - 19:00)",
      diasAtencion: ["Martes", "Jueves", "Viernes"],
      activo: true,
      estado: "Activo"
    }
  ],

  // CITAS MÉDICAS (HU-07, HU-08 | RF-07, RF-08 | RN-02, RN-03, RN-06)
  citas: [
    {
      id: "CT-4091",
      pacienteId: "PAC-1020029712",
      pacienteNombre: "Carlos Alberto Mendoza Pérez",
      pacienteDoc: "CC 1020029712",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez Valenzuela",
      especialidad: "Cardiología",
      fecha: "2026-11-10",
      horaInicio: "08:30",
      horaFin: "09:00",
      consultorio: "Box 03",
      motivo: "Control de Hipertensión Arterial y ajuste de esquema con Losartán 50mg.",
      tipoCita: "Presencial",
      estado: "En Espera",
      estadoBd: "AGENDADA",
      tiempoLlegada: "08:15 AM",
      tiempoEsperaMin: 15
    },
    {
      id: "CT-4092",
      pacienteId: "PAC-52891044",
      pacienteNombre: "Laura Valentina Rivas Cárdenas",
      pacienteDoc: "CC 52891044",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez Valenzuela",
      especialidad: "Cardiología",
      fecha: "2026-11-10",
      horaInicio: "09:00",
      horaFin: "09:30",
      consultorio: "Box 03",
      motivo: "Evaluación de episodios de taquicardia y lectura de Holter 24 horas.",
      tipoCita: "Presencial",
      estado: "En Espera",
      estadoBd: "AGENDADA",
      tiempoLlegada: "08:40 AM",
      tiempoEsperaMin: 20
    },
    {
      id: "CT-4093",
      pacienteId: "PAC-79841203",
      pacienteNombre: "Andrés Felipe Torres Morales",
      pacienteDoc: "CC 79841203",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez Valenzuela",
      especialidad: "Cardiología",
      fecha: "2026-11-10",
      horaInicio: "10:00",
      horaFin: "10:30",
      consultorio: "Box 03",
      motivo: "Control post-stent coronario y electrocardiograma de reposo.",
      tipoCita: "Presencial",
      estado: "Agendada",
      estadoBd: "AGENDADA",
      tiempoLlegada: null,
      tiempoEsperaMin: 0
    },
    {
      id: "CT-4094",
      pacienteId: "PAC-1017234988",
      pacienteNombre: "María Camila Orozco Jaramillo",
      pacienteDoc: "CC 1017234988",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez Valenzuela",
      especialidad: "Cardiología",
      fecha: "2026-11-10",
      horaInicio: "10:30",
      horaFin: "11:00",
      consultorio: "Box 03",
      motivo: "Valoración pre-operatoria cardiovascular y riesgo quirúrgico.",
      tipoCita: "Presencial",
      estado: "Agendada",
      estadoBd: "AGENDADA",
      tiempoLlegada: null,
      tiempoEsperaMin: 0
    },
    {
      id: "CT-4095",
      pacienteId: "PAC-79841203",
      pacienteNombre: "Andrés Felipe Torres Morales",
      pacienteDoc: "CC 79841203",
      medicoId: "MED-03",
      medicoNombre: "Dr. Santiago Herrera Salazar",
      especialidad: "Medicina General",
      fecha: "2026-11-10",
      horaInicio: "11:00",
      horaFin: "11:30",
      consultorio: "Box 01",
      motivo: "Renovación de fórmula médica y chequeo metabólico general.",
      tipoCita: "Presencial",
      estado: "Agendada",
      estadoBd: "AGENDADA",
      tiempoLlegada: null,
      tiempoEsperaMin: 0
    },
    {
      id: "CT-4090",
      pacienteId: "PAC-1098765432",
      pacienteNombre: "Sofía Isabela Gómez Morales",
      pacienteDoc: "TI 1098765432",
      medicoId: "MED-04",
      medicoNombre: "Dra. Elena Silva Restrepo",
      especialidad: "Pediatría",
      fecha: "2026-11-10",
      horaInicio: "08:00",
      horaFin: "08:30",
      consultorio: "Box 02",
      motivo: "Control de crecimiento, desarrollo pediátrico y esquema de vacunación.",
      tipoCita: "Presencial",
      estado: "Atendida",
      estadoBd: "ATENDIDA",
      tiempoLlegada: "07:50 AM",
      tiempoEsperaMin: 10
    },
    {
      id: "CT-4088",
      pacienteId: "PAC-52891044",
      pacienteNombre: "Laura Valentina Rivas Cárdenas",
      pacienteDoc: "CC 52891044",
      medicoId: "MED-05",
      medicoNombre: "Dr. Andrés Felipe Vargas Duarte",
      especialidad: "Dermatología",
      fecha: "2026-11-09",
      horaInicio: "14:00",
      horaFin: "14:30",
      consultorio: "Box 04",
      motivo: "Revisión dermatológica preventiva.",
      tipoCita: "Presencial",
      estado: "Cancelada",
      estadoBd: "CANCELADA",
      motivoCancelacion: "Reprogramación solicitada por la paciente por viaje laboral.",
      tiempoLlegada: null,
      tiempoEsperaMin: 0
    }
  ],

  // HISTORIAL Y CONSULTAS ATENDIDAS (HU-09, HU-10 | RF-09, RF-10 | RN-06, RN-07)
  consultas: [
    {
      id: "EXP-2026-004",
      citaId: "CT-4090",
      pacienteId: "PAC-1098765432",
      medicoId: "MED-04",
      medicoNombre: "Dra. Elena Silva Restrepo",
      especialidad: "Pediatría",
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
      anamnesis: "Paciente acude en compañía de su madre a control programado de crecimiento y desarrollo. Sin crisis broncoespásticas en los últimos 3 meses.",
      exploracionFisica: "Normocéfala, orofaringe sin exudados, campos pulmonares bien ventilados sin sibilancias, ruidos cardiacos rítmicos sin soplos.",
      diagnosticoPrincipal: {
        codigo: "Z00.1",
        descripcion: "Control de salud de rutina del niño"
      },
      planTratamiento: "Continuar alimentación balanceada, actividad física escolar y esquema preventivo. Control pediátrico en 6 meses.",
      receta: [
        { medicamento: "Vitamina D3 Gotas Pediátricas", dosis: "400 UI", frecuencia: "Una vez al día", duracion: "90 días" }
      ]
    },
    {
      id: "EXP-2026-003",
      citaId: "CT-3912",
      pacienteId: "PAC-79841203",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez Valenzuela",
      especialidad: "Cardiología",
      fecha: "2026-10-18",
      hora: "10:15 AM",
      signosVitales: {
        presionArterial: "128/78",
        frecuenciaCardiaca: 70,
        temperatura: 36.5,
        saturacionOxigeno: 98,
        pesoKg: 77.0,
        tallaCm: 172
      },
      anamnesis: "Paciente masculino con antecedente de revascularización coronaria percutánea (stent). Asintomático para angina, buena capacidad funcional NYHA I.",
      exploracionFisica: "Ruidos cardiacos rítmicos, buen tono, sin presencia de tercer ruido ni ingurgitación yugular. Pulsos periféricos simétricos.",
      diagnosticoPrincipal: {
        codigo: "I25.1",
        descripcion: "Enfermedad aterosclerótica del corazón"
      },
      planTratamiento: "Mantener doble antiagregación según protocolo y estatina de alta intensidad. Se solicita ECG de control y perfil lipídico.",
      receta: [
        { medicamento: "Atorvastatina Cálcica", dosis: "40 mg", frecuencia: "Cada 24 horas (Noche)", duracion: "90 días" },
        { medicamento: "Ácido Acetilsalicílico", dosis: "100 mg", frecuencia: "Cada 24 horas (Almuerzo)", duracion: "90 días" }
      ]
    },
    {
      id: "EXP-2026-002",
      citaId: "CT-3504",
      pacienteId: "PAC-52891044",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez Valenzuela",
      especialidad: "Cardiología",
      fecha: "2026-09-22",
      hora: "09:20 AM",
      signosVitales: {
        presionArterial: "118/74",
        frecuenciaCardiaca: 92,
        temperatura: 36.7,
        saturacionOxigeno: 99,
        pesoKg: 61.0,
        tallaCm: 165
      },
      anamnesis: "Paciente refiere palpitaciones ocasionales de inicio súbito y corta duración asociadas a jornadas de alta carga laboral.",
      exploracionFisica: "Ritmo sinusal al momento del examen físico. Sin soplos valvulares ni signos de falla cardiaca.",
      diagnosticoPrincipal: {
        codigo: "I47.1",
        descripcion: "Taquicardia supraventricular"
      },
      planTratamiento: "Se ordena monitoreo electrocardiográfico ambulatorio Holter de 24 horas, TSH y electrolitos séricos. Evitar bebidas energizantes.",
      receta: [
        { medicamento: "Bisoprolol Fumarato", dosis: "2.5 mg", frecuencia: "Cada 24 horas (Mañana)", duracion: "30 días" }
      ]
    },
    {
      id: "EXP-2026-001",
      citaId: "CT-3180",
      pacienteId: "PAC-1020029712",
      medicoId: "MED-01",
      medicoNombre: "Dr. Roberto Gómez Valenzuela",
      especialidad: "Cardiología",
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
      anamnesis: "Paciente masculino con antecedente de HTA Grado 2 en tratamiento. Refiere cefalea occipital matutina ocasional.",
      exploracionFisica: "Fondo de ojo sin hemorragias activas. Ápex normoposicionado. Sin edemas en miembros inferiores.",
      diagnosticoPrincipal: {
        codigo: "I10",
        descripcion: "Hipertensión esencial (primaria)"
      },
      planTratamiento: "Ajuste de terapia antihipertensiva combinada. Dieta hiposódica estricta y monitoreo domiciliario de presión arterial (AMPA).",
      receta: [
        { medicamento: "Losartán Potásico", dosis: "50 mg", frecuencia: "Cada 12 horas", duracion: "90 días" },
        { medicamento: "Hidroclorotiazida", dosis: "12.5 mg", frecuencia: "En ayunas cada 24 horas", duracion: "90 días" }
      ]
    }
  ],

  // CATÁLOGO DE DIAGNÓSTICOS CIE-10
  catalogoCie10: [
    { codigo: "I10", descripcion: "Hipertensión esencial (primaria)" },
    { codigo: "I20.9", descripcion: "Angina de pecho, no especificada" },
    { codigo: "I25.1", descripcion: "Enfermedad aterosclerótica del corazón" },
    { codigo: "I47.1", descripcion: "Taquicardia supraventricular" },
    { codigo: "E11.9", descripcion: "Diabetes mellitus tipo 2 sin complicaciones" },
    { codigo: "J45.9", descripcion: "Asma, no especificada" },
    { codigo: "Z00.0", descripcion: "Examen médico general de adultos" },
    { codigo: "Z00.1", descripcion: "Control de salud de rutina del niño" },
    { codigo: "L20.9", descripcion: "Dermatitis atópica, no especificada" },
    { codigo: "M54.5", descripcion: "Lumbago no especificado" },
    { codigo: "R51", descripcion: "Cefalea" }
  ]
};
