/* ============================================================
   CONFIGURACIÓN GLOBAL
   ============================================================ */
// Número telefónico de destino para los mensajes de reservas (ej. Colombia 573000000000)
const numeroWhatsApp = "573146838531";

// ============================================================
// PAGINACIÓN
// ============================================================

const EXPERIENCIAS_POR_PAGINA = 6;
let paginaActual = 1;
let experienciasFiltradas = [];
/* ============================================================
   FILTRAR EXPERIENCIAS
   ============================================================ */
function filtrarExperiencias() {

    const tipo = document.getElementById("tipo").value;
    const dificultad = document.getElementById("dificultad").value;
    const region = document.getElementById("region").value;

    const experiencias = Array.from(
        document.querySelectorAll(".experience")
    );

    experienciasFiltradas = experiencias.filter(function(experiencia) {

        const tipoRuta = experiencia.dataset.tipo;
        const dificultadRuta = experiencia.dataset.dificultad;
        const regionRuta = experiencia.dataset.region;

        const coincideTipo =
            tipo === "todos" || tipoRuta === tipo;

        const coincideDificultad =
            dificultad === "todos" || dificultadRuta === dificultad;

        const coincideRegion =
            region === "todos" || regionRuta === region;

        return coincideTipo &&
               coincideDificultad &&
               coincideRegion;
    });

    paginaActual = 1;

    actualizarPaginacion();

    document.getElementById("experiencias").scrollIntoView({
        behavior: "smooth"
    });
}

function actualizarPaginacion() {

    const noResults = document.getElementById("noResults");
    const pagination = document.getElementById("pagination");

    const totalExperiencias = experienciasFiltradas.length;

    // Ocultar todas las tarjetas
    document.querySelectorAll(".experience").forEach(function(experiencia) {
        experiencia.classList.add("hidden");
    });

    // Si no hay resultados
    if (totalExperiencias === 0) {

        noResults.classList.add("show");
        pagination.innerHTML = "";

        return;
    }

    noResults.classList.remove("show");

    // Calcular posiciones
    const inicio = (paginaActual - 1) * EXPERIENCIAS_POR_PAGINA;
    const fin = inicio + EXPERIENCIAS_POR_PAGINA;

    // Mostrar solamente las tarjetas de la página actual
    experienciasFiltradas
        .slice(inicio, fin)
        .forEach(function(experiencia) {

            experiencia.classList.remove("hidden");

        });

    // Número total de páginas
    const totalPaginas = Math.ceil(
        totalExperiencias / EXPERIENCIAS_POR_PAGINA
    );

    pagination.innerHTML = "";

    // Si solamente hay una página, no mostrar paginación
    if (totalPaginas <= 1) {
        return;
    }

    // Botón anterior
    const botonAnterior = document.createElement("button");

    botonAnterior.textContent = "‹";
    botonAnterior.className = "pagination-btn";

    if (paginaActual === 1) {
        botonAnterior.disabled = true;
    }

    botonAnterior.onclick = function() {

        if (paginaActual > 1) {
            paginaActual--;
            actualizarPaginacion();
        }

    };

    pagination.appendChild(botonAnterior);

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {

        const boton = document.createElement("button");

        boton.textContent = i;
        boton.className = "pagination-btn";

        if (i === paginaActual) {
            boton.classList.add("active");
        }

        boton.onclick = function() {

            paginaActual = i;

            actualizarPaginacion();

            document.getElementById("experiencias").scrollIntoView({
                behavior: "smooth"
            });

        };

        pagination.appendChild(boton);
    }

    // Botón siguiente
    const botonSiguiente = document.createElement("button");

    botonSiguiente.textContent = "›";
    botonSiguiente.className = "pagination-btn";

    if (paginaActual === totalPaginas) {
        botonSiguiente.disabled = true;
    }

    botonSiguiente.onclick = function() {

        if (paginaActual < totalPaginas) {
            paginaActual++;
            actualizarPaginacion();
        }

    };

    pagination.appendChild(botonSiguiente);
}


/* ============================================================
   MOSTRAR TODAS LAS EXPERIENCIAS
   ============================================================ */
function mostrarTodasLasExperiencias() {

    document.getElementById("tipo").value = "todos";
    document.getElementById("dificultad").value = "todos";
    document.getElementById("region").value = "todos";

    document.querySelectorAll(".category").forEach(function(categoria) {
        categoria.classList.remove("active");
    });

    experienciasFiltradas = Array.from(
        document.querySelectorAll(".experience")
    );

    paginaActual = 1;

    actualizarPaginacion();
}


/* ============================================================
   SELECCIONAR CATEGORÍA
   ============================================================ */
function seleccionarCategoria(categoria, elemento) {
    document.getElementById("tipo").value = categoria;

    document.querySelectorAll(".category").forEach(function(categoriaElemento) {
        categoriaElemento.classList.remove("active");
    });

    elemento.classList.add("active");
    filtrarExperiencias();
}


/* ============================================================
   CONTROL DEL MODAL
   ============================================================ */
function abrirModal(nombre, ubicacion, precio, dificultad, distancia, duracion, tipo, imagen, descripcion, incluye) {
    const modal = document.getElementById("experienceModal");

    document.getElementById("modalImage").src = imagen;
    document.getElementById("modalTitle").textContent = nombre;
    document.getElementById("modalLocation").textContent = "📍 " + ubicacion;
    document.getElementById("modalDescription").textContent = descripcion;
    document.getElementById("modalDistance").textContent = distancia;
    document.getElementById("modalDuration").textContent = duracion;
    document.getElementById("modalType").textContent = tipo;
    document.getElementById("modalPrice").textContent = "$" + precio;

    const difficulty = document.getElementById("modalDifficulty");
    if (dificultad === "facil") {
        difficulty.textContent = "🟢 FÁCIL";
    } else if (dificultad === "medio") {
        difficulty.textContent = "🟡 INTERMEDIO";
    } else {
        difficulty.textContent = "🔴 EXIGENTE";
    }

    const includes = document.getElementById("modalIncludes");
    includes.innerHTML = "";

    incluye.forEach(function(item) {
        const li = document.createElement("li");
        li.textContent = "✓ " + item;
        includes.appendChild(li);
    });

    const mensaje = `Hola Naturguía 👋\n\nEstoy interesado en esta experiencia:\n\n🌿 ${nombre}\n📍 ${ubicacion}\n💰 $${precio}\n\nQuisiera conocer las próximas fechas disponibles y cómo puedo reservar.`;
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    document.getElementById("whatsappButton").onclick = function() {
        window.open(urlWhatsApp, "_blank");
    };

    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function cerrarModal() {
    document.getElementById("experienceModal").classList.remove("active");
    document.body.classList.remove("modal-open");
}

/* Cierre con Tecla ESC y Clic fuera del Modal */
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        cerrarModal();
    }
});

document.getElementById("experienceModal").addEventListener("click", function(event) {
    if (event.target === this) {
        cerrarModal();
    }
});


/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
mostrarTodasLasExperiencias();