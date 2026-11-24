// ============================================================================
// CLINIGEST SGCM - INTERACTIVE CONTROLLER & ROUTER (Fase 5 Mockup)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar estado de la interfaz
  window.currentRole = "medico"; // recepcionista, medico, admin
  window.currentView = "vista-inicio";
  window.activePatientId = "PAC-1020029712"; // Carlos Mendoza por defecto
  window.activeAppointmentToCancel = null;

  initNavigation();
  initClock();
  initRoleSwitcher();
  initDeviceSwitcher();
  initSearchOmnibar();
  initForms();
  renderAllViews();

  // Escuchar atajo global Ctrl + K
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openOmnibar();
    }
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
});

// --- ENRUTADOR DE VISTAS (SPA ROUTING) ---
function navigateTo(viewId, params = {}) {
  window.currentView = viewId;

  if (params.patientId) {
    window.activePatientId = params.patientId;
  }
  if (params.appointmentId) {
    window.activeAppointmentId = params.appointmentId;
  }

  // Ocultar todas las vistas
  document.querySelectorAll(".view-section").forEach(el => {
    el.classList.add("hidden");
  });

  // Mostrar vista seleccionada
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.remove("hidden");
    target.classList.add("animate-fade-in");
  } else {
    document.getElementById("vista-error-404").classList.remove("hidden");
  }

  // Actualizar Sidebar active state
  document.querySelectorAll("[data-nav-target]").forEach(link => {
    if (link.getAttribute("data-nav-target") === viewId) {
      link.classList.add("bg-[#016398]", "text-white", "shadow-md");
      link.classList.remove("text-slate-300", "hover:bg-white/5");
    } else {
      link.classList.remove("bg-[#016398]", "text-white", "shadow-md");
      link.classList.add("text-slate-300", "hover:bg-white/5");
    }
  });

  // Actualizar Breadcrumbs dinámicos
  updateBreadcrumbs(viewId);

  // Renderizar componentes específicos según la vista
  if (viewId === "vista-hu02-directorio-pacientes") renderPacientesTable();
  if (viewId === "vista-hu05-directorio-medicos") renderMedicosTable();
  if (viewId === "vista-hu08-agenda-citas") renderAgendaTable();
  if (viewId === "vista-dashboard-recepcion") renderDashboardRecepcion();
  if (viewId === "vista-dashboard-medico") renderDashboardMedico();
  if (viewId === "vista-hu10-expediente-clinico") renderExpedienteClinico(window.activePatientId);
  if (viewId === "vista-hu03-actualizar-paciente") populateEditarPacienteForm(window.activePatientId);
  if (viewId === "vista-consultas-disponibilidad") renderDisponibilidadMatrix();
  if (viewId === "vista-hu07-agendar-cita") populateAgendarCitaSelects();
  if (viewId === "vista-hu09-atencion-clinica") setupConsultaForm();
}

function updateBreadcrumbs(viewId) {
  const map = {
    "vista-inicio": ["Portal SGCM", "Panel de Bienvenida"],
    "vista-dashboard-recepcion": ["Recepción", "Sala de Espera y Admisión"],
    "vista-dashboard-medico": ["Estación Médica", "Box 03 (Cardiología)"],
    "vista-hu01-registro-paciente": ["Gestión Pacientes", "Formulario Registro (HU-01)"],
    "vista-hu02-directorio-pacientes": ["Gestión Pacientes", "Directorio General (HU-02)"],
    "vista-hu03-actualizar-paciente": ["Gestión Pacientes", "Actualización Ficha (HU-03)"],
    "vista-hu04-registro-medico": ["Administración", "Alta Facultativo (HU-04)"],
    "vista-hu05-directorio-medicos": ["Administración", "Cuerpo Médico (HU-05)"],
    "vista-hu07-agendar-cita": ["Agenda Médica", "Agendar Cita (HU-07)"],
    "vista-hu08-agenda-citas": ["Agenda Médica", "Agenda General de Citas (HU-08)"],
    "vista-hu09-atencion-clinica": ["Acto Clínico", "Registro Atención y Tratamiento (HU-09)"],
    "vista-hu10-expediente-clinico": ["Historia Clínica", "Expediente Integral (HU-10)"],
    "vista-consultas-disponibilidad": ["Consultas", "Matriz de Disponibilidad (RN-02)"],
    "vista-mensajes-feedback": ["Diseño UI/UX", "Catálogo de Feedback y Notificaciones"],
    "vista-error-404": ["Sistema", "Error 404 No Encontrado"]
  };

  const crumbs = map[viewId] || ["SGCM", "Módulo Clínico"];
  const container = document.getElementById("breadcrumb-container");
  if (container) {
    container.innerHTML = `
      <span class="text-slate-400 font-semibold">${crumbs[0]}</span>
      <span class="text-slate-300">/</span>
      <span class="text-slate-900 font-bold">${crumbs[1]}</span>
    `;
  }
}

// --- RELOJ Y FECHA EN TIEMPO REAL ---
function initClock() {
  function updateTime() {
    const now = new Date();
    const timeEl = document.getElementById("header-clock-time");
    const dateEl = document.getElementById("header-clock-date");
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " • Turno Activo";
    }
    if (dateEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('es-ES', options);
    }
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// --- CAMBIADOR DE ROLES (RBAC) ---
function initRoleSwitcher() {
  const select = document.getElementById("role-selector");
  if (!select) return;

  select.addEventListener("change", (e) => {
    setRole(e.target.value);
  });
}

function setRole(role) {
  window.currentRole = role;
  
  // Actualizar avatar y badge de rol en Sidebar
  const avatar = document.getElementById("user-avatar-text");
  const name = document.getElementById("user-name-text");
  const badge = document.getElementById("user-role-badge");

  if (role === "medico") {
    avatar.textContent = "RG";
    name.textContent = "Dr. Roberto Gómez";
    badge.textContent = "Cardiología - Box 03";
    showToast("info", "Perfil Cambiado", "Ahora estás interactuando con el rol de Médico Especialista.");
    navigateTo("vista-dashboard-medico");
  } else if (role === "recepcionista") {
    avatar.textContent = "AG";
    name.textContent = "Alexandra Garzón";
    badge.textContent = "Recepción Principal - Admisiones";
    showToast("info", "Perfil Cambiado", "Ahora estás interactuando con el rol de Recepción y Admisión.");
    navigateTo("vista-dashboard-recepcion");
  } else if (role === "admin") {
    avatar.textContent = "FT";
    name.textContent = "Fabián Trujillo";
    badge.textContent = "Administrador del Sistema";
    showToast("info", "Perfil Cambiado", "Acceso con privilegios de Administrador del SGCM.");
    navigateTo("vista-hu05-directorio-medicos");
  }
}

// --- DEVICE VIEWPORT SWITCHER (Desktop, Mobile, Fluid) ---
function initDeviceSwitcher() {
  const btnDesktop = document.getElementById("btn-view-desktop");
  const btnMobile = document.getElementById("btn-view-mobile");
  const btnFluid = document.getElementById("btn-view-fluid");
  const appContainer = document.getElementById("app-viewport-container");

  if (!btnDesktop || !appContainer) return;

  btnDesktop.addEventListener("click", () => {
    appContainer.className = "device-desktop-frame mx-auto transition-all duration-300";
    setActiveDeviceButton(btnDesktop);
    showToast("info", "Modo Desktop (1440x900)", "Visualizando viewport estándar para estaciones de trabajo médicas.");
  });

  btnMobile.addEventListener("click", () => {
    appContainer.className = "device-mobile-frame mx-auto transition-all duration-300";
    setActiveDeviceButton(btnMobile);
    showToast("info", "Modo Móvil (390x844)", "Visualizando en marco de smartphone (iPhone 14/15) para ronda médica.");
  });

  btnFluid.addEventListener("click", () => {
    appContainer.className = "w-full h-full min-h-screen transition-all duration-300";
    setActiveDeviceButton(btnFluid);
    showToast("info", "Modo Pantalla Completa", "Adaptación responsiva fluida al 100% de la ventana de tu navegador.");
  });
}

function setActiveDeviceButton(activeBtn) {
  ["btn-view-desktop", "btn-view-mobile", "btn-view-fluid"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("bg-[#016398]", "text-white");
      el.classList.add("bg-white", "text-slate-700");
    }
  });
  activeBtn.classList.remove("bg-white", "text-slate-700");
  activeBtn.classList.add("bg-[#016398]", "text-white");
}

// --- NOTIFICACIONES TOAST SEMÁNTICAS (Clinical Clarity) ---
function showToast(type = "info", title, message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const id = "toast-" + Date.now();
  toast.id = id;

  const config = {
    success: { border: "border-emerald-600", bg: "bg-emerald-50", text: "text-emerald-900", iconBg: "bg-emerald-100 text-emerald-700", icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` },
    warning: { border: "border-amber-500", bg: "bg-amber-50", text: "text-amber-900", iconBg: "bg-amber-100 text-amber-700", icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>` },
    danger: { border: "border-red-600", bg: "bg-red-50", text: "text-red-900", iconBg: "bg-red-100 text-red-700", icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>` },
    info: { border: "border-[#016398]", bg: "bg-sky-50", text: "text-sky-900", iconBg: "bg-sky-100 text-[#016398]", icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>` }
  }[type] || config.info;

  toast.className = `p-4 rounded-xl ${config.bg} border-l-4 ${config.border} shadow-xl flex items-start justify-between min-w-[340px] max-w-[420px] toast-enter pointer-events-auto`;
  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0">
        ${config.icon}
      </div>
      <div>
        <h4 class="font-heading font-bold text-xs ${config.text}">${title}</h4>
        <p class="text-xs text-slate-700 mt-0.5">${message}</p>
      </div>
    </div>
    <button onclick="removeToast('${id}')" class="text-slate-400 hover:text-slate-700 text-sm font-bold ml-3">&times;</button>
  `;

  container.appendChild(toast);

  if (type !== "danger") {
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }
}

function removeToast(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add("toast-leave");
    setTimeout(() => el.remove(), 250);
  }
}

// --- MODALES & OMNIBAR PREDICTIVO (Ctrl + K) ---
function initSearchOmnibar() {
  const input = document.getElementById("omnibar-input");
  if (!input) return;

  let debounceTimer;
  input.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      executeOmnibarSearch(e.target.value);
    }, 200);
  });
}

function openOmnibar() {
  const modal = document.getElementById("modal-omnibar");
  if (modal) {
    modal.classList.remove("hidden");
    const input = document.getElementById("omnibar-input");
    if (input) {
      input.value = "";
      input.focus();
      executeOmnibarSearch("");
    }
  }
}

function closeOmnibar() {
  const modal = document.getElementById("modal-omnibar");
  if (modal) modal.classList.add("hidden");
}

function closeAllModals() {
  closeOmnibar();
  closeModalCancelacion();
}

function executeOmnibarSearch(term) {
  const container = document.getElementById("omnibar-results");
  if (!container) return;

  if (!term || term.trim() === "") {
    container.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-400">
        Escribe una cédula, nombre de paciente, médico o código de cita...
      </div>
    `;
    return;
  }

  const results = window.clinicStore.buscarGlobal(term);
  const total = results.pacientes.length + results.medicos.length + results.citas.length;

  if (total === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-500">
        No se encontraron coincidencias para "<strong>${escapeHtml(term)}</strong>".
      </div>
    `;
    return;
  }

  let html = "";

  // Pacientes
  if (results.pacientes.length > 0) {
    html += `<div class="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pacientes (${results.pacientes.length})</div>`;
    results.pacientes.forEach(p => {
      html += `
        <div onclick="navigateTo('vista-hu10-expediente-clinico', { patientId: '${p.id}' }); closeOmnibar();" class="p-2.5 rounded-xl hover:bg-teal-50 border border-transparent hover:border-teal-200 transition cursor-pointer flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#016398] text-white flex items-center justify-center font-bold text-xs">
              ${p.nombres[0]}${p.apellidos[0]}
            </div>
            <div>
              <span class="text-xs font-bold text-slate-900">${p.nombres} ${p.apellidos}</span>
              <span class="text-[10px] text-slate-500 block">CC ${p.numeroDoc} &bull; EPS: ${p.eps}</span>
            </div>
          </div>
          <span class="text-xs font-semibold text-[#016398]">Expediente &rarr;</span>
        </div>
      `;
    });
  }

  // Médicos
  if (results.medicos.length > 0) {
    html += `<div class="px-3 py-1 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Médicos (${results.medicos.length})</div>`;
    results.medicos.forEach(m => {
      html += `
        <div onclick="navigateTo('vista-consultas-disponibilidad'); closeOmnibar();" class="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent transition cursor-pointer flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              ${m.nombres[0]}${m.apellidos[0]}
            </div>
            <div>
              <span class="text-xs font-bold text-slate-900">Dr(a). ${m.nombres} ${m.apellidos}</span>
              <span class="text-[10px] text-slate-500 block">${m.especialidad} &bull; ${m.consultorio}</span>
            </div>
          </div>
          <span class="text-xs text-purple-700 font-semibold">Disponibilidad</span>
        </div>
      `;
    });
  }

  // Citas
  if (results.citas.length > 0) {
    html += `<div class="px-3 py-1 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Citas Médicas (${results.citas.length})</div>`;
    results.citas.forEach(c => {
      html += `
        <div onclick="navigateTo('vista-hu08-agenda-citas'); closeOmnibar();" class="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent transition cursor-pointer flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-900">${c.id} - ${c.pacienteNombre}</span>
            <span class="text-[10px] text-slate-500 block">${c.fecha} &bull; ${c.horaInicio} con ${c.medicoNombre} (${c.estado})</span>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">${c.estado}</span>
        </div>
      `;
    });
  }

  container.innerHTML = html;
}

// --- MODAL CANCELACIÓN DE CITA (RN-03) ---
function openModalCancelacion(citaId) {
  window.activeAppointmentToCancel = citaId;
  const cita = window.clinicStore.getCitas().find(c => c.id === citaId);
  if (!cita) return;

  const modal = document.getElementById("modal-cancelacion-cita");
  if (modal) {
    document.getElementById("cancelar-cita-id").textContent = cita.id;
    document.getElementById("cancelar-paciente-nombre").textContent = cita.pacienteNombre;
    document.getElementById("cancelar-medico-nombre").textContent = `${cita.medicoNombre} (${cita.consultorio})`;
    document.getElementById("cancelar-fecha-hora").textContent = `${cita.fecha} a las ${cita.horaInicio}`;
    document.getElementById("cancelar-motivo-input").value = "";
    modal.classList.remove("hidden");
  }
}

function closeModalCancelacion() {
  const modal = document.getElementById("modal-cancelacion-cita");
  if (modal) modal.classList.add("hidden");
  window.activeAppointmentToCancel = null;
}

function confirmarCancelacionCita() {
  const motivo = document.getElementById("cancelar-motivo-input").value;
  try {
    window.clinicStore.cancelarCita(window.activeAppointmentToCancel, motivo);
    showToast("success", "Cita Cancelada", "El cupo ha sido liberado inmediatamente en la agenda (RN-03).");
    closeModalCancelacion();
    renderAgendaTable();
    renderDashboardRecepcion();
    renderDashboardMedico();
  } catch (err) {
    showToast("danger", "Validación Obligatoria", err.message);
  }
}

// --- RENDERIZADORES DE TABLAS Y VISTAS ---

// HU-02: Directorio de Pacientes
function renderPacientesTable() {
  const tbody = document.getElementById("pacientes-table-body");
  if (!tbody) return;

  const searchInput = document.getElementById("pacientes-search-input");
  const filter = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const pacientes = window.clinicStore.getPacientes().filter(p => 
    !filter ||
    p.numeroDoc.includes(filter) ||
    p.nombres.toLowerCase().includes(filter) ||
    p.apellidos.toLowerCase().includes(filter) ||
    p.eps.toLowerCase().includes(filter)
  );

  if (pacientes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-slate-400">
          No se encontraron pacientes que coincidan con la búsqueda.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pacientes.map(p => `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
      <td class="p-3 font-mono font-bold text-slate-800">${p.id}</td>
      <td class="p-3">
        <div class="font-bold text-slate-900">${p.nombres} ${p.apellidos}</div>
        <div class="text-[11px] text-slate-400">${p.email} • Tel: ${p.telefono}</div>
      </td>
      <td class="p-3 text-slate-600">${p.tipoDoc} ${p.numeroDoc}</td>
      <td class="p-3">
        <span class="inline-block px-2 py-0.5 bg-sky-50 text-sky-800 rounded text-xs font-semibold border border-sky-100">
          ${p.eps}
        </span>
      </td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.estado === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
          ${p.estado}
        </span>
      </td>
      <td class="p-3 text-right space-x-1">
        <button onclick="navigateTo('vista-hu10-expediente-clinico', { patientId: '${p.id}' })" class="px-2.5 py-1 text-xs font-bold text-[#016398] hover:bg-sky-50 rounded transition">
          Expediente (HU-10)
        </button>
        <button onclick="navigateTo('vista-hu03-actualizar-paciente', { patientId: '${p.id}' })" class="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded transition">
          Editar (HU-03)
        </button>
      </td>
    </tr>
  `).join("");
}

// HU-05: Directorio Médico
function renderMedicosTable() {
  const tbody = document.getElementById("medicos-table-body");
  if (!tbody) return;

  const medicos = window.clinicStore.getMedicos();
  tbody.innerHTML = medicos.map(m => `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
      <td class="p-3 font-bold text-slate-900 font-mono">${m.id}</td>
      <td class="p-3 font-bold text-slate-800">Dr(a). ${m.nombres} ${m.apellidos}</td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          ${m.especialidad}
        </span>
      </td>
      <td class="p-3 text-slate-600 font-mono text-xs">${m.registroMedico}</td>
      <td class="p-3 font-semibold text-teal-800">${m.consultorio}</td>
      <td class="p-3 text-xs text-slate-500">${m.turno}</td>
      <td class="p-3 text-right">
        <button onclick="navigateTo('vista-consultas-disponibilidad')" class="px-3 py-1 bg-[#016398] hover:bg-[#002C3A] text-white text-xs font-semibold rounded-md shadow-xs">
          Ver Turnos (RN-02)
        </button>
      </td>
    </tr>
  `).join("");
}

// HU-08: Agenda General de Citas
function renderAgendaTable(statusFilter = "TODAS") {
  const tbody = document.getElementById("agenda-table-body");
  if (!tbody) return;

  let citas = window.clinicStore.getCitas();
  if (statusFilter !== "TODAS") {
    citas = citas.filter(c => c.estado.toUpperCase() === statusFilter.toUpperCase());
  }

  tbody.innerHTML = citas.map(c => `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
      <td class="p-3 font-mono font-bold text-slate-800">${c.id}</td>
      <td class="p-3 font-bold text-slate-900">${c.horaInicio} - ${c.horaFin}</td>
      <td class="p-3">
        <div class="font-bold text-slate-900">${c.pacienteNombre}</div>
        <div class="text-[10px] text-slate-400">${c.pacienteDoc}</div>
      </td>
      <td class="p-3">
        <div class="font-semibold text-slate-800">${c.medicoNombre}</div>
        <div class="text-[10px] text-[#016398]">${c.especialidad} &bull; ${c.consultorio}</div>
      </td>
      <td class="p-3">
        ${getStatusBadge(c.estado)}
      </td>
      <td class="p-3 text-right space-x-1">
        ${c.estado === 'En Espera' ? `
          <button onclick="llamarPacienteDesdeAgenda('${c.id}')" class="px-2.5 py-1 text-xs font-bold bg-teal-500 text-[#002C3A] rounded shadow-xs">
            Llamar a Box
          </button>
        ` : ''}
        ${c.estado !== 'Cancelada' && c.estado !== 'Atendida' ? `
          <button onclick="openModalCancelacion('${c.id}')" class="px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded">
            Cancelar (RN-03)
          </button>
        ` : ''}
      </td>
    </tr>
  `).join("");
}

function getStatusBadge(estado) {
  const styles = {
    "Agendada": "bg-sky-100 text-sky-800",
    "En Espera": "bg-amber-100 text-amber-900 border border-amber-300 font-bold",
    "En Consulta": "bg-teal-100 text-teal-900 font-bold animate-pulse",
    "Atendida": "bg-emerald-100 text-emerald-800",
    "Cancelada": "bg-red-100 text-red-800 line-through"
  };
  return `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${styles[estado] || 'bg-slate-100 text-slate-600'}">${estado}</span>`;
}

function llamarPacienteDesdeAgenda(citaId) {
  window.clinicStore.llamarAConsulta(citaId);
  showToast("success", "Paciente Llamado", "El paciente ha sido convocado al consultorio correspondiente.");
  renderAgendaTable();
  navigateTo("vista-hu09-atencion-clinica", { appointmentId: citaId });
}

// Dashboard Recepción
function renderDashboardRecepcion() {
  const container = document.getElementById("recepcion-espera-list");
  if (!container) return;

  const citasHoy = window.clinicStore.getCitas();
  const enEspera = citasHoy.filter(c => c.estado === "En Espera");
  const agendadas = citasHoy.filter(c => c.estado === "Agendada");

  document.getElementById("kpi-recepcion-espera").textContent = enEspera.length;
  document.getElementById("kpi-recepcion-total").textContent = citasHoy.length;

  container.innerHTML = enEspera.map(c => `
    <div class="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
      <div>
        <span class="text-xs font-bold text-slate-900">${c.pacienteNombre}</span>
        <p class="text-[10px] text-slate-500">${c.especialidad} &bull; ${c.medicoNombre} (${c.consultorio})</p>
        <span class="text-[10px] text-amber-800 font-semibold">Llegada: ${c.tiempoLlegada || '08:15 AM'} (Espera: ${c.tiempoEsperaMin} min)</span>
      </div>
      <button onclick="navigateTo('vista-hu08-agenda-citas')" class="px-2.5 py-1 text-xs font-bold bg-[#016398] text-white rounded">
        Gestionar
      </button>
    </div>
  `).join("") || `<p class="p-4 text-center text-xs text-slate-400">No hay pacientes esperando en sala.</p>`;

  // Próximas por llegar
  const proximasEl = document.getElementById("recepcion-proximas-list");
  if (proximasEl) {
    proximasEl.innerHTML = agendadas.slice(0, 3).map(c => `
      <div class="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-900">${c.pacienteNombre}</span>
          <p class="text-[10px] text-slate-500">Hora: ${c.horaInicio} &bull; ${c.medicoNombre}</p>
        </div>
        <button onclick="hacerCheckIn('${c.id}')" class="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-xs">
          Hacer Check-In
        </button>
      </div>
    `).join("");
  }
}

function hacerCheckIn(citaId) {
  window.clinicStore.marcarCheckInLlegada(citaId);
  showToast("success", "Check-in Exitoso", "Paciente ingresado a la sala de espera activa.");
  renderDashboardRecepcion();
}

// Dashboard Médico (Box 03)
function renderDashboardMedico() {
  const container = document.getElementById("medico-espera-list");
  if (!container) return;

  const citas = window.clinicStore.getCitas().filter(c => c.medicoId === "MED-01" && c.estado === "En Espera");
  document.getElementById("kpi-medico-espera").textContent = citas.length;

  container.innerHTML = citas.map(c => `
    <div class="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-xs text-slate-900">${c.pacienteNombre}</span>
          <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900">En Sala</span>
        </div>
        <p class="text-[11px] text-slate-600 mt-0.5">Motivo: ${c.motivo}</p>
      </div>
      <button onclick="llamarPacienteBox('${c.id}', '${c.pacienteId}')" class="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-[#002C3A] font-extrabold text-xs rounded-lg shadow-sm">
        Llamar a Box
      </button>
    </div>
  `).join("") || `<p class="p-4 text-center text-xs text-slate-400">Todos los pacientes han sido atendidos en este box.</p>`;
}

function llamarPacienteBox(citaId, pacienteId) {
  window.clinicStore.llamarAConsulta(citaId);
  window.activePatientId = pacienteId;
  window.activeAppointmentId = citaId;
  showToast("success", "Paciente Llamado", "Iniciando consulta médica en Box 03 (HU-09).");
  navigateTo("vista-hu09-atencion-clinica", { patientId: pacienteId, appointmentId: citaId });
}

// HU-10: Expediente Clínico Completo con Timeline
function renderExpedienteClinico(pacienteId) {
  const paciente = window.clinicStore.getPacienteById(pacienteId) || window.clinicStore.getPacientes()[0];
  if (!paciente) return;

  document.getElementById("expediente-paciente-nombre").textContent = `${paciente.nombres} ${paciente.apellidos}`;
  document.getElementById("expediente-paciente-id").textContent = paciente.id;
  document.getElementById("expediente-paciente-doc").textContent = `${paciente.tipoDoc} ${paciente.numeroDoc}`;
  document.getElementById("expediente-paciente-edad").textContent = `${paciente.edad} años`;
  document.getElementById("expediente-paciente-eps").textContent = paciente.eps;
  document.getElementById("expediente-alergias-texto").textContent = paciente.alergias;

  // Timeline
  const timeline = document.getElementById("expediente-timeline");
  if (!timeline) return;

  const consultas = window.clinicStore.getConsultasByPacienteId(paciente.id);
  if (consultas.length === 0) {
    timeline.innerHTML = `<p class="p-6 text-center text-xs text-slate-400">No hay registros clínicos previos para este paciente.</p>`;
    return;
  }

  timeline.innerHTML = consultas.map(c => `
    <div class="relative pl-6 pb-6 border-l-2 border-teal-600 last:border-transparent">
      <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-900">${c.fecha} &bull; ${c.hora}</span>
          <span class="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            ${c.medicoNombre}
          </span>
        </div>
        <div class="text-xs text-slate-700 space-y-1">
          <p><strong>Diagnóstico:</strong> ${c.diagnosticoPrincipal.codigo} - ${c.diagnosticoPrincipal.descripcion}</p>
          <p><strong>Signos Vitales:</strong> PA ${c.signosVitales.presionArterial} mmHg | FC ${c.signosVitales.frecuenciaCardiaca} lpm | Temp ${c.signosVitales.temperatura} °C</p>
          <p class="text-slate-600"><strong>Evolución:</strong> ${c.anamnesis}</p>
        </div>
        ${c.receta && c.receta.length > 0 ? `
          <div class="mt-3 pt-2 border-t border-slate-100">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prescripción:</span>
            <ul class="text-xs text-slate-600 list-disc list-inside mt-0.5">
              ${c.receta.map(r => `<li>${r.medicamento} (${r.dosis}) - ${r.frecuencia} por ${r.duracion}</li>`).join("")}
            </ul>
          </div>
        ` : ''}
      </div>
    </div>
  `).join("");
}

// HU-03: Precargar Formulario Actualizar Paciente
function populateEditarPacienteForm(pacienteId) {
  const p = window.clinicStore.getPacienteById(pacienteId) || window.clinicStore.getPacientes()[0];
  if (!p) return;

  document.getElementById("edit-paciente-id").value = p.id;
  document.getElementById("edit-paciente-doc").value = p.numeroDoc;
  document.getElementById("edit-paciente-nombres").value = p.nombres;
  document.getElementById("edit-paciente-apellidos").value = p.apellidos;
  document.getElementById("edit-paciente-telefono").value = p.telefono;
  document.getElementById("edit-paciente-email").value = p.email;
  document.getElementById("edit-paciente-direccion").value = p.direccion;
  document.getElementById("edit-paciente-eps").value = p.eps;
  document.getElementById("edit-paciente-alergias").value = p.alergias;
}

// HU-07: Poblar Selects de Agendamiento
function populateAgendarCitaSelects() {
  const selPaciente = document.getElementById("agendar-paciente-select");
  const selMedico = document.getElementById("agendar-medico-select");
  if (!selPaciente || !selMedico) return;

  selPaciente.innerHTML = window.clinicStore.getPacientes().map(p => `
    <option value="${p.id}">${p.nombres} ${p.apellidos} (${p.tipoDoc} ${p.numeroDoc})</option>
  `).join("");

  selMedico.innerHTML = window.clinicStore.getMedicos().map(m => `
    <option value="${m.id}">${m.nombres} ${m.apellidos} - ${m.especialidad} (${m.consultorio})</option>
  `).join("");
}

// Matriz de Disponibilidad (RN-02)
function renderDisponibilidadMatrix() {
  const container = document.getElementById("disponibilidad-slots-grid");
  if (!container) return;

  const slots = [
    { hora: "08:00 - 08:30", libre: false, paciente: "Carlos Mendoza", doc: "CC 1020029712" },
    { hora: "08:30 - 09:00", libre: false, paciente: "Laura Rivas", doc: "CC 52891044" },
    { hora: "09:00 - 09:30", libre: true },
    { hora: "09:30 - 10:00", libre: true },
    { hora: "10:00 - 10:30", libre: false, paciente: "Andrés Torres", doc: "CC 79841203" },
    { hora: "10:30 - 11:00", libre: false, paciente: "María Orozco", doc: "CC 1017234988" },
    { hora: "11:00 - 11:30", libre: true },
    { hora: "11:30 - 12:00", libre: true }
  ];

  container.innerHTML = slots.map(s => {
    if (s.libre) {
      return `
        <div onclick="seleccionarSlotDisponible('${s.hora}')" class="p-3.5 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100 transition cursor-pointer flex flex-col justify-between group shadow-xs">
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-xs text-emerald-900">${s.hora}</span>
            <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-200 text-emerald-900">Libre</span>
          </div>
          <p class="text-[11px] text-emerald-700 font-semibold group-hover:underline">+ Clic para agendar</p>
        </div>
      `;
    } else {
      return `
        <div class="p-3.5 rounded-xl border border-sky-200 bg-sky-50/70 flex flex-col justify-between shadow-xs opacity-90">
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-xs text-sky-900">${s.hora}</span>
            <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-200 text-sky-900">Ocupado</span>
          </div>
          <p class="text-[11px] font-bold text-slate-800 truncate">${s.paciente}</p>
          <span class="text-[10px] text-slate-500">${s.doc}</span>
        </div>
      `;
    }
  }).join("");
}

function seleccionarSlotDisponible(hora) {
  showToast("info", "Franja Seleccionada", `Has seleccionado la franja ${hora} (RN-02). Redirigiendo a formulario...`);
  navigateTo("vista-hu07-agendar-cita");
}

// Configurar Formulario HU-09
function setupConsultaForm() {
  const p = window.clinicStore.getPacienteById(window.activePatientId) || window.clinicStore.getPacientes()[0];
  if (!p) return;

  document.getElementById("consulta-paciente-nombre").textContent = `${p.nombres} ${p.apellidos}`;
  document.getElementById("consulta-paciente-info").textContent = `${p.tipoDoc} ${p.numeroDoc} • ${p.edad} años • EPS: ${p.eps}`;
  document.getElementById("consulta-alergias-banner").textContent = p.alergias;
}

// --- FORM SUBMISSIONS & VALIDATIONS ---
function initForms() {
  // HU-01: Registro Paciente
  const formHu01 = document.getElementById("form-hu01-registro-paciente");
  if (formHu01) {
    formHu01.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const data = {
          tipoDoc: formHu01.tipoDoc.value,
          numeroDoc: formHu01.numeroDoc.value.trim(),
          nombres: formHu01.nombres.value.trim(),
          apellidos: formHu01.apellidos.value.trim(),
          fechaNacimiento: formHu01.fechaNacimiento.value,
          sexo: formHu01.sexo.value,
          telefono: formHu01.telefono.value.trim(),
          email: formHu01.email.value.trim(),
          eps: formHu01.eps.value,
          direccion: formHu01.direccion.value.trim(),
          alergias: formHu01.alergias.value.trim() || "Ninguna conocida"
        };

        if (!data.numeroDoc || !data.nombres || !data.apellidos) {
          throw new Error("Por favor completa los campos obligatorios marcados con asterisco.");
        }

        const newP = window.clinicStore.addPaciente(data);
        showToast("success", "Paciente Registrado", `Paciente ${newP.id} dado de alta con éxito (HU-01).`);
        formHu01.reset();
        navigateTo("vista-hu02-directorio-pacientes");
      } catch (err) {
        showToast("danger", "Error de Validación", err.message);
      }
    });
  }

  // HU-03: Actualizar Paciente
  const formHu03 = document.getElementById("form-hu03-actualizar-paciente");
  if (formHu03) {
    formHu03.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const id = document.getElementById("edit-paciente-id").value;
        const updated = {
          telefono: document.getElementById("edit-paciente-telefono").value.trim(),
          email: document.getElementById("edit-paciente-email").value.trim(),
          direccion: document.getElementById("edit-paciente-direccion").value.trim(),
          eps: document.getElementById("edit-paciente-eps").value,
          alergias: document.getElementById("edit-paciente-alergias").value.trim()
        };

        window.clinicStore.updatePaciente(id, updated);
        showToast("success", "Datos Actualizados", `Ficha de ${id} actualizada con éxito (HU-03).`);
        navigateTo("vista-hu02-directorio-pacientes");
      } catch (err) {
        showToast("danger", "Error", err.message);
      }
    });
  }

  // HU-04: Registrar Médico
  const formHu04 = document.getElementById("form-hu04-registrar-medico");
  if (formHu04) {
    formHu04.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const data = {
          nombres: formHu04.nombres.value.trim(),
          apellidos: formHu04.apellidos.value.trim(),
          registroMedico: formHu04.registroMedico.value.trim(),
          especialidad: formHu04.especialidad.value,
          consultorio: formHu04.consultorio.value,
          turno: formHu04.turno.value,
          email: formHu04.email.value.trim(),
          telefono: formHu04.telefono.value.trim()
        };

        const newM = window.clinicStore.addMedico(data);
        showToast("success", "Médico Registrado", `Dr(a). ${newM.nombres} ${newM.apellidos} habilitado en sistema (HU-04).`);
        formHu04.reset();
        navigateTo("vista-hu05-directorio-medicos");
      } catch (err) {
        showToast("danger", "Conflicto", err.message);
      }
    });
  }

  // HU-07: Agendar Cita (RN-02)
  const formHu07 = document.getElementById("form-hu07-agendar-cita");
  if (formHu07) {
    formHu07.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const pacienteId = formHu07.pacienteId.value;
        const medicoId = formHu07.medicoId.value;
        const fecha = formHu07.fecha.value;
        const horaInicio = formHu07.horaInicio.value;
        const motivo = formHu07.motivo.value.trim();

        const pac = window.clinicStore.getPacienteById(pacienteId);
        const med = window.clinicStore.getMedicoById(medicoId);

        const data = {
          pacienteId,
          pacienteNombre: `${pac.nombres} ${pac.apellidos}`,
          pacienteDoc: `${pac.tipoDoc} ${pac.numeroDoc}`,
          medicoId,
          medicoNombre: `Dr(a). ${med.nombres} ${med.apellidos}`,
          especialidad: med.especialidad,
          consultorio: med.consultorio,
          fecha,
          horaInicio,
          horaFin: calcularHoraFin(horaInicio),
          motivo,
          tipoCita: "Presencial"
        };

        const newC = window.clinicStore.addCita(data);
        showToast("success", "Cita Agendada", `Cita ${newC.id} reservada con éxito sin colisiones (RN-02).`);
        navigateTo("vista-hu08-agenda-citas");
      } catch (err) {
        showToast("danger", "Colisión de Horario (RN-02)", err.message);
      }
    });
  }

  // HU-09: Finalizar Consulta Médica
  const formHu09 = document.getElementById("form-hu09-atencion-clinica");
  if (formHu09) {
    formHu09.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const consultaData = {
          pacienteId: window.activePatientId,
          citaId: window.activeAppointmentId,
          medicoId: "MED-01",
          medicoNombre: "Dr. Roberto Gómez",
          signosVitales: {
            presionArterial: formHu09.pa.value,
            frecuenciaCardiaca: formHu09.fc.value,
            temperatura: formHu09.temp.value,
            saturacionOxigeno: formHu09.sato2.value,
            pesoKg: formHu09.peso.value,
            tallaCm: formHu09.talla.value
          },
          anamnesis: formHu09.anamnesis.value,
          exploracionFisica: formHu09.exploracion.value,
          diagnosticoPrincipal: {
            codigo: formHu09.cie10Codigo.value,
            descripcion: formHu09.cie10Desc.value
          },
          planTratamiento: formHu09.tratamiento.value,
          receta: [
            { medicamento: formHu09.med1.value, dosis: formHu09.dosis1.value, frecuencia: formHu09.freq1.value, duracion: formHu09.dur1.value }
          ]
        };

        const newExp = window.clinicStore.addConsulta(consultaData);
        showToast("success", "Atención Guardada", `Consulta ${newExp.id} archivada en expediente (HU-09/HU-10).`);
        navigateTo("vista-hu10-expediente-clinico", { patientId: window.activePatientId });
      } catch (err) {
        showToast("danger", "Error al guardar", err.message);
      }
    });
  }
}

function calcularHoraFin(horaInicio) {
  const [h, m] = horaInicio.split(":").map(Number);
  const finMin = m + 30;
  if (finMin >= 60) {
    return `${String(h + 1).padStart(2, "0")}:${String(finMin - 60).padStart(2, "0")}`;
  }
  return `${String(h).padStart(2, "0")}:${String(finMin).padStart(2, "0")}`;
}

// Inicializar navegación y clicks en links
function initNavigation() {
  document.querySelectorAll("[data-nav-target]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const target = el.getAttribute("data-nav-target");
      navigateTo(target);
    });
  });
}

function renderAllViews() {
  renderPacientesTable();
  renderMedicosTable();
  renderAgendaTable();
  renderDashboardRecepcion();
  renderDashboardMedico();
  renderDisponibilidadMatrix();
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
