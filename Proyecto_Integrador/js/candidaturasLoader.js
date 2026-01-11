// Declaramos un objeto vacío que actuará como base de datos en memoria
// Esto será cambiado por los datos reales del JSON
// Cualquier clase JS podrá acceder a él
let BD = {}; 

// Este evennto se ejecuta cuando el HTML ya está cargado
document.addEventListener("DOMContentLoaded", () => {

    // Pedimos el archivo datos.json que contiene los datos iniciales
    fetch("../json/datos.json")
        // Convertimos el cuerpo de la promesa en un objeto JS
        .then(res => res.json())
        // Con el JSON convertido hacemos lo siguiente:
        .then(data => {
            // Asignamos a la variable global BD los datos obtenidos
            BD = data;

            // Cargar tabla de candidaturas
            if (BD.candidaturas) cargarCandidaturas(BD.candidaturas);

            // Informamos por consola
            console.log("Candidaturas cargadas:", BD.candidaturas);
        })
        // Capturamos cualquier error
        .catch(err => console.error("Error cargando JSON:", err));
});
