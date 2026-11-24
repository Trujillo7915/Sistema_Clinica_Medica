// ============================================================================
// CLINIGEST SGCM - CONTROLADOR PRINCIPAL & ENRUTADOR SPA (Fase 5 Producción)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  window.currentRole = "medico";
  window.currentView = "vista-inicio";
  window.activePatientId = "PAC-1020029712";
  window.activeAppointmentId = "CT-4091";
  window.activeAppointmentToCancel = null;
  window.activeMedicoToDelete = null;
  window.currentAgendaFilter = "TODAS";
  window.preselectedCitaDraft = null;

  initNavigation();
  initClock();
  initRoleSwitcher();
  initDeviceSwitcher();
  initSearchOmnibar();
  initForms();
  renderAllViews();

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

// --- NAVEGACIÓN SPA Y DRAWER MÓVIL ---
function toggleMobileDrawer(forceState) {
  const container = document.getElementById("app-viewport-container");
  const backdrop = document.getElementById("mobile-drawer-backdrop");
  if (!container || !backdrop) return;

  const isOpen =
    forceState !== undefined
      ? forceState
      : !container.classList.contains("mobile-drawer-open");

  if (isOpen) {
    container.classList.add("mobile-drawer-open");
    backdrop.classList.remove("hidden");
  } else {
    container.classList.remove("mobile-drawer-open");
    backdrop.classList.add("hidden");
  }
}

function navigateTo(viewId, params = {}) {
  window.currentView = viewId;
  toggleMobileDrawer(false);

  if (params.patientId) {
    window.activePatientId = params.patientId;
  }
  if (params.appointmentId) {
    window.activeAppointmentId = params.appointmentId;
  }
  if (params.preselectCita) {
    window.preselectedCitaDraft = params.preselectCita;
  }

  document.querySelectorAll(".view-section").forEach(el => {
    el.classList.add("hidden");
  });

  const target = document.getElementById(viewId);
  if (target) {
    target.classList.remove("hidden");
    target.classList.add("animate-fade-in");
  } else {
    document.getElementById("vista-error-404").classList.remove("hidden");
  }

  document.querySelectorAll("[data-nav-target]").forEach(link => {
    if (link.getAttribute("data-nav-target") === viewId) {
      link.classList.add("bg-[#016398]", "text-white", "shadow-sm");
      link.classList.remove("text-slate-300", "hover:bg-white/5");
    } else {
      link.classList.remove("bg-[#016398]", "text-white", "shadow-sm");
      link.classList.add("text-slate-300", "hover:bg-white/5");
    }
  });

  updateBreadcrumbs(viewId);

  if (viewId === "vista-inicio") renderHomePortal();
  if (viewId === "vista-hu02-directorio-pacientes") renderPacientesTable();
  if (viewId === "vista-hu05-directorio-medicos") renderMedicosTable();
  if (viewId === "vista-hu08-agenda-citas") renderAgendaTable(window.currentAgendaFilter);
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
    "vista-inicio": ["Centro de Mando", "Resumen General"],
    "vista-dashboard-recepcion": ["Centro de Mando", "Sala de Espera y Check-In"],
    "vista-dashboard-medico": ["Centro de Mando", "Estación Médica Asistencial"],
    "vista-hu01-registro-paciente": ["Pacientes", "Admisión de Paciente (HU-01)"],
    "vista-hu02-directorio-pacientes": ["Pacientes", "Directorio Maestro (HU-02)"],
    "vista-hu03-actualizar-paciente": ["Pacientes", "Actualizar Ficha (HU-03)"],
    "vista-hu04-registro-medico": ["Cuerpo Médico", "Alta de Facultativo (HU-04)"],
    "vista-hu05-directorio-medicos": ["Cuerpo Médico", "Directorio y Baja (HU-05 / HU-06)"],
    "vista-hu07-agendar-cita": ["Agenda y Turnos", "Agendar Nueva Cita (HU-07)"],
    "vista-hu08-agenda-citas": ["Agenda y Turnos", "Agenda General de Citas (HU-08)"],
    "vista-hu09-atencion-clinica": ["Historia Clínica", "Atención de Consulta (HU-09)"],
    "vista-hu10-expediente-clinico": ["Historia Clínica", "Expediente Clínico (HU-10)"],
    "vista-consultas-disponibilidad": ["Agenda y Turnos", "Matriz de Disponibilidad (RN-02)"],
    "vista-mensajes-feedback": ["Sistema", "Centro de Notificaciones"],
    "vista-error-404": ["Sistema", "Error 404 No Encontrado"]
  };

  const crumbs = map[viewId] || ["CliniGest", "Módulo Clínico"];
  const container = document.getElementById("breadcrumb-container");
  if (container) {
    container.innerHTML = `
      <span class="text-slate-400 font-semibold">${crumbs[0]}</span>
      <span class="text-slate-300">/</span>
      <span class="text-slate-900 font-bold">${crumbs[1]}</span>
    `;
  }
}

// --- RELOJ EN TIEMPO REAL ---
function initClock() {
  function updateTime() {
    const now = new Date();
    const timeEl = document.getElementById("header-clock-time");
    const dateEl = document.getElementById("header-clock-date");
    if (timeEl) {
      timeEl.textContent =
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
        " • Turno Activo";
    }
    if (dateEl) {
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      dateEl.textContent = now.toLocaleDateString("es-CO", options);
    }
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// --- AUTENTICACIÓN INSTITUCIONAL Y RBAC ---
function initRoleSwitcher() {
  const select = document.getElementById("role-selector");
  if (select) {
    select.addEventListener("change", (e) => {
      setRole(e.target.value, true);
    });
  }

  const formLogin = document.getElementById("form-login-institucional");
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const role = document.getElementById("login-role-input").value;
      setRole(role, true);
      closeLoginOverlay();
    });
  }
}

function openLoginOverlay() {
  const modal = document.getElementById("modal-login-overlay");
  if (modal) modal.classList.remove("hidden");
}

function closeLoginOverlay() {
  const modal = document.getElementById("modal-login-overlay");
  if (modal) modal.classList.add("hidden");
}

function quickLoginAs(role) {
  const emailInput = document.getElementById("login-email-input");
  const roleInput = document.getElementById("login-role-input");
  if (role === "medico") {
    emailInput.value = "rgomez@clinigest.com";
    roleInput.value = "medico";
  } else if (role === "recepcionista") {
    emailInput.value = "agarzon@clinigest.com";
    roleInput.value = "recepcionista";
  } else {
    emailInput.value = "ftrujillo@clinigest.com";
    roleInput.value = "admin";
  }
  setRole(role, true);
  closeLoginOverlay();
}

function setRole(role, navigateDefault = false) {
  window.currentRole = role;

  const select = document.getElementById("role-selector");
  if (select && select.value !== role) select.value = role;

  const avatar = document.getElementById("user-avatar-text");
  const name = document.getElementById("user-name-text");
  const badge = document.getElementById("user-role-badge");
  const homeTitle = document.getElementById("home-welcome-title");
  const homePill = document.getElementById("home-role-pill");

  const profiles = {
    medico: {
      avatar: "RG",
      name: "Dr. Roberto Gómez",
      fullName: "Dr. Roberto Gómez Valenzuela",
      badge: "Cardiología • Box 03",
      pill: "Sesión Activa: Facultativo Especialista (Box 03)",
      defaultView: "vista-dashboard-medico"
    },
    recepcionista: {
      avatar: "AG",
      name: "Alexandra Garzón",
      fullName: "Alexandra Garzón Vargas",
      badge: "Recepción y Admisiones",
      pill: "Sesión Activa: Recepción Principal y Admisión",
      defaultView: "vista-dashboard-recepcion"
    },
    admin: {
      avatar: "FT",
      name: "Fabián Trujillo",
      fullName: "Fabián Ricardo Trujillo",
      badge: "Administrador General SGCM",
      pill: "Sesión Activa: Administración General del Sistema",
      defaultView: "vista-inicio"
    }
  };

  const p = profiles[role] || profiles.medico;
  if (avatar) avatar.textContent = p.avatar;
  if (name) name.textContent = p.name;
  if (badge) badge.textContent = p.badge;
  if (homeTitle) homeTitle.textContent = `Bienvenido(a), ${p.fullName}`;
  if (homePill) homePill.textContent = p.pill;

  // Resaltar visualmente permisos RBAC en menú lateral
  document.querySelectorAll("[data-nav-target]").forEach(link => {
    const allowed = (link.getAttribute("data-roles") || "").split(",");
    if (allowed.includes(role)) {
      link.classList.remove("opacity-50");
    } else {
      link.classList.add("opacity-50");
    }
  });

  if (navigateDefault) {
    showToast("info", "Sesión RBAC Actualizada", `Autenticado como ${p.fullName} (${p.badge}).`);
    navigateTo(p.defaultView);
  }
}

// --- SIMULADOR DE VIEWPORT (APP COMPLETA, 1440x900, MÓVIL 390px) ---
function initDeviceSwitcher() {
  const btnFluid = document.getElementById("btn-view-fluid");
  const btnDesktop = document.getElementById("btn-view-desktop");
  const btnMobile = document.getElementById("btn-view-mobile");
  const outer = document.getElementById("viewport-outer-wrapper");
  const appContainer = document.getElementById("app-viewport-container");

  if (!btnFluid || !appContainer || !outer) return;

  btnFluid.addEventListener("click", () => {
    outer.className = "flex-1 overflow-auto viewport-fluid-wrapper flex items-center justify-center";
    appContainer.className = "device-fluid-frame mx-auto transition-all duration-300 flex overflow-hidden bg-slate-50 relative";
    setActiveDeviceButton(btnFluid);
  });

  btnDesktop.addEventListener("click", () => {
    outer.className = "flex-1 overflow-auto viewport-framed-wrapper flex items-center justify-center";
    appContainer.className = "device-desktop-frame mx-auto transition-all duration-300 flex overflow-hidden bg-slate-50 relative";
    setActiveDeviceButton(btnDesktop);
    showToast("info", "Estación Desktop (1440×900)", "Marco de resolución fija para estaciones clínicas de escritorio.");
  });

  btnMobile.addEventListener("click", () => {
    outer.className = "flex-1 overflow-auto viewport-framed-wrapper flex items-center justify-center";
    appContainer.className = "device-mobile-frame mx-auto transition-all duration-300 flex overflow-hidden bg-slate-50 relative";
    setActiveDeviceButton(btnMobile);
    showToast("info", "Dispositivo Móvil (390×844)", "Navegación adaptativa con Drawer deslizable y barra inferior.");
  });
}

function setActiveDeviceButton(activeBtn) {
  ["btn-view-fluid", "btn-view-desktop", "btn-view-mobile"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("bg-[#016398]", "text-white");
      el.classList.add("bg-transparent", "text-slate-300");
    }
  });
  activeBtn.classList.remove("bg-transparent", "text-slate-300");
  activeBtn.classList.add("bg-[#016398]", "text-white");
}

// --- TOASTS SEMÁNTICOS ---
function showToast(type = "info", title, message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const id = "toast-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  toast.id = id;

  const config = {
    success: {
      border: "border-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-900",
      iconBg: "bg-emerald-100 text-emerald-700",
      icon: "✓"
    },
    warning: {
      border: "border-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-900",
      iconBg: "bg-amber-100 text-amber-800",
      icon: "⚠️"
    },
    danger: {
      border: "border-red-600",
      bg: "bg-red-50",
      text: "text-red-900",
      iconBg: "bg-red-100 text-red-700",
      icon: "✕"
    },
    info: {
      border: "border-[#016398]",
      bg: "bg-sky-50",
      text: "text-sky-950",
      iconBg: "bg-sky-100 text-[#016398]",
      icon: "ℹ"
    }
  }[type] || config.info;

  toast.className = `p-4 rounded-xl ${config.bg} border-l-4 ${config.border} shadow-xl flex items-start justify-between min-w-[320px] max-w-[420px] toast-enter pointer-events-auto border border-slate-200/80`;
  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-7 h-7 rounded-lg ${config.iconBg} flex items-center justify-center font-bold text-xs shrink-0">
        ${config.icon}
      </div>
      <div>
        <h4 class="font-heading font-bold text-xs ${config.text}">${escapeHtml(title)}</h4>
        <p class="text-xs text-slate-700 mt-0.5 leading-relaxed">${escapeHtml(message)}</p>
      </div>
    </div>
    <button onclick="removeToast('${id}')" class="text-slate-400 hover:text-slate-700 text-sm font-bold ml-3">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => removeToast(id), type === "danger" ? 6500 : 4200);
}

function removeToast(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add("toast-leave");
    setTimeout(() => el.remove(), 220);
  }
}

// --- BÚSQUEDA GLOBAL OMNIBAR (Ctrl + K) ---
function initSearchOmnibar() {
  const input = document.getElementById("omnibar-input");
  if (!input) return;

  input.addEventListener("input", (e) => {
    executeOmnibarSearch(e.target.value);
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
  closeModalBajaMedico();
  closeModalReceta();
  closeLoginOverlay();
}

function executeOmnibarSearch(term) {
  const container = document.getElementById("omnibar-results");
  if (!container) return;

  if (!term || term.trim() === "") {
    container.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-400">
        Escribe número de documento, nombre de paciente, especialidad, médico o código de cita...
      </div>
    `;
    return;
  }

  const results = window.clinicStore.buscarGlobal(term);
  const total = results.pacientes.length + results.medicos.length + results.citas.length;

  if (total === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-500">
        No se encontraron registros para "<strong>${escapeHtml(term)}</strong>".
      </div>
    `;
    return;
  }

  let html = "";

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
              <span class="text-xs font-bold text-slate-900">${escapeHtml(p.nombres)} ${escapeHtml(p.apellidos)}</span>
              <span class="text-[10px] text-slate-500 block">${p.tipoDoc} ${p.numeroDoc} &bull; ${p.edad} años &bull; ${p.eps}</span>
            </div>
          </div>
          <span class="text-xs font-bold text-[#016398]">Abrir Expediente (HU-10) &rarr;</span>
        </div>
      `;
    });
  }

  if (results.medicos.length > 0) {
    html += `<div class="px-3 py-1 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Facultativos (${results.medicos.length})</div>`;
    results.medicos.forEach(m => {
      html += `
        <div onclick="verDisponibilidadDeMedico('${m.id}'); closeOmnibar();" class="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent transition cursor-pointer flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              ${m.nombres[0]}${m.apellidos[0]}
            </div>
            <div>
              <span class="text-xs font-bold text-slate-900">Dr(a). ${escapeHtml(m.nombres)} ${escapeHtml(m.apellidos)}</span>
              <span class="text-[10px] text-slate-500 block">${m.especialidad} &bull; ${m.consultorio} &bull; ${m.registroMedico}</span>
            </div>
          </div>
          <span class="text-xs text-purple-700 font-bold">Ver Turnos (RN-02) &rarr;</span>
        </div>
      `;
    });
  }

  if (results.citas.length > 0) {
    html += `<div class="px-3 py-1 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Citas Médicas (${results.citas.length})</div>`;
    results.citas.forEach(c => {
      html += `
        <div onclick="navigateTo('vista-hu08-agenda-citas'); closeOmnibar();" class="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent transition cursor-pointer flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-900">${c.id} &bull; ${escapeHtml(c.pacienteNombre)}</span>
            <span class="text-[10px] text-slate-500 block">${c.fecha} ${c.horaInicio} con ${escapeHtml(c.medicoNombre)}</span>
          </div>
          ${getStatusBadge(c.estado)}
        </div>
      `;
    });
  }

  container.innerHTML = html;
}

// --- PORTAL DE INICIO 100% DINÁMICO ---
function renderHomePortal() {
  const citas = window.clinicStore.getCitas();
  const pacientes = window.clinicStore.getPacientes();
  const medicos = window.clinicStore.getMedicos();
  const consultas = window.clinicStore.getConsultas();

  const activas = citas.filter(c => c.estado !== "Cancelada" && c.estado !== "Atendida");
  const enEspera = citas.filter(c => c.estado === "En Espera" || c.estado === "En Consulta");

  const elCitas = document.getElementById("kpi-home-citas");
  const elEspera = document.getElementById("kpi-home-espera");
  const elAtendidas = document.getElementById("kpi-home-atendidas");
  const elMedicos = document.getElementById("kpi-home-medicos");
  const elPacSub = document.getElementById("kpi-home-pacientes-sub");
  const navBadge = document.getElementById("nav-badge-espera");

  if (elCitas) elCitas.textContent = activas.length;
  if (elEspera) elEspera.textContent = enEspera.length;
  if (elAtendidas) elAtendidas.textContent = consultas.length;
  if (elMedicos) elMedicos.textContent = medicos.length;
  if (elPacSub) elPacSub.textContent = `${pacientes.length} pacientes registrados`;
  if (navBadge) navBadge.textContent = enEspera.length;

  const listEl = document.getElementById("home-agenda-prioritaria");
  if (!listEl) return;

  if (activas.length === 0) {
    listEl.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
        No hay citas pendientes en cola. Puedes agendar una nueva cita en <strong>HU-07</strong>.
      </div>
    `;
    return;
  }

  listEl.innerHTML = activas.slice(0, 4).map(c => `
    <div class="p-3.5 rounded-xl ${c.estado === 'En Espera' ? 'bg-amber-50/70 border-amber-200' : 'bg-white border-slate-200'} border flex flex-wrap items-center justify-between gap-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-mono font-bold text-xs text-[#016398]">${c.id}</span>
          <span class="text-xs font-bold text-slate-900">${c.horaInicio} &bull; ${escapeHtml(c.pacienteNombre)}</span>
          ${getStatusBadge(c.estado)}
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5">${c.pacienteDoc} &bull; ${escapeHtml(c.medicoNombre)} (${c.consultorio}) &bull; ${escapeHtml(c.motivo)}</p>
      </div>
      <div class="flex items-center gap-2">
        ${c.estado === 'Agendada' ? `
          <button onclick="hacerCheckIn('${c.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs">
            Check-In Sala
          </button>
        ` : `
          <button onclick="llamarPacienteBox('${c.id}', '${c.pacienteId}')" class="px-3 py-1.5 bg-[#016398] hover:bg-[#002C3A] text-white text-xs font-bold rounded-lg shadow-xs">
            Atender (HU-09)
          </button>
        `}
        <button onclick="navigateTo('vista-hu10-expediente-clinico', { patientId: '${c.pacienteId}' })" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
          Expediente
        </button>
      </div>
    </div>
  `).join("");
}

// --- HU-02: DIRECTORIO DE PACIENTES ---
function renderPacientesTable() {
  const tbody = document.getElementById("pacientes-table-body");
  if (!tbody) return;

  const searchInput = document.getElementById("pacientes-search-input");
  const filter = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const todos = window.clinicStore.getPacientes();
  const countLabel = document.getElementById("pacientes-count-label");

  if (todos.length === 0) {
    if (countLabel) countLabel.textContent = "0 pacientes";
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-500 font-semibold">
          No hay registros de pacientes disponibles (RF-02.2).
        </td>
      </tr>
    `;
    return;
  }

  const pacientes = todos.filter(
    p =>
      !filter ||
      p.id.toLowerCase().includes(filter) ||
      p.numeroDoc.toLowerCase().includes(filter) ||
      `${p.nombres} ${p.apellidos}`.toLowerCase().includes(filter) ||
      p.telefono.includes(filter) ||
      p.eps.toLowerCase().includes(filter)
  );

  if (countLabel) countLabel.textContent = `Mostrando ${pacientes.length} de ${todos.length} pacientes registrados`;

  if (pacientes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          No se encontraron pacientes que coincidan con "${escapeHtml(filter)}".
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pacientes.map(p => {
    const tieneAlergia = p.alergias && p.alergias.toLowerCase() !== "ninguna conocida";
    return `
      <tr class="hover:bg-slate-50/90 transition">
        <td class="p-3.5">
          <div class="font-mono font-bold text-slate-900">${p.id}</div>
          <div class="text-[11px] text-slate-500">${p.tipoDoc} ${p.numeroDoc}</div>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-slate-900">${escapeHtml(p.nombres)} ${escapeHtml(p.apellidos)}</div>
          <div class="text-[11px] text-slate-500">Tel: ${escapeHtml(p.telefono)} &bull; ${escapeHtml(p.email || "")}</div>
        </td>
        <td class="p-3.5">
          <span class="font-bold text-slate-800">${p.edad} años</span>
          <span class="block text-[10px] font-bold text-[#016398]">Sexo: ${p.sexo} &bull; RH ${p.grupoSanguineo || "O+"}</span>
        </td>
        <td class="p-3.5 text-slate-600 max-w-[180px] truncate" title="${escapeHtml(p.direccion)}">
          ${escapeHtml(p.direccion)}
        </td>
        <td class="p-3.5">
          <span class="inline-block px-2.5 py-0.5 bg-sky-50 text-sky-900 rounded-md text-xs font-semibold border border-sky-200">
            ${escapeHtml(p.eps)}
          </span>
        </td>
        <td class="p-3.5">
          <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold ${tieneAlergia ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-emerald-50 text-emerald-800'}">
            ${escapeHtml(p.alergias)}
          </span>
        </td>
        <td class="p-3.5 text-right space-x-1 whitespace-nowrap">
          <button onclick="navigateTo('vista-hu10-expediente-clinico', { patientId: '${p.id}' })" class="px-2.5 py-1.5 text-xs font-bold bg-sky-50 text-[#016398] hover:bg-[#016398] hover:text-white rounded-lg transition">
            Expediente (HU-10)
          </button>
          <button onclick="navigateTo('vista-hu03-actualizar-paciente', { patientId: '${p.id}' })" class="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition">
            Editar (HU-03)
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// --- HU-05 & HU-06: DIRECTORIO MÉDICO Y CONTROL DE BAJA (RN-08) ---
function renderMedicosTable() {
  const tbody = document.getElementById("medicos-table-body");
  if (!tbody) return;

  const searchInput = document.getElementById("medicos-search-input");
  const espFilter = document.getElementById("medicos-especialidad-filter");
  const term = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const esp = espFilter ? espFilter.value : "TODAS";

  const todos = window.clinicStore.getMedicos();
  if (todos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-500 font-semibold">
          No hay médicos registrados (RF-05.2).
        </td>
      </tr>
    `;
    return;
  }

  const medicos = todos.filter(m => {
    const matchEsp = esp === "TODAS" || m.especialidad === esp;
    const matchTerm =
      !term ||
      m.id.toLowerCase().includes(term) ||
      `${m.nombres} ${m.apellidos}`.toLowerCase().includes(term) ||
      m.registroMedico.toLowerCase().includes(term);
    return matchEsp && matchTerm;
  });

  if (medicos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          No se encontraron facultativos para el filtro seleccionado.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = medicos.map(m => {
    const citasActivas = window.clinicStore.getCitasActivasByMedico(m.id);
    const bloqueadoRn08 = citasActivas.length > 0;
    return `
      <tr class="hover:bg-slate-50/90 transition">
        <td class="p-3.5">
          <div class="font-mono font-bold text-slate-900">${m.id}</div>
          <div class="text-[11px] font-mono text-slate-500">${m.registroMedico}</div>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-slate-900">Dr(a). ${escapeHtml(m.nombres)} ${escapeHtml(m.apellidos)}</div>
          <div class="text-[11px] text-slate-500">Tel: ${escapeHtml(m.telefono)} &bull; ${escapeHtml(m.email)}</div>
        </td>
        <td class="p-3.5 font-bold text-slate-800">${m.edad || 40} años</td>
        <td class="p-3.5">
          <span class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            ${escapeHtml(m.especialidad)}
          </span>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-teal-900">${escapeHtml(m.consultorio)}</div>
          <div class="text-[11px] text-slate-500">${escapeHtml(m.turno)}</div>
        </td>
        <td class="p-3.5">
          ${bloqueadoRn08 ? `
            <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
              ${citasActivas.length} cita(s) AGENDADA
            </span>
          ` : `
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              0 citas pendientes
            </span>
          `}
        </td>
        <td class="p-3.5 text-right space-x-1 whitespace-nowrap">
          <button onclick="verDisponibilidadDeMedico('${m.id}')" class="px-2.5 py-1.5 bg-[#016398] hover:bg-[#002C3A] text-white text-xs font-bold rounded-lg shadow-xs transition">
            Turnos (RN-02)
          </button>
          <button onclick="openModalBajaMedico('${m.id}')" class="px-2.5 py-1.5 ${bloqueadoRn08 ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100' : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'} text-xs font-bold rounded-lg transition">
            Dar de Baja (HU-06)
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function verDisponibilidadDeMedico(medicoId) {
  navigateTo("vista-consultas-disponibilidad");
  const select = document.getElementById("disp-medico-select");
  if (select) {
    select.value = medicoId;
    renderDisponibilidadMatrix();
  }
}

// --- MODAL HU-06 / RN-08: BAJA DE MÉDICO ---
function openModalBajaMedico(medicoId) {
  window.activeMedicoToDelete = medicoId;
  const medico = window.clinicStore.getMedicoById(medicoId);
  if (!medico) return;

  const citasActivas = window.clinicStore.getCitasActivasByMedico(medicoId);
  const infoBox = document.getElementById("baja-medico-info-box");
  const modal = document.getElementById("modal-baja-medico");
  const btnConfirm = document.getElementById("btn-confirmar-baja-medico");

  if (!modal || !infoBox) return;

  if (citasActivas.length > 0) {
    infoBox.innerHTML = `
      <div class="p-3 rounded-xl bg-red-50 border border-red-300 text-red-900 space-y-2">
        <p class="font-bold text-xs">⛔ Bloqueo Preventivo RN-08 (RF-06.2):</p>
        <p class="text-xs">El facultativo <strong>Dr(a). ${escapeHtml(medico.nombres)} ${escapeHtml(medico.apellidos)} (${medico.id})</strong> tiene <strong>${citasActivas.length} cita(s) futura(s) activa(s)</strong> en estado AGENDADA:</p>
        <ul class="list-disc list-inside text-[11px] font-semibold">
          ${citasActivas.map(c => `<li>${c.id}: ${escapeHtml(c.pacienteNombre)} (${c.fecha} a las ${c.horaInicio})</li>`).join("")}
        </ul>
        <p class="text-[11px]">De acuerdo con la regla RN-08, debe cancelar o reasignar estas citas en la Agenda General (HU-08) antes de dar de baja al médico.</p>
      </div>
    `;
    btnConfirm.textContent = "Probar Bloqueo RN-08";
  } else {
    infoBox.innerHTML = `
      <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1.5">
        <p class="font-bold text-xs">✓ Validación RN-08 Superada (RF-06.1):</p>
        <p class="text-xs">El facultativo <strong>Dr(a). ${escapeHtml(medico.nombres)} ${escapeHtml(medico.apellidos)} (${medico.id} - ${medico.especialidad})</strong> no tiene citas futuras comprometidas en estado AGENDADA.</p>
        <p class="text-[11px] text-slate-600">¿Deseas confirmar su baja definitiva del catálogo activo?</p>
      </div>
    `;
    btnConfirm.textContent = "Confirmar Baja Definitiva (HU-06)";
  }

  modal.classList.remove("hidden");
}

function closeModalBajaMedico() {
  const modal = document.getElementById("modal-baja-medico");
  if (modal) modal.classList.add("hidden");
  window.activeMedicoToDelete = null;
}

function confirmarBajaMedico() {
  if (!window.activeMedicoToDelete) return;
  try {
    const removed = window.clinicStore.eliminarMedico(window.activeMedicoToDelete);
    showToast(
      "success",
      "Baja Médica Completada (HU-06)",
      `Dr(a). ${removed.nombres} ${removed.apellidos} (${removed.id}) fue dado de baja cumpliendo RN-08.`
    );
    closeModalBajaMedico();
    renderAllViews();
  } catch (err) {
    showToast("danger", "Baja Bloqueada por RN-08", err.message);
  }
}

// --- HU-08: AGENDA GENERAL DE CITAS & MODAL CANCELACIÓN RN-03 ---
function renderAgendaTable(statusFilter = "TODAS") {
  window.currentAgendaFilter = statusFilter;
  const tbody = document.getElementById("agenda-table-body");
  if (!tbody) return;

  // Actualizar pestaña activa
  document.querySelectorAll("#agenda-filter-tabs [data-status-filter]").forEach(btn => {
    if (btn.getAttribute("data-status-filter") === statusFilter) {
      btn.className = "px-3.5 py-1.5 rounded-lg bg-[#016398] text-white font-bold transition shadow-xs";
    } else {
      btn.className = "px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition";
    }
  });

  let citas = window.clinicStore.getCitas();
  if (statusFilter !== "TODAS") {
    citas = citas.filter(c => c.estado.toUpperCase() === statusFilter.toUpperCase());
  }

  if (citas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          No hay citas registradas bajo el filtro <strong>${statusFilter}</strong>.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = citas.map(c => `
    <tr class="hover:bg-slate-50/90 transition">
      <td class="p-3.5 font-mono font-bold text-slate-900">${c.id}</td>
      <td class="p-3.5">
        <div class="font-bold text-slate-900">${c.fecha}</div>
        <div class="text-[11px] font-semibold text-[#016398]">${c.horaInicio} - ${c.horaFin}</div>
      </td>
      <td class="p-3.5">
        <div class="font-bold text-slate-900">${escapeHtml(c.pacienteNombre)}</div>
        <div class="text-[11px] text-slate-500">${c.pacienteDoc}</div>
      </td>
      <td class="p-3.5">
        <div class="font-semibold text-slate-800">${escapeHtml(c.medicoNombre)}</div>
        <div class="text-[11px] text-[#016398] font-medium">${escapeHtml(c.especialidad)} &bull; ${escapeHtml(c.consultorio)}</div>
      </td>
      <td class="p-3.5 max-w-[220px]">
        <div class="text-slate-700 truncate" title="${escapeHtml(c.motivo)}">${escapeHtml(c.motivo)}</div>
        ${c.motivoCancelacion ? `<div class="text-[10px] text-red-600 font-semibold mt-0.5">Cancelada: ${escapeHtml(c.motivoCancelacion)}</div>` : ""}
      </td>
      <td class="p-3.5">${getStatusBadge(c.estado)}</td>
      <td class="p-3.5 text-right space-x-1 whitespace-nowrap">
        ${c.estado === "Agendada" ? `
          <button onclick="hacerCheckIn('${c.id}')" class="px-2.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs">
            Check-In
          </button>
        ` : ""}
        ${c.estado === "En Espera" || c.estado === "En Consulta" ? `
          <button onclick="llamarPacienteDesdeAgenda('${c.id}', '${c.pacienteId}')" class="px-2.5 py-1.5 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-[#002C3A] rounded-lg shadow-xs">
            Atender (HU-09)
          </button>
        ` : ""}
        ${c.estado !== "Cancelada" && c.estado !== "Atendida" ? `
          <button onclick="openModalCancelacion('${c.id}')" class="px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg">
            Cancelar (RN-03)
          </button>
        ` : ""}
      </td>
    </tr>
  `).join("");
}

function getStatusBadge(estado) {
  const styles = {
    "Agendada": "bg-sky-100 text-sky-900 border border-sky-200",
    "En Espera": "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold",
    "En Consulta": "bg-teal-100 text-teal-900 border border-teal-300 font-extrabold",
    "Atendida": "bg-emerald-100 text-emerald-900 border border-emerald-200",
    "Cancelada": "bg-red-100 text-red-800 border border-red-200 line-through"
  };
  return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${styles[estado] || 'bg-slate-100 text-slate-600'}">${estado}</span>`;
}

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
    const cita = window.clinicStore.cancelarCita(window.activeAppointmentToCancel, motivo);
    showToast(
      "success",
      "Cita Cancelada (HU-08 / RN-03)",
      `La cita ${cita.id} pasó a CANCELADA y liberó el bloque de las ${cita.horaInicio} en ${cita.fecha}.`
    );
    closeModalCancelacion();
    renderAllViews();
  } catch (err) {
    showToast("danger", "Validación RN-03", err.message);
  }
}

function llamarPacienteDesdeAgenda(citaId, pacienteId) {
  window.clinicStore.llamarAConsulta(citaId);
  window.activeAppointmentId = citaId;
  window.activePatientId = pacienteId;
  showToast("success", "Acto Clínico Iniciado", `Abriendo formulario de consulta médica HU-09 para la cita ${citaId}.`);
  renderAllViews();
  navigateTo("vista-hu09-atencion-clinica", { appointmentId: citaId, patientId: pacienteId });
}

// --- DASHBOARD RECEPCIÓN Y CHECK-IN ---
function renderDashboardRecepcion() {
  const container = document.getElementById("recepcion-espera-list");
  if (!container) return;

  const citas = window.clinicStore.getCitas();
  const enEspera = citas.filter(c => c.estado === "En Espera" || c.estado === "En Consulta");
  const agendadas = citas.filter(c => c.estado === "Agendada");
  const atendidas = citas.filter(c => c.estado === "Atendida");

  document.getElementById("kpi-recepcion-espera").textContent = enEspera.length;
  document.getElementById("kpi-recepcion-total").textContent = citas.length;
  const elAtendidas = document.getElementById("kpi-recepcion-atendidas");
  if (elAtendidas) elAtendidas.textContent = atendidas.length;

  container.innerHTML =
    enEspera
      .map(
        c => `
      <div class="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-xs text-amber-900">${c.id}</span>
            <span class="text-xs font-bold text-slate-900">${escapeHtml(c.pacienteNombre)}</span>
          </div>
          <p class="text-[11px] text-slate-600 mt-0.5">${escapeHtml(c.especialidad)} &bull; ${escapeHtml(c.medicoNombre)} (${c.consultorio})</p>
          <span class="text-[10px] text-amber-800 font-bold">Check-In: ${c.tiempoLlegada || "08:15 AM"} &bull; Turno ${c.horaInicio}</span>
        </div>
        <button onclick="llamarPacienteBox('${c.id}', '${c.pacienteId}')" class="px-3 py-1.5 text-xs font-bold bg-[#016398] hover:bg-[#002C3A] text-white rounded-lg shadow-xs">
          Pasar a Box
        </button>
      </div>
    `
      )
      .join("") || `<p class="p-5 text-center text-xs text-slate-400">No hay pacientes esperando en sala actualmente.</p>`;

  const proximasEl = document.getElementById("recepcion-proximas-list");
  if (proximasEl) {
    proximasEl.innerHTML =
      agendadas
        .map(
          c => `
        <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-xs text-[#016398]">${c.id}</span>
              <span class="text-xs font-bold text-slate-900">${escapeHtml(c.pacienteNombre)}</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5">${c.fecha} a las ${c.horaInicio} &bull; ${escapeHtml(c.medicoNombre)}</p>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="hacerCheckIn('${c.id}')" class="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs">
              Registrar Check-In
            </button>
            <button onclick="openModalCancelacion('${c.id}')" class="px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg">
              Cancelar
            </button>
          </div>
        </div>
      `
        )
        .join("") || `<p class="p-5 text-center text-xs text-slate-400">Todas las citas agendadas ya ingresaron a sala.</p>`;
  }
}

function hacerCheckIn(citaId) {
  const c = window.clinicStore.marcarCheckInLlegada(citaId);
  if (c) {
    showToast("success", "Check-In Registrado", `${c.pacienteNombre} ingresó a sala de espera para ${c.consultorio}.`);
    renderAllViews();
  }
}

// --- DASHBOARD MÉDICO ---
function renderDashboardMedico() {
  const container = document.getElementById("medico-espera-list");
  const filterSelect = document.getElementById("medico-dashboard-filter");
  if (!container) return;

  const medicos = window.clinicStore.getMedicos();
  if (filterSelect && filterSelect.options.length === 0) {
    filterSelect.innerHTML =
      `<option value="TODOS">Todos los Consultorios</option>` +
      medicos.map(m => `<option value="${m.id}">${m.consultorio} — Dr(a). ${m.nombres} ${m.apellidos}</option>`).join("");
  }

  const selectedMed = filterSelect ? filterSelect.value : "TODOS";
  const citas = window.clinicStore.getCitas().filter(c => {
    const matchMed = selectedMed === "TODOS" || c.medicoId === selectedMed;
    const matchEstado = c.estado === "En Espera" || c.estado === "En Consulta" || c.estado === "Agendada";
    return matchMed && matchEstado;
  });

  document.getElementById("kpi-medico-espera").textContent = citas.length;

  container.innerHTML =
    citas
      .map(
        c => `
      <div class="p-4 rounded-xl border ${c.estado === 'En Espera' ? 'border-amber-300 bg-white' : 'border-slate-200 bg-white/80'} flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-xs text-[#016398]">${c.id}</span>
            <span class="font-bold text-sm text-slate-900">${escapeHtml(c.pacienteNombre)}</span>
            ${getStatusBadge(c.estado)}
          </div>
          <p class="text-xs text-slate-600 mt-1"><strong>Horario:</strong> ${c.fecha} ${c.horaInicio} &bull; <strong>Médico:</strong> ${escapeHtml(c.medicoNombre)} (${c.consultorio})</p>
          <p class="text-xs text-slate-500 mt-0.5"><strong>Motivo:</strong> ${escapeHtml(c.motivo)}</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="navigateTo('vista-hu10-expediente-clinico', { patientId: '${c.pacienteId}' })" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
            Ver Historial (HU-10)
          </button>
          <button onclick="llamarPacienteBox('${c.id}', '${c.pacienteId}')" class="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-[#002C3A] font-extrabold text-xs rounded-xl shadow-sm">
            Atender en Box (HU-09) &rarr;
          </button>
        </div>
      </div>
    `
      )
      .join("") || `<p class="p-6 text-center text-xs text-slate-500">No hay pacientes en cola para el consultorio seleccionado.</p>`;
}

function llamarPacienteBox(citaId, pacienteId) {
  window.clinicStore.llamarAConsulta(citaId);
  window.activePatientId = pacienteId;
  window.activeAppointmentId = citaId;
  showToast("success", "Atención Clínica Iniciada", `Paciente convocado al consultorio para registro HU-09.`);
  renderAllViews();
  navigateTo("vista-hu09-atencion-clinica", { patientId: pacienteId, appointmentId: citaId });
}

// --- HU-10: EXPEDIENTE CLÍNICO INTEGRAL + IMPRESIÓN DE RECETA ---
function renderExpedienteClinico(pacienteId) {
  const pacientes = window.clinicStore.getPacientes();
  const selector = document.getElementById("expediente-paciente-selector");

  const paciente = window.clinicStore.getPacienteById(pacienteId) || pacientes[0];
  if (!paciente) return;
  window.activePatientId = paciente.id;

  if (selector) {
    selector.innerHTML = pacientes
      .map(
        p =>
          `<option value="${p.id}" ${p.id === paciente.id ? "selected" : ""}>${p.nombres} ${p.apellidos} (${p.tipoDoc} ${p.numeroDoc})</option>`
      )
      .join("");
  }

  document.getElementById("expediente-avatar-box").textContent = `${paciente.nombres[0]}${paciente.apellidos[0]}`;
  document.getElementById("expediente-paciente-nombre").textContent = `${paciente.nombres} ${paciente.apellidos}`;
  document.getElementById("expediente-paciente-rh").textContent = `RH ${paciente.grupoSanguineo || "O+"}`;
  document.getElementById("expediente-paciente-id").textContent = paciente.id;
  document.getElementById("expediente-paciente-doc").textContent = `${paciente.tipoDoc} ${paciente.numeroDoc}`;
  document.getElementById("expediente-paciente-edad").textContent = `${paciente.edad} años`;
  document.getElementById("expediente-paciente-eps").textContent = paciente.eps;
  document.getElementById("expediente-paciente-direccion").textContent = paciente.direccion;
  document.getElementById("expediente-paciente-emergencia").textContent = paciente.contactoEmergencia || "No registrado";
  document.getElementById("expediente-alergias-texto").textContent = paciente.alergias || "Ninguna conocida";
  document.getElementById("expediente-antecedentes-texto").textContent = paciente.antecedentes || "Sin antecedentes registrados";

  const timeline = document.getElementById("expediente-timeline");
  const countEl = document.getElementById("expediente-consultas-count");
  if (!timeline) return;

  const consultas = window.clinicStore.getConsultasByPacienteId(paciente.id);
  if (countEl) countEl.textContent = `${consultas.length} consulta(s) registrada(s)`;

  if (consultas.length === 0) {
    timeline.innerHTML = `
      <div class="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500 font-semibold">
        El paciente no registra entradas en su historial clínico (RF-10.2).
      </div>
    `;
    return;
  }

  timeline.innerHTML = consultas
    .map(
      c => `
      <div class="relative pl-6 pb-6 border-l-2 border-teal-600 last:border-transparent">
        <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></div>
        <div class="bg-slate-50/70 p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
            <div>
              <span class="font-mono font-bold text-xs text-[#016398]">${c.id}</span>
              <span class="text-xs font-bold text-slate-900 ml-2">${c.fecha} &bull; ${c.hora}</span>
              ${c.citaId ? `<span class="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">Cita ${c.citaId} ATENDIDA</span>` : ""}
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-bold text-teal-900 bg-teal-100/80 px-2.5 py-0.5 rounded-md border border-teal-200">
                ${escapeHtml(c.medicoNombre)} ${c.especialidad ? `(${escapeHtml(c.especialidad)})` : ""}
              </span>
              <button onclick="openModalReceta('${c.id}')" class="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#016398] border border-slate-200 rounded-lg text-[11px] font-bold shadow-2xs">
                🖨️ Ver Orden / Receta
              </button>
            </div>
          </div>

          <div class="text-xs text-slate-700 space-y-1.5">
            <p><strong class="text-slate-900">Diagnóstico CIE-10:</strong> <span class="font-mono font-bold text-[#016398]">${escapeHtml(c.diagnosticoPrincipal.codigo)}</span> — ${escapeHtml(c.diagnosticoPrincipal.descripcion)}</p>
            <p><strong class="text-slate-900">Signos Vitales:</strong> PA ${c.signosVitales.presionArterial} mmHg &bull; FC ${c.signosVitales.frecuenciaCardiaca} lpm &bull; Temp ${c.signosVitales.temperatura} °C &bull; SatO2 ${c.signosVitales.saturacionOxigeno || 98}% &bull; Peso ${c.signosVitales.pesoKg || "--"} kg</p>
            <p><strong class="text-slate-900">Anamnesis y Evolución:</strong> ${escapeHtml(c.anamnesis)}</p>
            <p><strong class="text-slate-900">Plan de Tratamiento:</strong> ${escapeHtml(c.planTratamiento || "")}</p>
          </div>

          ${
            c.receta && c.receta.length > 0 && c.receta[0].medicamento
              ? `
            <div class="mt-2 pt-2 border-t border-slate-200/70">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fórmula Farmacológica Prescrita:</span>
              <ul class="text-xs text-slate-700 list-disc list-inside mt-1 font-medium">
                ${c.receta.map(r => `<li><strong>${escapeHtml(r.medicamento)}</strong> (${escapeHtml(r.dosis)}) — ${escapeHtml(r.frecuencia)} durante ${escapeHtml(r.duracion)}</li>`).join("")}
              </ul>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `
    )
    .join("");
}

function openModalReceta(consultaId) {
  const c = window.clinicStore.getConsultas().find(x => x.id === consultaId);
  if (!c) return;
  const p = window.clinicStore.getPacienteById(c.pacienteId);
  const modal = document.getElementById("modal-receta-medica");
  const body = document.getElementById("receta-modal-body");
  if (!modal || !body) return;

  document.getElementById("receta-modal-titulo").textContent = `Orden Clínica y Fórmula Médica • ${c.id}`;
  body.innerHTML = `
    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2">
      <div><strong>Paciente:</strong> ${p ? `${escapeHtml(p.nombres)} ${escapeHtml(p.apellidos)}` : c.pacienteId}</div>
      <div><strong>Documento:</strong> ${p ? `${p.tipoDoc} ${p.numeroDoc}` : ""}</div>
      <div><strong>Fecha y Hora:</strong> ${c.fecha} ${c.hora}</div>
      <div><strong>Facultativo:</strong> ${escapeHtml(c.medicoNombre)}</div>
    </div>
    <div class="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
      <div><strong>Diagnóstico Principal (CIE-10):</strong> ${escapeHtml(c.diagnosticoPrincipal.codigo)} - ${escapeHtml(c.diagnosticoPrincipal.descripcion)}</div>
      <div><strong>Plan Terapéutico:</strong> ${escapeHtml(c.planTratamiento || "")}</div>
    </div>
    <div class="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 space-y-1.5">
      <div class="font-bold text-[#016398] uppercase text-[10px]">Medicamentos Prescritos (Rx)</div>
      ${
        c.receta && c.receta.length > 0 && c.receta[0].medicamento
          ? `<ul class="list-disc list-inside space-y-1">${c.receta
              .map(r => `<li><strong>${escapeHtml(r.medicamento)} ${escapeHtml(r.dosis)}</strong>: ${escapeHtml(r.frecuencia)} por ${escapeHtml(r.duracion)}</li>`)
              .join("")}</ul>`
          : `<p>Manejo no farmacológico según indicaciones del plan terapéutico.</p>`
      }
    </div>
  `;
  modal.classList.remove("hidden");
}

function closeModalReceta() {
  const modal = document.getElementById("modal-receta-medica");
  if (modal) modal.classList.add("hidden");
}

// --- HU-01 & HU-03: CÁLCULO DE EDAD Y PRECARGA DE PACIENTE ---
function actualizarEdadAutomaticaHu01() {
  const fechaEl = document.getElementById("hu01-fecha-nac");
  const edadEl = document.getElementById("hu01-edad-input");
  if (fechaEl && edadEl && fechaEl.value) {
    edadEl.value = window.clinicStore.calcularEdad(fechaEl.value);
  }
}

function populateEditarPacienteForm(pacienteId) {
  const p = window.clinicStore.getPacienteById(pacienteId) || window.clinicStore.getPacientes()[0];
  if (!p) return;

  document.getElementById("edit-paciente-id").value = p.id;
  document.getElementById("edit-paciente-doc").value = `${p.id} (${p.tipoDoc} ${p.numeroDoc})`;
  document.getElementById("edit-paciente-nombres").value = `${p.nombres} ${p.apellidos}`;
  document.getElementById("edit-paciente-edad").value = p.edad;
  document.getElementById("edit-paciente-telefono").value = p.telefono;
  document.getElementById("edit-paciente-email").value = p.email || "";
  document.getElementById("edit-paciente-direccion").value = p.direccion;
  document.getElementById("edit-paciente-eps").value = p.eps;
  document.getElementById("edit-paciente-alergias").value = p.alergias;
}

// --- HU-07 & MATRIZ DE DISPONIBILIDAD EN VIVO (RN-02) ---
function populateAgendarCitaSelects() {
  const selPaciente = document.getElementById("agendar-paciente-select");
  const selMedico = document.getElementById("agendar-medico-select");
  const fechaInput = document.getElementById("agendar-fecha-input");
  if (!selPaciente || !selMedico) return;

  selPaciente.innerHTML = window.clinicStore
    .getPacientes()
    .map(p => `<option value="${p.id}" ${p.id === window.activePatientId ? "selected" : ""}>${p.nombres} ${p.apellidos} (${p.tipoDoc} ${p.numeroDoc})</option>`)
    .join("");

  selMedico.innerHTML = window.clinicStore
    .getMedicos()
    .map(m => `<option value="${m.id}">Dr(a). ${m.nombres} ${m.apellidos} — ${m.especialidad} (${m.consultorio})</option>`)
    .join("");

  if (window.preselectedCitaDraft) {
    if (window.preselectedCitaDraft.medicoId) selMedico.value = window.preselectedCitaDraft.medicoId;
    if (window.preselectedCitaDraft.fecha && fechaInput) fechaInput.value = window.preselectedCitaDraft.fecha;
  }

  actualizarOpcionesHorarioHu07();

  if (window.preselectedCitaDraft && window.preselectedCitaDraft.horaInicio) {
    const horaSelect = document.getElementById("agendar-hora-select");
    if (horaSelect) horaSelect.value = window.preselectedCitaDraft.horaInicio;
    window.preselectedCitaDraft = null;
  }
}

function actualizarOpcionesHorarioHu07() {
  const selMedico = document.getElementById("agendar-medico-select");
  const fechaInput = document.getElementById("agendar-fecha-input");
  const horaSelect = document.getElementById("agendar-hora-select");
  if (!selMedico || !fechaInput || !horaSelect) return;

  const medicoId = selMedico.value;
  const fecha = fechaInput.value || "2026-11-10";
  const slots = window.clinicStore.getSlotsDisponibilidad(medicoId, fecha);

  let firstFree = null;
  horaSelect.innerHTML = slots
    .map(s => {
      if (s.libre && !firstFree) firstFree = s.horaInicio;
      const estadoTxt = s.libre
        ? "✓ Disponible"
        : `⛔ Ocupado RN-02 (${s.cita.pacienteNombre})`;
      return `<option value="${s.horaInicio}">${s.etiqueta} — ${estadoTxt}</option>`;
    })
    .join("");

  if (firstFree) {
    horaSelect.value = firstFree;
  }
}

function renderDisponibilidadMatrix() {
  const container = document.getElementById("disponibilidad-slots-grid");
  const selMedico = document.getElementById("disp-medico-select");
  const fechaInput = document.getElementById("disp-fecha-input");
  const badge = document.getElementById("disp-libres-badge");
  const titleEl = document.getElementById("disp-header-title");
  if (!container || !selMedico || !fechaInput) return;

  const medicos = window.clinicStore.getMedicos();
  const currentMedId = selMedico.value || (medicos[0] && medicos[0].id);

  selMedico.innerHTML = medicos
    .map(
      m =>
        `<option value="${m.id}" ${m.id === currentMedId ? "selected" : ""}>Dr(a). ${m.nombres} ${m.apellidos} (${m.especialidad} • ${m.consultorio})</option>`
    )
    .join("");

  const medico = window.clinicStore.getMedicoById(selMedico.value) || medicos[0];
  const fecha = fechaInput.value || "2026-11-10";
  const slots = window.clinicStore.getSlotsDisponibilidad(medico.id, fecha);
  const libresCount = slots.filter(s => s.libre).length;

  if (badge) {
    badge.textContent = `${libresCount} de ${slots.length} franjas libres (${fecha})`;
  }
  if (titleEl && medico) {
    titleEl.textContent = `Agenda de Dr(a). ${medico.nombres} ${medico.apellidos} • ${medico.consultorio} (${fecha})`;
  }

  container.innerHTML = slots
    .map(s => {
      if (s.libre) {
        return `
          <div onclick="seleccionarSlotDisponible('${medico.id}', '${fecha}', '${s.horaInicio}')" class="p-4 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100/80 transition cursor-pointer flex flex-col justify-between group shadow-2xs">
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-bold text-xs text-emerald-950">${s.etiqueta}</span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-200 text-emerald-950">DISPONIBLE</span>
            </div>
            <p class="text-[11px] text-emerald-800 font-bold group-hover:underline">+ Agendar en este bloque &rarr;</p>
          </div>
        `;
      } else {
        return `
          <div class="p-4 rounded-xl border border-sky-200 bg-sky-50/80 flex flex-col justify-between shadow-2xs">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-xs text-sky-950">${s.etiqueta}</span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-sky-200 text-sky-950">${s.cita.id}</span>
            </div>
            <p class="text-xs font-bold text-slate-900 truncate">${escapeHtml(s.cita.pacienteNombre)}</p>
            <span class="text-[10px] text-slate-500">${s.cita.pacienteDoc} &bull; ${s.cita.estado}</span>
          </div>
        `;
      }
    })
    .join("");
}

function seleccionarSlotDisponible(medicoId, fecha, horaInicio) {
  showToast(
    "info",
    "Franja Preseleccionada (RN-02)",
    `Horario ${horaInicio} del ${fecha} cargado en el formulario HU-07.`
  );
  navigateTo("vista-hu07-agendar-cita", {
    preselectCita: { medicoId, fecha, horaInicio }
  });
}

// --- HU-09: CONFIGURACIÓN DEL FORMULARIO DE ATENCIÓN CLÍNICA ---
function setupConsultaForm() {
  const citaSelect = document.getElementById("consulta-cita-select");
  const medicoSelect = document.getElementById("consulta-medico-select");
  const cie10Select = document.getElementById("cie10-quick-select");

  const citasActivas = window.clinicStore
    .getCitas()
    .filter(c => c.estado !== "Cancelada" && c.estado !== "Atendida");

  if (citaSelect) {
    let optionsHtml = `<option value="">-- Consulta Directa sin Cita Previa --</option>`;
    optionsHtml += citasActivas
      .map(
        c =>
          `<option value="${c.id}" ${c.id === window.activeAppointmentId ? "selected" : ""}>${c.id} • ${c.horaInicio} — ${c.pacienteNombre} (${c.medicoNombre})</option>`
      )
      .join("");
    citaSelect.innerHTML = optionsHtml;
  }

  if (medicoSelect) {
    medicoSelect.innerHTML = window.clinicStore
      .getMedicos()
      .map(m => `<option value="${m.id}">Dr(a). ${m.nombres} ${m.apellidos} (${m.especialidad})</option>`)
      .join("");
  }

  if (cie10Select && cie10Select.options.length === 0) {
    const catalogo = (window.CLINIC_MOCK_DATA && window.CLINIC_MOCK_DATA.catalogoCie10) || [];
    cie10Select.innerHTML = catalogo
      .map(item => `<option value="${item.codigo}">${item.codigo} — ${item.descripcion}</option>`)
      .join("");
  }

  if (citaSelect && citaSelect.value) {
    onChangeCitaEnConsulta(citaSelect.value);
  } else {
    actualizarBannerPacienteConsulta(window.activePatientId);
  }
}

function onChangeCitaEnConsulta(citaId) {
  window.activeAppointmentId = citaId || null;
  const cita = window.clinicStore.getCitas().find(c => c.id === citaId);
  if (cita) {
    window.activePatientId = cita.pacienteId;
    const medicoSelect = document.getElementById("consulta-medico-select");
    if (medicoSelect) medicoSelect.value = cita.medicoId;
  }
  actualizarBannerPacienteConsulta(window.activePatientId);
}

function actualizarBannerPacienteConsulta(pacienteId) {
  const p = window.clinicStore.getPacienteById(pacienteId) || window.clinicStore.getPacientes()[0];
  if (!p) return;
  window.activePatientId = p.id;
  document.getElementById("consulta-paciente-nombre").textContent = `${p.nombres} ${p.apellidos}`;
  document.getElementById("consulta-paciente-info").textContent = `${p.tipoDoc} ${p.numeroDoc} • ${p.edad} años • EPS: ${p.eps}`;
  document.getElementById("consulta-alergias-banner").textContent = p.alergias || "Ninguna conocida";
}

function aplicarCie10Catalogo(codigo) {
  const catalogo = (window.CLINIC_MOCK_DATA && window.CLINIC_MOCK_DATA.catalogoCie10) || [];
  const found = catalogo.find(x => x.codigo === codigo);
  if (found) {
    document.getElementById("cie10-codigo-input").value = found.codigo;
    document.getElementById("cie10-desc-input").value = found.descripcion;
  }
}

// --- ENVÍO DE FORMULARIOS (HU-01, HU-03, HU-04, HU-07, HU-09) ---
function initForms() {
  // HU-01: Registrar Paciente
  const formHu01 = document.getElementById("form-hu01-registro-paciente");
  if (formHu01) {
    formHu01.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const data = {
          tipoDoc: formHu01.tipoDoc.value,
          numeroDoc: formHu01.numeroDoc.value.trim(),
          fechaNacimiento: formHu01.fechaNacimiento.value,
          edad: Number(formHu01.edad.value),
          nombres: formHu01.nombres.value.trim(),
          apellidos: formHu01.apellidos.value.trim(),
          sexo: formHu01.sexo.value,
          grupoSanguineo: formHu01.grupoSanguineo.value,
          telefono: formHu01.telefono.value.trim(),
          email: formHu01.email.value.trim(),
          eps: formHu01.eps.value,
          direccion: formHu01.direccion.value.trim(),
          contactoEmergencia: formHu01.contactoEmergencia.value.trim(),
          alergias: formHu01.alergias.value.trim() || "Ninguna conocida"
        };

        const newP = window.clinicStore.addPaciente(data);
        window.activePatientId = newP.id;
        showToast(
          "success",
          "Paciente Admitido (HU-01)",
          `${newP.nombres} ${newP.apellidos} (${newP.id}) registrado con expediente clínico abierto.`
        );
        formHu01.reset();
        renderAllViews();
        navigateTo("vista-hu02-directorio-pacientes");
      } catch (err) {
        showToast("danger", "Validación HU-01 / RN-04", err.message);
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
          edad: Number(document.getElementById("edit-paciente-edad").value),
          telefono: document.getElementById("edit-paciente-telefono").value.trim(),
          email: document.getElementById("edit-paciente-email").value.trim(),
          direccion: document.getElementById("edit-paciente-direccion").value.trim(),
          eps: document.getElementById("edit-paciente-eps").value,
          alergias: document.getElementById("edit-paciente-alergias").value.trim() || "Ninguna conocida"
        };

        window.clinicStore.updatePaciente(id, updated);
        showToast("success", "Ficha Actualizada (HU-03)", `Los datos de contacto de ${id} fueron actualizados.`);
        renderAllViews();
        navigateTo("vista-hu02-directorio-pacientes");
      } catch (err) {
        showToast("danger", "Validación HU-03", err.message);
      }
    });
  }

  // HU-04: Registrar Médico (con RN-05 Edad 18-99 y RN-04 Teléfono)
  const formHu04 = document.getElementById("form-hu04-registrar-medico");
  if (formHu04) {
    formHu04.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const data = {
          nombres: formHu04.nombres.value.trim(),
          apellidos: formHu04.apellidos.value.trim(),
          numeroDoc: formHu04.numeroDoc.value.trim(),
          edad: Number(formHu04.edad.value),
          registroMedico: formHu04.registroMedico.value.trim(),
          especialidad: formHu04.especialidad.value,
          consultorio: formHu04.consultorio.value,
          turno: formHu04.turno.value,
          email: formHu04.email.value.trim(),
          telefono: formHu04.telefono.value.trim()
        };

        const newM = window.clinicStore.addMedico(data);
        showToast(
          "success",
          "Facultativo Habilitado (HU-04)",
          `Dr(a). ${newM.nombres} ${newM.apellidos} (${newM.edad} años, ${newM.especialidad}) registrado con éxito.`
        );
        formHu04.reset();
        renderAllViews();
        navigateTo("vista-hu05-directorio-medicos");
      } catch (err) {
        showToast("danger", "Validación HU-04 / RN-05", err.message);
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
          tipoCita: formHu07.tipoCita.value || "Presencial"
        };

        const newC = window.clinicStore.addCita(data);
        showToast(
          "success",
          "Cita Agendada (HU-07 / RN-02)",
          `Cita ${newC.id} reservada el ${newC.fecha} a las ${newC.horaInicio} con ${newC.medicoNombre}.`
        );
        formHu07.motivo.value = "";
        renderAllViews();
        navigateTo("vista-hu08-agenda-citas");
      } catch (err) {
        showToast("danger", "Bloqueo de Colisión RN-02", err.message);
      }
    });
  }

  // HU-09: Registrar Diagnóstico y Tratamiento (RN-06 Transición a ATENDIDA)
  const formHu09 = document.getElementById("form-hu09-atencion-clinica");
  if (formHu09) {
    formHu09.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const citaId = document.getElementById("consulta-cita-select").value || null;
        const medicoId = document.getElementById("consulta-medico-select").value || "MED-01";
        const med = window.clinicStore.getMedicoById(medicoId);

        const consultaData = {
          pacienteId: window.activePatientId,
          citaId: citaId,
          medicoId: medicoId,
          medicoNombre: med ? `Dr(a). ${med.nombres} ${med.apellidos}` : "Dr. Roberto Gómez",
          especialidad: med ? med.especialidad : "Cardiología",
          signosVitales: {
            presionArterial: formHu09.pa.value,
            frecuenciaCardiaca: formHu09.fc.value,
            temperatura: formHu09.temp.value,
            saturacionOxigeno: formHu09.sato2.value,
            pesoKg: formHu09.peso.value,
            tallaCm: formHu09.talla.value
          },
          anamnesis: formHu09.anamnesis.value.trim(),
          exploracionFisica: formHu09.exploracion.value.trim(),
          diagnosticoPrincipal: {
            codigo: formHu09.cie10Codigo.value.trim(),
            descripcion: formHu09.cie10Desc.value.trim()
          },
          planTratamiento: formHu09.tratamiento.value.trim(),
          receta: formHu09.med1.value.trim()
            ? [
                {
                  medicamento: formHu09.med1.value.trim(),
                  dosis: formHu09.dosis1.value.trim(),
                  frecuencia: formHu09.freq1.value.trim(),
                  duracion: formHu09.dur1.value.trim()
                }
              ]
            : []
        };

        const newExp = window.clinicStore.addConsulta(consultaData);
        showToast(
          "success",
          "Consulta Firmada y Archivada (HU-09 / RN-06)",
          `Evolución ${newExp.id} agregada al expediente${citaId ? ` y cita ${citaId} marcada ATENDIDA` : ""}.`
        );
        renderAllViews();
        navigateTo("vista-hu10-expediente-clinico", { patientId: window.activePatientId });
      } catch (err) {
        showToast("danger", "Error en Registro Clínico", err.message);
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
  renderHomePortal();
  renderPacientesTable();
  renderMedicosTable();
  renderAgendaTable(window.currentAgendaFilter || "TODAS");
  renderDashboardRecepcion();
  renderDashboardMedico();
  renderDisponibilidadMatrix();
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>'"]/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[tag] || tag));
}
