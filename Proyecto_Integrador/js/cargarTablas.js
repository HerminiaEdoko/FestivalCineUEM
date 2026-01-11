// JS que controla la formación de las tablas que se muestran en organizador.html

// Introducimos el código que genera los iconos que usamos para editar y eliminar en dos constantes
const ICONO_EDITAR = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"
stroke-linecap="round" stroke-linejoin="round" class="icon-edit">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
</svg>`;

// Icono para borrar elementos
const ICONO_BORRAR = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"
stroke-linecap="round" stroke-linejoin="round" class="icon-delete">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
</svg>`;


// FUNCIONES QUE CARGAN LAS TABLAS

// la función *cargarNoticias(noticias)* se ocupa de rellenar la tabla de NOTICIAS en *organizador.html*
function cargarNoticias(noticias) {
    // Asociamos la const tbody al elemento tbody del html con id "tabla-noticias"
    const tbody = document.getElementById("tabla_noticias");
    // Si no existe la tabla, la función se detiene
    if (!tbody) return; 
    // Limpiamos la tabla
    tbody.innerHTML = ""; 

    noticias.forEach(n => {
        // Creamos una fila
        const tr = document.createElement("tr"); 

        // Guardamos datos en dataset para usarlos al editar
        tr.dataset.id = n.id_noticia;
        tr.dataset.titulo = n.titulo;
        tr.dataset.descripcion = n.contenido;
        tr.dataset.fecha = n.fecha_publicacion;

        // Insertamos contenido HTML de la fila
        tr.innerHTML = `
            <td>${n.titulo}</td>
            <td>${n.contenido}</td>
            <td>${formatearFechaHora(n.fecha_publicacion)}</td>
            <td class="acciones">
                <button class="btn-editar">${ICONO_EDITAR}</button>
                <button class="btn-borrar">${ICONO_BORRAR}</button>
            </td>
        `;
        // Añadimos la fila a la tabla
        tbody.appendChild(tr); 
    });
}

// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// La función *cargarEventos(eventos)* funciona de igual manera que la anterior, variando su contenido, como es esperable
function cargarEventos(eventos) {
    const tbody = document.getElementById("tabla_eventos");
    if (!tbody) return;

    tbody.innerHTML = "";

    eventos.forEach(ev => {
        const tr = document.createElement("tr");

        tr.dataset.id = ev.id_evento;
        tr.dataset.fecha = ev.fecha;
        tr.dataset.titulo = ev.titulo;
        tr.dataset.descripcion = ev.descripcion;
        tr.dataset.hora = ev.hora;
        tr.dataset.lugar = ev.lugar;

        tr.innerHTML = `
            <td>${formatearFecha(ev.fecha)}</td>
            <td>${ev.titulo}</td>
            <td>${ev.descripcion}</td>
            <td class="acciones">
                <button class="btn-editar">${ICONO_EDITAR}</button>
                <button class="btn-borrar">${ICONO_BORRAR}</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// La función *cargarPremios(premios)* funciona de igual manera que la anterior, variando su contenido, como es esperable
function cargarPremios(premios) {
    const tbody = document.getElementById("tabla_premios");
    if (!tbody) return;

    tbody.innerHTML = "";

    premios.forEach(cat => {
        cat.premios.forEach((p, index) => {
            const tr = document.createElement("tr");

            // Guardamos datos útiles para edición
            tr.dataset.id_categoria = cat.id_categoria;
            tr.dataset.index = index;
            tr.dataset.categoria = cat.categoria;
            tr.dataset.puesto = p.puesto;
            tr.dataset.premio = p.premio;

            tr.innerHTML = `
                <td>${cat.categoria}</td>
                <td>${p.puesto}</td>
                <td>${p.premio}</td>
                <td class="acciones">
                    <button class="btn-editar">${ICONO_EDITAR}</button>
                    <button class="btn-borrar">${ICONO_BORRAR}</button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    });
}

// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// La función *cargarPatrocinadores(patrocinadores)* funciona de igual manera que la anterior, variando su contenido, como es esperable
function cargarPatrocinadores(patrocinadores) {
    const tbody = document.getElementById("tabla_patrocinadores");
    if (!tbody) return;

    tbody.innerHTML = "";

    patrocinadores.forEach(p => {
        const tr = document.createElement("tr");

        tr.dataset.id = p.id_patrocinador;
        tr.dataset.nombre = p.nombre;
        tr.dataset.logo = p.logo;
        tr.dataset.url = p.url;

        tr.innerHTML = `
            <td><img src="${p.logo}" width="80" alt="${p.nombre}"></td>
            <td>${p.nombre}</td>
            <td class="acciones">
                <button class="btn-editar">${ICONO_EDITAR}</button>
                <button class="btn-borrar">${ICONO_BORRAR}</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// La función *cargarGala(gala)* funciona de igual manera que la anterior, variando su contenido, como es esperable
function cargarGala(gala) {
    const tbody = document.getElementById("tabla_pregala");
    if (!tbody) return;

    tbody.innerHTML = "";

    // Ordenamos por hora (padStart asegura formato HH:MM)
    gala.sort((a, b) => {
        const hA = (a.hora || "").padStart(5, "0");
        const hB = (b.hora || "").padStart(5, "0");
        return hA.localeCompare(hB);
    });

    gala.forEach(g => {
        const tr = document.createElement("tr");

        tr.dataset.id = g.id_gala;
        tr.dataset.fecha = g.fecha;
        tr.dataset.hora = g.hora;
        tr.dataset.lugar = g.lugar;
        tr.dataset.tipo = g.tipo;
        tr.dataset.descripcion = g.descripcion;

        tr.innerHTML = `
            <td>${formatearFecha(g.fecha)}</td>
            <td>${g.hora}</td>
            <td>${g.lugar}</td>
            <td>${g.tipo}</td>
            <td class="acciones">
                <button class="btn-editar">${ICONO_EDITAR}</button>
                <button class="btn-borrar">${ICONO_BORRAR}</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// La función *cargarGanadoresDesdePremios(premios)* funciona de igual manera que la anterior, variando su contenido, como es esperable
function cargarGanadoresDesdePremios(premios) {
    const tbody = document.getElementById("tabla_ganadores");
    if (!tbody) return;

    tbody.innerHTML = "";

    premios.forEach(cat => {
        cat.premios.forEach((p, index) => {
            const tr = document.createElement("tr");

            tr.dataset.id_categoria = cat.id_categoria;
            tr.dataset.index = index;
            tr.dataset.categoria = cat.categoria;
            tr.dataset.puesto = p.puesto;
            tr.dataset.ganador = p.ganador || "";

            tr.innerHTML = `
                <td>${cat.categoria}</td>
                <td>${p.puesto}</td>
                <td>${p.ganador || "<em>Sin asignar</em>"}</td>
                <td class="acciones">
                    <button class="btn-editar">${ICONO_EDITAR}</button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    });
}

// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// Las siguientes funciones se utilizan para formatear fechas y horas

// Convierte "2025-01-10" en "10/01/2025"
function formatearFecha(fechaISO) {
    // Dividimos la cadena cada vez que se encuentra un guion
    const [y, m, d] = fechaISO.split("-");
    return `${d}/${m}/${y}`;
}

// Convierte "2025-01-10 18:30" en "10/01/2025 18:30"
function formatearFechaHora(fechaHora) {
    const [fecha, hora] = fechaHora.split(" ");
    return `${formatearFecha(fecha)} ${hora}`;
}
