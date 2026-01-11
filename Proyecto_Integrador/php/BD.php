<?php

// Base de Datos para Proyecto Integrador (sujeta a cambios)

/* Usamos ENGINE=InnoDB porque es el motor de almacenamiento y profesional de mySQL:
    - Queremos usar FK
    - Poder usar DELETE ON CASCADE
    - Garantiza integridad entre tablas
*/

$host = "localhost";
$user = "root";
$pass = "";
$dbName = "bd_festival";

$conexion = new mysqli($host, $user, $pass);

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Crear BD
$conexion->query("CREATE DATABASE IF NOT EXISTS $dbName");
$conexion->select_db($dbName);

// Función para crear las tablas
function crearTabla($conexion, $sql, $nombre) {
    if ($conexion->query($sql)) {
        echo "Tabla '$nombre' lista.<br>";
    } else {
        echo "Error creando '$nombre': " . $conexion->error . "<br>";
    }
}

// CREACIÓN DE TABLAS

// Admins
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS admins (
        id_admin INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(50) UNIQUE NOT NULL,
        passwd VARCHAR(255) NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        cargo VARCHAR(100)
    ) ENGINE=InnoDB;
", "admins");

// Ediciones
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS ediciones (
        id_edicion INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        anio INT NOT NULL,
        estado VARCHAR(20) NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL
    ) ENGINE=InnoDB;
", "ediciones");

// Participantes
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS participantes (
        id_participante INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(50) UNIQUE NOT NULL,
        passwd VARCHAR(255) NOT NULL,
        id_edicion INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        telefono VARCHAR(20),
        dni VARCHAR(20),
        expediente VARCHAR(20),
        fecha_registro DATETIME NOT NULL,
        FOREIGN KEY (id_edicion) REFERENCES ediciones(id_edicion)
    ) ENGINE=InnoDB;
", "participantes");


// Categorías
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS categorias (
        id_categoria INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT
    ) ENGINE=InnoDB;
", "categorias");

// Candidaturas
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS candidaturas (
        id_candidatura INT AUTO_INCREMENT PRIMARY KEY,
        id_participante INT NOT NULL,
        id_edicion INT NOT NULL,
        id_categoria INT NOT NULL,
        estado VARCHAR(20) NOT NULL,
        motivo_rechazo TEXT,
        fecha_creacion DATETIME NOT NULL,
        fecha_revision DATETIME,
        fecha_modificacion DATETIME,
        FOREIGN KEY (id_participante) REFERENCES participantes(id_participante),
        FOREIGN KEY (id_edicion) REFERENCES ediciones(id_edicion),
        FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
    ) ENGINE=InnoDB;
", "candidaturas");

// Obras
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS obras (
        id_obra INT AUTO_INCREMENT PRIMARY KEY,
        id_candidatura INT NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        sinopsis TEXT,
        ficha_tecnica TEXT,
        cartel VARCHAR(255),
        video VARCHAR(255),
        duracion INT,
        FOREIGN KEY (id_candidatura) REFERENCES candidaturas(id_candidatura)
    ) ENGINE=InnoDB;
", "obras");

// Noticias
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS noticias (
        id_noticia INT AUTO_INCREMENT PRIMARY KEY,
        id_admin INT NOT NULL,
        id_edicion INT NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        contenido TEXT NOT NULL,
        fecha_publicacion DATETIME NOT NULL,
        visible BOOLEAN NOT NULL,
        FOREIGN KEY (id_admin) REFERENCES admins(id_admin),
        FOREIGN KEY (id_edicion) REFERENCES ediciones(id_edicion)
    ) ENGINE=InnoDB;
", "noticias");

// Eventos
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS eventos (
        id_evento INT AUTO_INCREMENT PRIMARY KEY,
        id_admin INT NOT NULL,
        id_edicion INT NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        descripcion TEXT,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        lugar VARCHAR(150) NOT NULL,
        FOREIGN KEY (id_admin) REFERENCES admins(id_admin),
        FOREIGN KEY (id_edicion) REFERENCES ediciones(id_edicion)
    ) ENGINE=InnoDB;
", "eventos");

// Gala
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS gala (
        id_gala INT AUTO_INCREMENT PRIMARY KEY,
        id_edicion INT NOT NULL,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        lugar VARCHAR(150) NOT NULL,
        tipo VARCHAR(30) NOT NULL,
        descripcion TEXT,
        FOREIGN KEY (id_edicion) REFERENCES ediciones(id_edicion)
    ) ENGINE=InnoDB;
", "gala");

// Patrocinadores
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS patrocinadores (
        id_patrocinador INT AUTO_INCREMENT PRIMARY KEY,
        id_edicion INT NOT NULL,
        nombre VARCHAR(150) NOT NULL,
        logo VARCHAR(255),
        url VARCHAR(255),
        FOREIGN KEY (id_edicion) REFERENCES ediciones(id_edicion)
    ) ENGINE=InnoDB;
", "patrocinadores");

// Premios
crearTabla($conexion, "
    CREATE TABLE IF NOT EXISTS premios (
        id_premio INT AUTO_INCREMENT PRIMARY KEY,
        id_edicion INT NOT NULL,
        id_categoria INT NOT NULL,
        id_obra INT NOT NULL,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT,
        FOREIGN KEY (id_edicion) REFERENCES ediciones(id_edicion),
        FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
        FOREIGN KEY (id_obra) REFERENCES obras(id_obra)
    ) ENGINE=InnoDB;
", "premios");





// INSERCCIÓN DE DATOS INICIALES

// Crear edición inicial
$res = $conexion->query("SELECT COUNT(*) AS total FROM ediciones");
if ($res->fetch_assoc()['total'] == 0) {
    $conexion->query("
        INSERT INTO ediciones (nombre, anio, estado, fecha_inicio, fecha_fin)
        VALUES ('Edición 1', 2026, 'activa', '2026-01-10', '2026-01-15')
    ");
    echo "Edición inicial creada.<br>";
}

// Insertar admin y participante iniciales
$res = $conexion->query("SELECT COUNT(*) AS total FROM admins");
if ($res->fetch_assoc()['total'] == 0) {

    echo "Insertando usuarios iniciales...<br>";

    $hashAdmin = password_hash("admin123", PASSWORD_DEFAULT);
    $hashUser = password_hash("user123", PASSWORD_DEFAULT);

    // Insert admin
    $conexion->query("
        INSERT INTO admins (usuario, passwd, nombre, apellidos, email, cargo)
        VALUES ('admin', '$hashAdmin', 'Admin', 'Admin', 'admin@festival.com', 'Administrador')
    ");

    // Obtener edición
    $id_edicion = $conexion->query("SELECT id_edicion FROM ediciones LIMIT 1")->fetch_assoc()['id_edicion'];

    // Insert participante
    $fecha = date("Y-m-d H:i:s");
    $conexion->query("
        INSERT INTO participantes (usuario, passwd, id_edicion, nombre, apellidos, email, telefono, dni, expediente, fecha_registro)
        VALUES ('user', '$hashUser', $id_edicion, 'Participante', 'Participante', 'participante@festival.com',
                '123456789', '12345678A', 'EXP001', '$fecha')
    ");

    echo "Admin y participante creados.<br>";
}

echo "<br>Base de datos completamente lista.";
$conexion->close();
?>
