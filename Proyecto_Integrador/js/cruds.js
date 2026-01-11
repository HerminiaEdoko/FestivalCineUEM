// Este archivo JS se ocupa de determinar cómo funcionan los CRUD de las secciones de la web *organizador.html*

// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// ====================== CRUD NOTICIAS ======================

// Creamos un objeto que agrupa las funciones relacionadas con el CRUD de noticias
const Noticias = {

    // Creamos una propiedad que guarda el ID de la noticia que se está editando, al ser null, supondrá que se trata de una nueva noticia 
    editandoID: null,

    // La función *nueva()* se emplea para crear una noticia de cero 
    nueva() {

        // Aseguramos que editandoID sea null 
        this.editandoID = null;

        // Llamamos a la función abrir(), que está declarada en *popups.js*, usaremos más veces esto.
        // Añadimos el contenido necesario al popup
        Popup.abrir(
            "Nueva noticia",
            `
                <label>Título</label>
                <input type="text" id="noticia_titulo">

                <label>Descripción</label>
                <textarea id="noticia_contenido"></textarea>

                <label>Fecha publicación</label>
                <input type="datetime-local" id="noticia_fecha">
            `,
            // Guardamos la noticia, esta función también se encuentra declarada en *popups.js*
            () => this.guardar()
        );
    },

    // Creamos la función *editar()*, que recibe como parámetro una fila
    editar(tr) {
        // Seleccionamos la fila por su id generado en cargarNoticias(), que está declarada en *cargarTablas.js*
        this.editandoID = tr.dataset.id;

        Popup.abrir(
            "Editar noticia",
            `
                <label>Título</label>
                <input type="text" id="noticia_titulo" value="${tr.dataset.titulo}">

                <label>Descripción</label>
                <textarea id="noticia_contenido">${tr.dataset.descripcion}</textarea>

                <label>Fecha publicación</label>
                <input type="datetime-local" id="noticia_fecha" value="${this._convertirAInputDatetime(tr.dataset.fecha)}">
            `,
            () => this.guardar()
        );
    },

    // Creamos la función *guardar()*
    guardar() {
        // Limpiamos cualquier mensaje de error previo
        limpiarErrorPopup();

        // Recogemos los datos introducidos
        const titulo = document.getElementById("noticia_titulo").value.trim();
        const contenido = document.getElementById("noticia_contenido").value.trim();
        const fecha = document.getElementById("noticia_fecha").value;

        // Si algún campo no se ha rellenado se informa con la función a continuación 
        if (!titulo || !contenido || !fecha) {
            mostrarErrorPopup("Todos los campos son obligatorios.");
            return;
        }
        // Creamos la noticia
        if (this.editandoID === null) {
            BD.noticias.push({

                id_noticia: Date.now(),
                titulo,
                contenido,
                fecha_publicacion: fecha.replace("T", " ")
            });
            // Si ya 
        } else {
            const noticia = BD.noticias.find(n => n.id_noticia == this.editandoID);
            noticia.titulo = titulo;
            noticia.contenido = contenido;
            noticia.fecha_publicacion = fecha.replace("T", " ");
        }

        Popup.cerrar();
        cargarNoticias(BD.noticias);
    },

    borrar(tr) {
        const id = tr.dataset.id;
        const titulo = tr.dataset.titulo;

        Popup.abrir(
            "Eliminar noticia",
            `
                <p>¿Seguro que quieres eliminar la noticia <strong>"${titulo}"</strong>?</p>
                <p>Esta acción no se puede deshacer.</p>
            `,
            () => {
                BD.noticias = BD.noticias.filter(n => n.id_noticia != id);
                Popup.cerrar();
                cargarNoticias(BD.noticias);
            }
        );
    },

    // Función privada que convierye la fecha, eliminando los segundos si los hubiera
    _convertirAInputDatetime(fecha) {
        return fecha.replace(" ", "T").slice(0, 16);
    }
};

// DELEGACIÓN PARA NOTICIAS

// Cuando se pulsa el botón se abre el popup de nueva noticia
document.getElementById("abrirPopupNoticia").onclick = () => Noticias.nueva();

// Cuando se pulsa en los botones editar o borrar, se abren los popups correspondientes
document.addEventListener("click", e => {

    if (e.target.closest("#tabla_noticias .btn-editar")) {
        const tr = e.target.closest("tr");
        Noticias.editar(tr);
    }

    if (e.target.closest("#tabla_noticias .btn-borrar")) {
        const tr = e.target.closest("tr");
        Noticias.borrar(tr);
    }
});

// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// ====================== CRUD EVENTOS ======================

/* ESTA SECCIÓN FUNCIONA DE LA MISMA FORMA QUE LA ANTERIOR, 
PARA CUALQUIER DUDA COMPROBAR LOS COMENTARIOS DE CRUD NOTICIAS
*/
const Eventos = {

    editandoID: null,

    nueva() {
        this.editandoID = null;

        Popup.abrir(
            "Nuevo evento",
            `
                <label>Título</label>
                <input type="text" id="evento_titulo">

                <label>Descripción</label>
                <textarea id="evento_descripcion"></textarea>

                <label>Fecha</label>
                <input type="date" id="evento_fecha">

                <label>Hora</label>
                <input type="time" id="evento_hora">

                <label>Lugar</label>
                <input type="text" id="evento_lugar">
            `,
            () => this.guardar()
        );
    },

    editar(tr) {
        this.editandoID = tr.dataset.id;

        Popup.abrir(
            "Editar evento",
            `
                <label>Título</label>
                <input type="text" id="evento_titulo" value="${tr.dataset.titulo}">

                <label>Descripción</label>
                <textarea id="evento_descripcion">${tr.dataset.descripcion}</textarea>

                <label>Fecha</label>
                <input type="date" id="evento_fecha" value="${tr.dataset.fecha}">

                <label>Hora</label>
                <input type="time" id="evento_hora" value="${tr.dataset.hora}">

                <label>Lugar</label>
                <input type="text" id="evento_lugar" value="${tr.dataset.lugar}">
            `,
            () => this.guardar()
        );
    },

    guardar() {
        limpiarErrorPopup();

        const titulo = document.getElementById("evento_titulo").value.trim();
        const descripcion = document.getElementById("evento_descripcion").value.trim();
        const fecha = document.getElementById("evento_fecha").value;
        const hora = document.getElementById("evento_hora").value;
        const lugar = document.getElementById("evento_lugar").value.trim();

        if (!titulo || !descripcion || !fecha || !hora || !lugar) {
            mostrarErrorPopup("Todos los campos son obligatorios.");
            return;
        }

        if (this.editandoID === null) {
            BD.eventos.push({
                id_evento: Date.now(),
                titulo,
                descripcion,
                fecha,
                hora,
                lugar
            });
        } else {
            const evento = BD.eventos.find(ev => ev.id_evento == this.editandoID);
            evento.titulo = titulo;
            evento.descripcion = descripcion;
            evento.fecha = fecha;
            evento.hora = hora;
            evento.lugar = lugar;
        }

        Popup.cerrar();
        cargarEventos(BD.eventos);
    },

    borrar(tr) {
        const id = tr.dataset.id;
        const titulo = tr.dataset.titulo;

        Popup.abrir(
            "Eliminar evento",
            `
                <p>¿Seguro que quieres eliminar el evento <strong>"${titulo}"</strong>?</p>
                <p>Esta acción no se puede deshacer.</p>
            `,
            () => {
                BD.eventos = BD.eventos.filter(ev => ev.id_evento != id);
                Popup.cerrar();
                cargarEventos(BD.eventos);
            }
        );
    }
};


// DELEGACIÓN PARA EVENTOS


document.getElementById("abrirPopupEvento").onclick = () => Eventos.nueva();

document.addEventListener("click", e => {

    if (e.target.closest("#tabla_eventos .btn-editar")) {
        const tr = e.target.closest("tr");
        Eventos.editar(tr);
    }

    if (e.target.closest("#tabla_eventos .btn-borrar")) {
        const tr = e.target.closest("tr");
        Eventos.borrar(tr);
    }
});



// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// ====================== CRUD PREMIOS ======================

/* PARA NO EXPLICAR LO MISMO QUE EN LAS ANTERIORES VAMOS A EXPLICAR ESTA SECCIÓN DESGLOSANDO LAS DIFERENCIAS QUE TIENE CON 
LAS ANTERIORES:

Este CRUD NO GESTIONA una lista plana, sino una estructura como esta:

BD.premios = [
    {
        id_categoria,
        categoria,
        premios: [
            { puesto, premio, ganador }
        ]
    }
]

Cada fila de la tabla representa un PREMIO, de modo que para editar un premio necesitamos dos claves,
que son el id de la categoría y el "puesto" de ese premio (1º, 2º...).

Además, los cambios que se realizan en la tabla de premios deben reflejarse en la tabla de ganadores, ya que no
puede haber un ganador de un premio que no existe.


*/
const Premios = {

    // Estas propiedades permiten saber qué premio se está editando
    editandoCategoriaID: null,
    editandoPremioIndex: null,


    nuevaCategoria() {
        this.editandoCategoriaID = null;
        this.editandoPremioIndex = null;

        Popup.abrir(
            "Nueva categoría",
            `
                <label>Nombre de la categoría</label>
                <input type="text" id="categoria_nombre">

                <label>Puesto</label>
                <input type="text" id="premio_puesto" placeholder="1º, 2º, 3º...">

                <label>Premio</label>
                <input type="text" id="premio_valor" placeholder="100€, Trofeo...">
            `,
            () => this.guardarCategoria()
        );
    },

    guardarCategoria() {
        limpiarErrorPopup();

        const categoria = document.getElementById("categoria_nombre").value.trim();
        const puesto = document.getElementById("premio_puesto").value.trim();
        const premio = document.getElementById("premio_valor").value.trim();

        if (!categoria || !puesto || !premio) {
            mostrarErrorPopup("Todos los campos son obligatorios.");
            return;
        }

        BD.premios.push({
            id_categoria: Date.now(),
            categoria,
            premios: [
                { puesto, premio, ganador: "" }
            ]
        });

        Popup.cerrar();
        cargarPremios(BD.premios);
        cargarGanadoresDesdePremios(BD.premios);
    },

    editarPremio(tr) {

        // Para editar necesitamos ambas propiedades
        this.editandoCategoriaID = tr.dataset.id_categoria;
        this.editandoPremioIndex = tr.dataset.index;

        const categoria = BD.premios.find(c => c.id_categoria == this.editandoCategoriaID);
        const premio = categoria.premios[this.editandoPremioIndex];

        Popup.abrir(
            "Editar premio",
            `
                <label>Categoría</label>
                <input type="text" id="categoria_nombre" value="${categoria.categoria}" readonly>

                <label>Puesto</label>
                <input type="text" id="premio_puesto" value="${premio.puesto}">

                <label>Premio</label>
                <input type="text" id="premio_valor" value="${premio.premio}">
            `,
            () => this.guardarEdicion()
        );
    },

    guardarEdicion() {
        limpiarErrorPopup();

        const puesto = document.getElementById("premio_puesto").value.trim();
        const premio = document.getElementById("premio_valor").value.trim();

        if (!puesto || !premio) {
            mostrarErrorPopup("Todos los campos son obligatorios.");
            return;
        }

        const categoria = BD.premios.find(c => c.id_categoria == this.editandoCategoriaID);

        categoria.premios[this.editandoPremioIndex] = {
            puesto,
            premio,
            ganador: categoria.premios[this.editandoPremioIndex].ganador || ""
        };

        Popup.cerrar();
        cargarPremios(BD.premios);
    },

    borrarPremio(tr) {
        const id = tr.dataset.id_categoria;
        const index = tr.dataset.index;

        const categoria = BD.premios.find(c => c.id_categoria == id);
        const premio = categoria.premios[index];

        Popup.abrir(
            "Eliminar premio",
            `
            <p>¿Seguro que quieres eliminar el premio <strong>${premio.premio}</strong> (${premio.puesto})?</p>
        `,
            () => {
                categoria.premios.splice(index, 1);

                // Si la categoría se queda sin premios → eliminar categoría entera
                // if (categoria.premios.length === 0) {
                //     BD.premios = BD.premios.filter(c => c.id_categoria != id);
                // }

                Popup.cerrar();


                cargarPremios(BD.premios);
                cargarGanadoresDesdePremios(BD.premios);
            }
        );
    }

};

// DELEGACIÓN PARA PREMIOS
document.getElementById("btnCrearCategoria").onclick = () => Premios.nuevaCategoria();

document.addEventListener("click", e => {


    if (e.target.closest("#tabla_premios .btn-editar")) {
        const tr = e.target.closest("tr");
        Premios.editarPremio(tr);
    }

    if (e.target.closest("#tabla_premios .btn-borrar")) {
        const tr = e.target.closest("tr");
        Premios.borrarPremio(tr);
    }
});

// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// ====================== CRUD GANADORES ======================

// Ya hemos comentado que esta sección está fuertemente vinculada con la sección de premios. Reseñamos lo importante


const Ganadores = {

    editar(tr) {

        const id = tr.dataset.id_categoria;
        const index = tr.dataset.index;


        // Aquí apreciamos que realmente ganadores no es una tabla en sí misma, sino una "vista" de BD.premios
        const categoria = BD.premios.find(c => c.id_categoria == id);
        const premio = categoria.premios[index];

        Popup.abrir(
            "Asignar ganador",
            `
                <p><strong>Categoría:</strong> ${categoria.categoria}</p>
                <p><strong>Puesto:</strong> ${premio.puesto}</p>

                <label>Ganador (obra)</label>
                <input type="text" id="ganador_nombre" value="${premio.ganador || ""}">
            `,
            () => this.guardar(id, index)
        );
    },

    guardar(id, index) {
        limpiarErrorPopup();

        const ganador = document.getElementById("ganador_nombre").value.trim();

        if (!ganador) {
            mostrarErrorPopup("Debes introducir un ganador.");
            return;
        }

        const categoria = BD.premios.find(c => c.id_categoria == id);
        // Así guardamos el nombre del ganador
        // A futuro, querríamos modificar esta forma de hacerlo por un select, de modo que sea más cómodo para el usuario
        categoria.premios[index].ganador = ganador;

        Popup.cerrar();
        cargarGanadoresDesdePremios(BD.premios);
    }
};



// DELEGACIÓN PARA GANADORES
document.addEventListener("click", e => {

    if (e.target.closest("#tabla_ganadores .btn-editar")) {
        const tr = e.target.closest("tr");
        Ganadores.editar(tr);
    }
});

// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// CRUD PATROCINADORES

/* Esta sección es muy similar a las secciones que ya hemos visto, de todos modos, aclaramos una cuestión sobre su funcionalidad:

    En este momento solo se necesita introducir el nombre del patrocinador y el link a su logo.
    A futuro esto será validado correctamente con formato de imagen, o validando el inicio de la URL http: o https:
    Añadiremos una previsualización del logo en el popup
*/
const Patrocinadores = {

    editandoID: null,

    nueva() {
        this.editandoID = null;

        Popup.abrir(
            "Nuevo patrocinador",
            `
                <label>Nombre</label>
                <input type="text" id="patro_nombre">

                <label>URL del logo</label>
                <input type="text" id="patro_logo" placeholder="https://...">
            `,
            () => this.guardar()
        );
    },

    editar(tr) {
        this.editandoID = tr.dataset.id;

        Popup.abrir(
            "Editar patrocinador",
            `
                <label>Nombre</label>
                <input type="text" id="patro_nombre" value="${tr.dataset.nombre}">

                <label>URL del logo</label>
                <input type="text" id="patro_logo" value="${tr.dataset.logo}">
            `,
            () => this.guardar()
        );
    },

    guardar() {
        limpiarErrorPopup();

        const nombre = document.getElementById("patro_nombre").value.trim();
        const logo = document.getElementById("patro_logo").value.trim();

        if (!nombre || !logo) {
            mostrarErrorPopup("Todos los campos son obligatorios.");
            return;
        }


        if (this.editandoID === null) {
            BD.patrocinadores.push({
                id_patrocinador: Date.now(),
                nombre,
                logo
            });
        }

        else {
            const p = BD.patrocinadores.find(x => x.id_patrocinador == this.editandoID);
            p.nombre = nombre;
            p.logo = logo;
        }

        Popup.cerrar();
        cargarPatrocinadores(BD.patrocinadores);
    },

    borrar(tr) {
        const id = tr.dataset.id;
        const nombre = tr.dataset.nombre;

        Popup.abrir(
            "Eliminar patrocinador",
            `
                <p>¿Seguro que quieres eliminar <strong>"${nombre}"</strong>?</p>
                <p>Esta acción no se puede deshacer.</p>
            `,
            () => {
                BD.patrocinadores = BD.patrocinadores.filter(p => p.id_patrocinador != id);
                Popup.cerrar();
                cargarPatrocinadores(BD.patrocinadores);
            }
        );
    }
};


// DELEGACIÓN PARA PATROCINADORES

document.getElementById("abrirPopUpPatrocinadores").onclick = () => Patrocinadores.nueva();

document.addEventListener("click", e => {

    if (e.target.closest("#tabla_patrocinadores .btn-editar")) {
        const tr = e.target.closest("tr");
        Patrocinadores.editar(tr);
    }

    if (e.target.closest("#tabla_patrocinadores .btn-borrar")) {
        const tr = e.target.closest("tr");
        Patrocinadores.borrar(tr);
    }
});



// ======================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------
// ======================================================================================================================

// ====================== CRUD GALA ======================

/* ESTA SECCIÓN FUNCIONA DE LA MISMA FORMA QUE LA MAYORÍA, 
PARA CUALQUIER DUDA COMPROBAR LOS COMENTARIOS DE CRUD NOTICIAS
*/
const Gala = {

    editandoID: null,

    nueva() {
        this.editandoID = null;

        Popup.abrir(
            "Nueva sección de gala",
            `
                <label>Título / Tipo de sección</label>
                <input type="text" id="gala_tipo">

                <label>Fecha</label>
                <input type="date" id="gala_fecha">

                <label>Hora</label>
                <input type="time" id="gala_hora">

                <label>Sala / Lugar</label>
                <input type="text" id="gala_lugar">

                <label>Descripción</label>
                <textarea id="gala_descripcion"></textarea>
            `,
            () => this.guardar()
        );
    },

    editar(tr) {
        this.editandoID = tr.dataset.id;

        Popup.abrir(
            "Editar sección de gala",
            `
                <label>Título / Tipo de sección</label>
                <input type="text" id="gala_tipo" value="${tr.dataset.tipo}">

                <label>Fecha</label>
                <input type="date" id="gala_fecha" value="${tr.dataset.fecha}">

                <label>Hora</label>
                <input type="time" id="gala_hora" value="${tr.dataset.hora}">

                <label>Sala / Lugar</label>
                <input type="text" id="gala_lugar" value="${tr.dataset.lugar}">

                <label>Descripción</label>
                <textarea id="gala_descripcion">${tr.dataset.descripcion}</textarea>
            `,
            () => this.guardar()
        );
    },

    guardar() {
        limpiarErrorPopup();

        const tipo = document.getElementById("gala_tipo").value.trim();
        const fecha = document.getElementById("gala_fecha").value;
        const hora = document.getElementById("gala_hora").value;
        const lugar = document.getElementById("gala_lugar").value.trim();
        const descripcion = document.getElementById("gala_descripcion").value.trim();

        if (!tipo || !fecha || !hora || !lugar || !descripcion) {
            mostrarErrorPopup("Todos los campos son obligatorios.");
            return;
        }

        // NUEVA
        if (this.editandoID === null) {
            BD.gala.push({
                id_gala: Date.now(),
                tipo,
                fecha,
                hora,
                lugar,
                descripcion
            });
        }

        // EDITAR
        else {
            const s = BD.gala.find(g => g.id_gala == this.editandoID);
            s.tipo = tipo;
            s.fecha = fecha;
            s.hora = hora;
            s.lugar = lugar;
            s.descripcion = descripcion;
        }

        Popup.cerrar();
        cargarGala(BD.gala);
    },

    borrar(tr) {
        const id = tr.dataset.id;
        const tipo = tr.dataset.tipo;

        Popup.abrir(
            "Eliminar sección de gala",
            `
                <p>¿Seguro que quieres eliminar la sección <strong>"${tipo}"</strong>?</p>
                <p>Esta acción no se puede deshacer.</p>
            `,
            () => {
                BD.gala = BD.gala.filter(g => g.id_gala != id);
                Popup.cerrar();
                cargarGala(BD.gala);
            }
        );
    }
};

document.getElementById("abrirPopupSeccionPregala").onclick = () => Gala.nueva();

document.addEventListener("click", e => {

    if (e.target.closest("#tabla_pregala .btn-editar")) {
        const tr = e.target.closest("tr");
        Gala.editar(tr);
    }

    if (e.target.closest("#tabla_pregala .btn-borrar")) {
        const tr = e.target.closest("tr");
        Gala.borrar(tr);
    }
});
