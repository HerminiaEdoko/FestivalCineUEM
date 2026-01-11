//  CARGA DE JSON Y RELLENO DE TABLAS

let BD = {}; // Aquí guardamos toda la "BD" simulada

document.addEventListener("DOMContentLoaded", () => {

    fetch("../json/datos.json")
        .then(res => res.json())
        .then(data => {

            BD = data; // Guardamos el JSON entero en memoria

            // Cargar cada tabla según los datos del JSON
            if (BD.noticias) cargarNoticias(BD.noticias);
            if (BD.eventos) cargarEventos(BD.eventos);
            if (BD.premios) cargarPremios(BD.premios);
            if (BD.patrocinadores) cargarPatrocinadores(BD.patrocinadores);
            if (BD.gala) cargarGala(BD.gala);
            if (BD.premios) cargarGanadoresDesdePremios(BD.premios);


            console.log("Datos cargados desde JSON:", BD);
        })
        .catch(err => {
            console.error("Error cargando data.json:", err);
        });

});
