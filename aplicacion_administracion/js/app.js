// =============================================
// [NOMBRE DE LA APP] — app.js
// =============================================

// --- ESTADO Y DATOS GLOBALES ---
let usuarioNombre = "";
let usuarioCorreo = "";
let usuarioCarrera = "";
let usuarioPuntaje = 0;
let retosCompletados = [];
let datosUsuario = {
    nombre: '', dni: '', telefono: '', correo: '',
    carrera: '', descripcion: '', linkedin: '',
    direccion: '', foto: '', habilidades: [], idiomas: []
};
let categoriaActual = "";
let retoActual = null;

const retosData = {
    'Liderazgo': [
        { id: 'L1', nombre: 'Toma de decisiones bajo presión', desc: 'Resuelve un problema urgente con el equipo.', tiempo: '10 min', puntos: 100, escenario: 'Un proyecto clave tiene un retraso crítico y el cliente está furioso. Debes decidir qué camino tomar y cómo comunicarlo.' },
        { id: 'L2', nombre: 'Delegación efectiva', desc: 'Asigna tareas a un equipo saturado.', tiempo: '8 min', puntos: 80, escenario: 'Tienes 5 tareas urgentes y 3 miembros del equipo con diferentes niveles de carga. Explica cómo distribuirías las tareas.' },
        { id: 'L3', nombre: 'Manejo de conflictos', desc: 'Media entre dos colegas peleados.', tiempo: '12 min', puntos: 120, escenario: 'Dos pilares de tu equipo han dejado de hablarse por un malentendido. ¿Cómo abordarías la mediación?' }
    ],
    'Comunicación': [
        { id: 'C1', nombre: 'Feedback constructivo', desc: 'Da feedback a un empleado impuntual.', tiempo: '10 min', puntos: 90, escenario: 'Debes darle un feedback negativo a un colaborador que siempre llega tarde, pero es el más talentoso. ¿Cómo lo harías?' },
        { id: 'C2', nombre: 'Presentación ejecutiva', desc: 'Convence al CEO.', tiempo: '15 min', puntos: 100, escenario: 'Tienes 2 minutos para convencer al CEO de invertir en una herramienta. Resume tu propuesta.' },
        { id: 'C3', nombre: 'Negociación difícil', desc: 'Negocia con proveedor.', tiempo: '12 min', puntos: 110, escenario: 'Un proveedor quiere subir los precios un 20%. Tu presupuesto está cerrado. Propón una estrategia.' }
    ],
    'Trabajo en equipo': [
        { id: 'T1', nombre: 'Consenso grupal', desc: 'Logra un acuerdo unánime.', tiempo: '10 min', puntos: 85, escenario: 'El equipo no se pone de acuerdo en el logo de la empresa. Propón un método para el consenso.' }
    ],
    'Resolución de problemas': [
        { id: 'R1', nombre: 'Crisis de servidor', desc: 'Atiende caída de sistema.', tiempo: '15 min', puntos: 150, escenario: 'El sistema principal se cae durante Black Friday. Describe los primeros 3 pasos lógicos.' }
    ]
};

const recomendaciones = [
    "Destacas en toma de decisiones bajo presión.",
    "Tienes habilidades sólidas de comunicación asertiva.",
    "Tu perfil muestra liderazgo natural en situaciones de conflicto.",
    "Posees una capacidad analítica excelente."
];

const usuariosEmpresa = [
    { nombre: 'Carlos Ruiz', carrera: 'Administración', rango: 'Plata', puntaje: 82, correo: 'carlos@demo.com', rec: recomendaciones[1], retos: ['Feedback constructivo', 'Consenso grupal'] },
    { nombre: 'Ana García', carrera: 'Administración', rango: 'Oro', puntaje: 95, correo: 'ana@demo.com', rec: recomendaciones[0], retos: ['Toma de decisiones bajo presión', 'Crisis de servidor'] },
    { nombre: 'Elena Torres', carrera: 'Administración', rango: 'Bronce', puntaje: 65, correo: 'elena@demo.com', rec: recomendaciones[2], retos: ['Manejo de conflictos'] },
    { nombre: 'Marcos Lyon', carrera: 'Administración', rango: 'Plata', puntaje: 78, correo: 'marcos@demo.com', rec: recomendaciones[3], retos: ['Presentación ejecutiva'] }
];

// --- CÁMARA Y GRABACIÓN ---
let streamCamara = null;
let mediaRecorder = null;
let chunksVideo = [];

// =============================================
// NAVEGACIÓN
// =============================================
function mostrarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    window.scrollTo(0, 0);
    if (id === 'pantalla-cv-usuario') {
        renderizarCV();
    }
}

// =============================================
// SESIÓN
// =============================================
function cerrarSesion() {
    usuarioNombre = '';
    mostrarPantalla('pantalla-inicio');
}

// =============================================
// CV USUARIO
// =============================================
function renderizarCV() {
    const d = datosUsuario;

    // Foto o iniciales
    const fotoEl = document.getElementById('cv-foto');
    const inicialesEl = document.getElementById('cv-iniciales');
    if (fotoEl && inicialesEl) {
        if (d.foto) {
            fotoEl.src = d.foto;
            fotoEl.style.display = 'block';
            inicialesEl.style.display = 'none';
        } else {
            fotoEl.style.display = 'none';
            inicialesEl.style.display = 'flex';
            const parts = d.nombre ? d.nombre.split(' ') : [];
            const initials = (parts[0] ? parts[0][0].toUpperCase() : '') + (parts[1] ? parts[1][0].toUpperCase() : '');
            inicialesEl.textContent = initials;
        }
    }

    // Texto básico
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val || ''; };
    set('cv-nombre', d.nombre);
    set('cv-carrera', d.carrera);
    set('cv-descripcion', d.descripcion);
    set('cv-correo', d.correo);
    set('cv-telefono', d.telefono);
    set('cv-linkedin', d.linkedin);
    set('cv-direccion', d.direccion);

    // Habilidades
    const habLista = document.getElementById('cv-habilidades-lista');
    if (habLista) {
        habLista.innerHTML = '';
        d.habilidades.forEach(h => {
            const div = document.createElement('div');
            div.textContent = '✔ ' + h;
            habLista.appendChild(div);
        });
    }

    // Idiomas
    const idiomaDiv = document.getElementById('cv-idiomas');
    if (idiomaDiv) {
        idiomaDiv.innerHTML = '';
        d.idiomas.forEach(it => {
            const p = document.createElement('p');
            p.style.margin = '2px 0';
            p.textContent = `${it.idioma}: ${it.nivel}`;
            idiomaDiv.appendChild(p);
        });
    }

    // Retos completados en el CV
    const cvRetos = document.getElementById('cv-retos');
    if (cvRetos) {
        cvRetos.innerHTML = '';
        retosCompletados.forEach(r => {
            const div = document.createElement('div');
            div.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
            div.innerHTML = `<span style="color:#7c3aed;font-size:18px;">✓</span> ${r.nombre}`;
            cvRetos.appendChild(div);
        });
        if (retosCompletados.length === 0) {
            cvRetos.innerHTML = '<p style="color:#aaa;font-size:13px;">Aún no has completado retos.</p>';
        }
    }

    // Habilidades demostradas (sección resultado)
    const habRes = document.getElementById('cv-habilidades-resultado');
    if (habRes) {
        habRes.innerHTML = '';
        const cats = [...new Set(retosCompletados.map(r => r.id[0] === 'L' ? 'Liderazgo' : r.id[0] === 'C' ? 'Comunicación' : r.id[0] === 'T' ? 'Trabajo en equipo' : 'Resolución de problemas'))];
        cats.forEach(cat => {
            const div = document.createElement('div');
            div.style.marginBottom = '10px';
            const pct = Math.min(100, usuarioPuntaje + Math.floor(Math.random() * 10 - 5));
            div.innerHTML = `
                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px;">
                    <span>${cat}</span><span>${pct}%</span>
                </div>
                <div style="background:#eee;border-radius:6px;height:6px;">
                    <div style="background:#7c3aed;height:6px;border-radius:6px;width:${pct}%;"></div>
                </div>`;
            habRes.appendChild(div);
        });
        if (cats.length === 0) {
            habRes.innerHTML = '<p style="color:#aaa;font-size:13px;">Completa retos para ver tus habilidades demostradas.</p>';
        }
    }

    // Puntaje y rango
    set('cv-puntaje', String(usuarioPuntaje || 0));
    const rangoBadge = document.getElementById('cv-rango-badge');
    if (rangoBadge) {
        let rango = 'Bronce';
        if (usuarioPuntaje >= 90) rango = 'Oro';
        else if (usuarioPuntaje >= 70) rango = 'Plata';
        rangoBadge.textContent = rango;
    }
}

// =============================================
// REGISTRO
// =============================================
function previewFoto(input) {
    const preview = document.getElementById('preview-foto');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.style.display = 'none';
        preview.src = '';
    }
}

function agregarIdioma() {
    const bloque = document.getElementById('bloque-idiomas');
    const div = document.createElement('div');
    div.style = 'display:flex; gap:8px; align-items:center; margin-bottom:6px;';
    div.innerHTML = `
        <input type="text" placeholder="Idioma" style="flex:1;" />
        <select style="flex:1;">
            <option>Básico</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
            <option>Nativo</option>
        </select>
        <button type="button" onclick="this.parentElement.remove()" style="width:auto; background:none; color:red; border:none; font-size:18px; cursor:pointer;">×</button>
    `;
    bloque.appendChild(div);
}

function validarCarrera(select) {
    if (select.value !== 'Administración' && select.value !== '') {
        alert('Esta carrera estará disponible próximamente. Por ahora solo puedes registrarte en Administración.');
        select.value = 'Administración';
    }
}

function registrarUsuario(e) {
    e.preventDefault();
    usuarioNombre = document.getElementById('reg-nombre').value;
    usuarioCorreo = document.getElementById('reg-correo').value;
    usuarioCarrera = document.getElementById('reg-carrera').value;

    const habs = [];
    document.querySelectorAll('#checkboxes-habilidades input:checked').forEach(cb => habs.push(cb.value));
    const idiomas = [];
    document.querySelectorAll('#bloque-idiomas > div').forEach(row => {
        const inp = row.querySelector('input');
        const sel = row.querySelector('select');
        if (inp && inp.value.trim()) idiomas.push({ idioma: inp.value.trim(), nivel: sel.value });
    });
    const previewImg = document.getElementById('preview-foto');

    datosUsuario = {
        nombre: usuarioNombre,
        dni: document.getElementById('reg-dni').value,
        telefono: document.getElementById('reg-tel').value,
        correo: usuarioCorreo,
        carrera: usuarioCarrera,
        descripcion: document.getElementById('descripcion').value,
        linkedin: document.getElementById('linkedin').value,
        direccion: document.getElementById('direccion').value,
        foto: previewImg.style.display !== 'none' ? previewImg.src : '',
        habilidades: habs,
        idiomas: idiomas
    };

    document.getElementById('cat-saludo').innerText = "Bienvenido/a, " + usuarioNombre;
    mostrarPantalla('pantalla-categorias');
}

// =============================================
// RETOS
// =============================================
function seleccionarCategoria(cat) {
    categoriaActual = cat;
    document.getElementById('titulo-categoria').innerText = cat;

    const lista = document.getElementById('lista-retos');
    lista.innerHTML = '';

    retosData[cat].forEach((reto, index) => {
        const completado = retosCompletados.some(r => r.id === reto.id);
        lista.innerHTML += `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem;">
                <div>
                    <h3 style="margin-bottom: 0.5rem;">${reto.nombre}</h3>
                    <p style="margin-bottom: 0;">${reto.desc}</p>
                </div>
                <button class="btn btn-outline btn-small" ${completado ? 'disabled' : ''} onclick="seleccionarReto('${cat}', ${index})">
                    ${completado ? 'Completado ✔' : 'Iniciar reto'}
                </button>
            </div>
        `;
    });

    mostrarPantalla('pantalla-retos');
}

function seleccionarReto(cat, index) {
    retoActual = retosData[cat][index];
    document.getElementById('reto-nombre').innerText = retoActual.nombre;
    document.getElementById('reto-tiempo').innerText = retoActual.tiempo;
    document.getElementById('reto-puntos').innerText = retoActual.puntos + " pts";
    document.getElementById('reto-escenario').innerText = retoActual.escenario;

    // Limpiar grabaciones previas
    chunksVideo = [];
    const videoGrabado = document.getElementById('video-grabado');
    if (videoGrabado) { videoGrabado.style.display = 'none'; videoGrabado.src = ''; }
    const previewCamara = document.getElementById('preview-camara');
    if (previewCamara) previewCamara.style.display = 'none';
    const estadoGrabacion = document.getElementById('estado-grabacion');
    if (estadoGrabacion) estadoGrabacion.textContent = '';
    const btnActivar = document.getElementById('btn-activar');
    if (btnActivar) btnActivar.disabled = false;
    const btnGrabar = document.getElementById('btn-grabar');
    if (btnGrabar) btnGrabar.disabled = true;
    const btnDetener = document.getElementById('btn-detener');
    if (btnDetener) btnDetener.disabled = true;

    mostrarPantalla('pantalla-detalle-reto');
}

function enviarRespuesta() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        detenerGrabacion();
    }

    if (chunksVideo.length === 0) {
        alert('Por favor graba tu respuesta con la cámara antes de enviar.');
        return;
    }

    retosCompletados.push(retoActual);
    alert("¡Respuesta registrada con éxito!");

    if (retosCompletados.length === 1) {
        let categoriasDisponibles = Object.keys(retosData).filter(c => c !== categoriaActual);
        let catAleatoria = categoriasDisponibles[Math.floor(Math.random() * categoriasDisponibles.length)];
        seleccionarReto(catAleatoria, 0);
    } else {
        usuarioPuntaje = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
        document.getElementById('res-mensaje').innerText = "¡Gracias, " + usuarioNombre.split(' ')[0] + "! Has completado los retos.";
        document.getElementById('res-puntaje').innerText = usuarioPuntaje;
        document.getElementById('res-recomendacion').innerText = recomendaciones[Math.floor(Math.random() * recomendaciones.length)];
        mostrarPantalla('pantalla-resultados');
    }
}

// =============================================
// CÁMARA
// =============================================
async function activarCamara() {
    try {
        streamCamara = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('preview-camara').srcObject = streamCamara;
        document.getElementById('preview-camara').style.display = 'block';
        document.getElementById('btn-grabar').disabled = false;
        document.getElementById('btn-activar').disabled = true;
        document.getElementById('estado-grabacion').textContent = 'Cámara activa. Listo para grabar.';
    } catch (err) {
        document.getElementById('estado-grabacion').textContent = 'No se pudo acceder a la cámara. Verifica los permisos.';
    }
}

function iniciarGrabacion() {
    chunksVideo = [];
    mediaRecorder = new MediaRecorder(streamCamara);
    mediaRecorder.ondataavailable = e => chunksVideo.push(e.data);
    mediaRecorder.onstop = () => {
        const blob = new Blob(chunksVideo, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const videoGrabado = document.getElementById('video-grabado');
        videoGrabado.src = url;
        videoGrabado.style.display = 'block';
        document.getElementById('estado-grabacion').textContent = 'Grabación lista. Puedes enviar tu respuesta.';
    };
    mediaRecorder.start();
    document.getElementById('btn-grabar').disabled = true;
    document.getElementById('btn-detener').disabled = false;
    document.getElementById('estado-grabacion').textContent = 'Grabando...';
}

function detenerGrabacion() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    if (streamCamara) {
        streamCamara.getTracks().forEach(t => t.stop());
    }
    document.getElementById('preview-camara').style.display = 'none';
    document.getElementById('btn-detener').disabled = true;
}

// =============================================
// EMPRESA
// =============================================
function loginEmpresa(e) {
    e.preventDefault();
    const email = document.getElementById('emp-correo').value;
    const pass = document.getElementById('emp-pass').value;

    if (email === 'empresa@demo.com' && pass === 'demo123') {
        renderTablaEmpresa();
        mostrarPantalla('pantalla-empresa');
    } else {
        alert('Credenciales incorrectas. Use: empresa@demo.com / demo123');
    }
}

function renderTablaEmpresa() {
    const tbody = document.getElementById('tabla-usuarios');
    tbody.innerHTML = '';

    usuariosEmpresa.forEach((u, index) => {
        let claseBadge = 'plata';
        if (u.rango === 'Oro') claseBadge = 'oro';
        if (u.rango === 'Bronce') claseBadge = '';

        tbody.innerHTML += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.carrera}</td>
                <td><span class="badge ${claseBadge}">${u.rango}</span></td>
                <td><strong>${u.puntaje}</strong></td>
                <td><button class="btn btn-outline btn-small" onclick="verCvEmpresa(${index})">Ver CV</button></td>
            </tr>
        `;
    });
}

function verCvEmpresa(index) {
    const u = usuariosEmpresa[index];
    document.getElementById('cve-nombre').innerText = u.nombre.toUpperCase();
    document.getElementById('cve-carrera').innerText = u.carrera.toUpperCase();
    document.getElementById('cve-correo').innerText = u.correo;
    document.getElementById('cve-puntaje').innerText = u.puntaje;

    let claseBadge = 'plata';
    if (u.rango === 'Oro') claseBadge = 'oro';
    if (u.rango === 'Bronce') claseBadge = '';
    const b = document.getElementById('cve-badge');
    b.innerText = u.rango.toUpperCase();
    b.className = `badge ${claseBadge}`;

    document.getElementById('cve-recomendacion').innerText = `"${u.rec}"`;

    const lista = document.getElementById('cve-retos');
    lista.innerHTML = '';
    u.retos.forEach(r => {
        lista.innerHTML += `<li>${r}</li>`;
    });

    mostrarPantalla('pantalla-cv-empresa');
}

// =============================================
// EVENT LISTENERS (al cargar el DOM)
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Contador descripción
    const descripcionEl = document.getElementById('descripcion');
    if (descripcionEl) {
        descripcionEl.addEventListener('input', function () {
            const contador = document.getElementById('contador-desc');
            if (contador) contador.textContent = `${this.value.length}/300 caracteres`;
        });
    }

    // Limitar a 4 habilidades
    document.querySelectorAll('#checkboxes-habilidades input[type=checkbox]').forEach(cb => {
        cb.addEventListener('change', function () {
            const seleccionados = document.querySelectorAll('#checkboxes-habilidades input:checked');
            if (seleccionados.length > 4) {
                this.checked = false;
                alert('Puedes seleccionar máximo 4 habilidades.');
            }
        });
    });
});
