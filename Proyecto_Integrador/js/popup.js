// Este archivo JS se ocupa del funcionamiento del popup de *organizador.html*

// Guardamos referencias a los elementos del popup
const Popup = {
    overlay: document.getElementById("popup_global"),
    titulo: document.getElementById("popup_titulo"),
    contenido: document.getElementById("popup_contenido"),
    btnGuardar: document.getElementById("popup_guardar"),
    btnCancelar: document.getElementById("popup_cancelar"),
    btnCerrar: document.getElementById("popup_cerrar"),

    // Función abrir:
    abrir(titulo, htmlContenido, onSave) {
        // Se establece un título
        this.titulo.textContent = titulo;
        // Se añade un div para que aparezca en caso de errores
        // htmlContenido puede ser cualquier formulario de cualquier CRUD
        this.contenido.innerHTML = `
            <div id="popup_error" class="popup-error oculto"></div>
            ${htmlContenido}
        `;

        // El popup NO SABE qué está guardando de por sí, solo ejecuta la función que se le pasa
        this.btnGuardar.onclick = onSave;

        // El estilo del botón cambia en base al título
        if (titulo.toLowerCase().includes("eliminar") || titulo.toLowerCase().includes("borrar")) {
            this.btnGuardar.textContent = "Eliminar";
            this.btnGuardar.classList.add("btnPeligro");
        } else {
            this.btnGuardar.textContent = "Guardar";
            this.btnGuardar.classList.remove("btnPeligro");
        }

        // Se muestra el popup al cambiar su clase a "active"
        this.overlay.classList.add("active");
    },


    // La función cerrar quita "active" de la clase
    cerrar() {
        this.overlay.classList.remove("active");
    }
};

// Ambos botones cierran el popup
Popup.btnCancelar.onclick = () => Popup.cerrar();
Popup.btnCerrar.onclick = () => Popup.cerrar();

// En caso de error, se muestra el mensaje dentro del div de error
function mostrarErrorPopup(msg) {
    const div = document.getElementById("popup_error");
    div.textContent = msg;
    div.classList.remove("oculto");
}

// Se limpia el mensaje de error 
function limpiarErrorPopup() {
    const div = document.getElementById("popup_error");
    div.textContent = "";
    div.classList.add("oculto");
}
