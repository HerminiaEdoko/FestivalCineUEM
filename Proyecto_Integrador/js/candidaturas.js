// JS que controla la utilidad de candidaturas.html

/* La variable *candidaturaSeleccionada* se declara siendo null. 
    Esta variable guardará la candidatura que se está gestionando en el POPUP
*/
let candidaturaSeleccionada = null;

// Guardamos el icono SVG para insertarlo al final de las filas
const ICONO_GESTION = `
<svg width="24" height="28" viewBox="0 0 24 28" fill="currentColor">
    <path d="M6 1h12a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"/>
    <path d="M8 6h8M8 10h8M8 14h5" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>


`;

// La función *cargarCandidaturas(candidaturas)* se ocupa de la creación de filas en la tabla de candidaturas
function cargarCandidaturas(candidaturas) {
    // Referencia al tbody en el que se pintarán las filas
    const tbody = document.getElementById("tabla_candidaturas");
    // Prevenimos por si el html no tiene la tabla, se detendría la función
    if (!tbody) return;

    // Limpiamos la tabla antes de pintar de nuevo
    tbody.innerHTML = "";

    // Iteramos cada candidatura 
    candidaturas.forEach(c => {
        // Creamos una fila por candidatura
        const tr = document.createElement("tr");
        // Insertamos con innerHTML las celdas
        tr.innerHTML = `
            <td>${c.categoria}</td>
            <td>${c.titulo_obra}</td>
            <td>${c.estado}</td>
            // En base al boolean, se imprime Sí o No
            <td>${c.id_premio_nominado ? "Sí" : "No"}</td>
            <td class="acciones">
                <button class="btn-gestionar" data-id="${c.id_candidatura}">
                    ${ICONO_GESTION}
                </button>
            </td>
        `;
        // Añadimos la fila
        tbody.appendChild(tr);
    });
}

// Escuchamos TODOS los clicks que se hagan en el documento
document.addEventListener("click", e => {
    /* Usamos e.target.closest() para buscar el elemento más cercano (él mismo, o un padre) 
       que cumpla con el selecto ".btn-gestionar"
       Como en este caso se hace click en el SVG, sube hasta el button
    */
    const btn = e.target.closest(".btn-gestionar");
    // Si el click no se hace en un botón de gestionar, no sucede nada
    if (!btn) return;
    /* Accedemos al atributo data-id="..." del botón.
        dataset convierte todos los datos data-* en propiedades JS.
        Como hicimos :
            <button class="btn-gestionar" data-id="${c.id_candidatura}">
                    ${ICONO_GESTION}
                </button>
        Ahora se convierte en btn.dataset.id
    */
    const id = btn.dataset.id;
    // Buscamos en el array la candidatura cuyo id concide con find() y devuelve el primer elemento que coincida
    candidaturaSeleccionada = BD.candidaturas.find(c => c.id_candidatura == id);


    // A continuación se rellena el POPUP con los datos de la candidatura
    // Datos principales
    document.getElementById("g_obra").textContent = candidaturaSeleccionada.titulo_obra;
    document.getElementById("g_participante").textContent = candidaturaSeleccionada.participante;
    document.getElementById("g_categoria").textContent = candidaturaSeleccionada.categoria;

    // Estado
    document.getElementById("g_estado").value = candidaturaSeleccionada.estado;

    // Feedback
    document.getElementById("g_feedback").value = candidaturaSeleccionada.mensaje_rechazo || "";

    // Checkbox de nominación
    document.getElementById("g_nominar").checked = candidaturaSeleccionada.id_premio_nominado !== null;

    // Función explicada a continuación
    actualizarVisibilidadCampos();

    // Usamos classList para manipular CSS de un elemento, eliminando su clase "oculto" para que se vea el popup
    document.getElementById("popupGestion").classList.remove("oculto");
});


// Cuando el select asociado al id #g_estado cambia, se ejecuta la siguiente función
document.getElementById("g_estado").addEventListener("change", actualizarVisibilidadCampos);

// La función *actualizarVisibilidadCampos()* se ocupa de alterar la visibilidad de diferentes campos del popup, según necesidad
function actualizarVisibilidadCampos() {
    // Referencia al valor del estado de la candidatura
    const estado = document.getElementById("g_estado").value;

    /* Usamos classList.toggle, que en este caso:
        Si la condición es true (estado !== "rechazada") añade la clase "oculto, sino, la quita"
    */
    document.getElementById("bloqueFeedback").classList.toggle("oculto", estado !== "rechazada");
    document.getElementById("bloqueNominar").classList.toggle("oculto", estado !== "aceptada");
}

// Referenciamos el botón de guardar los cambios de una gestión en una candidatura
document.getElementById("btnGuardarGestion").onclick = () => {
    const estado = document.getElementById("g_estado").value;

    // Validamos que en caso de haber mensaje de feedback necesariom se haya escrito algo
    if (estado === "rechazada" && document.getElementById("g_feedback").value.trim() === "") {
        alert("Debes indicar un motivo de rechazo.");
        // Si no hay motivo de rechazo escrito, se frena
        return;
    }

    // Guardar estado
    candidaturaSeleccionada.estado = estado;

    /* En caso de pasar a "rechazada" por algún motivo una candidatura que había sido nominada,
        se guarda el mensaje de rechazo y se pasa a null la nominación
    */
    if (estado === "rechazada") {
        candidaturaSeleccionada.mensaje_rechazo = document.getElementById("g_feedback").value.trim();
        candidaturaSeleccionada.id_premio_nominado = null;
    }

    // Si el estado de la candidatura pasa a ser aceptada, se vacía el mensaje de rechazp y se guarda el valor de la nominación 
    if (estado === "aceptada") {
        const nominar = document.getElementById("g_nominar").checked;
        candidaturaSeleccionada.id_premio_nominado = nominar ? true : null;
        candidaturaSeleccionada.mensaje_rechazo = "";
    }

    // Si una candidatura pasa a estar pendiente, se borra cualquier cambio realizado en esta
    if (estado === "pendiente") {
        candidaturaSeleccionada.id_premio_nominado = null;
        candidaturaSeleccionada.mensaje_rechazo = "";
    }

    // Se usa cargarCandidaturas para actualizar la tabla
    cargarCandidaturas(BD.candidaturas);
    // Por último, si todo ha ido bien, se oculta el POPUP
    document.getElementById("popupGestion").classList.add("oculto");
};

// En caso de hacer click en el btn de cerrar la gestión, se añade la clase oculto al popup
document.getElementById("btnCerrarGestion").onclick = () => {
    document.getElementById("popupGestion").classList.add("oculto");
};
