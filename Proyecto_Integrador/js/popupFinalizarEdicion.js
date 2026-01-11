// Este JS se ocupa del funcionamiento del popup que aparece cuando queremos finalizar la edición actual
// Esta sección está de alguna forma en construcción porque no sabemos cómo se van a gestionar imágenes, también nos pasa con
// los logos de los patrocinadores.


const PopupFinalizar = {

    // Referencia a los elementos del popup
    overlay: document.getElementById("popup_finalizar"),
    inputAnio: document.getElementById("finalizar_anio"),
    divPremios: document.getElementById("finalizar_premios_lista"),
    textareaResumen: document.getElementById("finalizar_resumen"),
    inputImagenes: document.getElementById("finalizar_imagenes"),
    listaImagenes: document.getElementById("finalizar_imagenes_lista"),
    btnGuardar: document.getElementById("popup_finalizar_guardar"),
    btnCancelar: document.getElementById("popup_finalizar_cancelar"),
    btnCerrar: document.getElementById("cerrarPopupFinalizar"),

    // Función abrir
    abrir() {
        // Año de la edición
        const anio = this._calcularAnioEdicion();
        this.inputAnio.value = anio;

        // Premios otorgados
        const premiosOtorgados = this._obtenerPremiosOtorgados();
        this._pintarPremios(premiosOtorgados);

        // Limpiar campos opcionales
        this.textareaResumen.value = "";
        this.inputImagenes.value = "";
        this.listaImagenes.innerHTML = "";

        this.overlay.classList.add("active");
    },

    // Función cerrar
    cerrar() {
        this.overlay.classList.remove("active");
    },

    // Función privada que calcula el año de la edición en la que estamos trabajando
    _calcularAnioEdicion() {
        if (BD.gala && BD.gala.length > 0 && BD.gala[0].fecha) {
            return BD.gala[0].fecha.substring(0, 4);
        }
        return new Date().getFullYear();
    },

    // Función privada que recoge los premios que han sido asignados
    _obtenerPremiosOtorgados() {
        const categorias = BD.premios || [];
        const resultado = [];

        categorias.forEach(cat => {
            cat.premios.forEach(p => {
                if (p.ganador && p.ganador.trim() !== "") {
                    resultado.push({
                        categoria: cat.categoria,
                        puesto: p.puesto,
                        ganador: p.ganador
                    });
                }
            });
        });

        return resultado;
    },

    // Función privada que pinta los premios en el popup, en caso de haber
    _pintarPremios(premios) {
        // Si no se asignases premios:
        if (!premios.length) {
            this.divPremios.innerHTML = `<p>No hay premios con ganador asignado todavía.</p>`;
            return;
        }

        const html = premios.map(p => `
            <div class="premio-item">
                <div><strong>Categoría:</strong> ${p.categoria}</div>
                <div><strong>Puesto:</strong> ${p.puesto}</div>
                <div><strong>Ganador:</strong> ${p.ganador}</div>
            </div>
        `).join("");

        this.divPremios.innerHTML = html;
    },

    // Función para mostrar las imñagenes subidas
    _actualizarListaImagenes() {
        const files = Array.from(this.inputImagenes.files || []);
        this.listaImagenes.innerHTML = files
            .map(f => `<li>${f.name}</li>`)
            .join("");
    },

    // Función para guardar
    guardar() {
        const anio = this.inputAnio.value.trim();
        const resumenTexto = this.textareaResumen.value.trim();
        const archivos = Array.from(this.inputImagenes.files || []);

        const premiosOtorgados = this._obtenerPremiosOtorgados();

        const resumenEdicion = {
            anio,
            resumen: resumenTexto || null,
            premios_otorgados: premiosOtorgados,
            imagenes: archivos.map(f => ({
                nombre: f.name,
                tipo: f.type,
                tamaño: f.size
            }))
        };

        console.log("RESUMEN EDICIÓN CERRADA:", resumenEdicion);

        alert("Datos de la edición recogidos correctamente (ver consola).");
        this.cerrar();
    }
};


// EVENTOS DEL POPUP FINALIZAR

document.getElementById("abrirPopupFinalizar").onclick = () => PopupFinalizar.abrir();

PopupFinalizar.btnCancelar.onclick = () => PopupFinalizar.cerrar();
PopupFinalizar.btnCerrar.onclick = () => PopupFinalizar.cerrar();

PopupFinalizar.inputImagenes.addEventListener("change", () => {
    PopupFinalizar._actualizarListaImagenes();
});

PopupFinalizar.btnGuardar.onclick = () => PopupFinalizar.guardar();
