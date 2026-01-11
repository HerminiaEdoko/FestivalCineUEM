<?php

// Comprobamos que el formulario se ha enviado correctamente
if (!isset($_POST['acceder'])) {
    echo "Acceso no permitido.";
    exit;
}

$usuario = $_POST['usuario'];
$passwd = $_POST['passwd'];

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "bd_festival");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// 1. BUSCAR EN TABLA ADMINS

$sql_admin = "SELECT usuario, passwd FROM admins WHERE usuario=?";
$stmt = $conexion->prepare($sql_admin);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result_admin = $stmt->get_result();

if ($result_admin->num_rows === 1) {

    $fila = $result_admin->fetch_assoc();
    $hash_guardado = $fila['passwd'];

    if (password_verify($passwd, $hash_guardado)) {
        // LOGIN CORRECTO COMO ADMIN
        header("Location: ../html/organizador.html");
        exit;
    } else {
        echo "Usuario o contraseña incorrectos";
        exit;
    }
}

// 2. BUSCAR EN TABLA PARTICIPANTES
$sql_part = "SELECT usuario, passwd FROM participantes WHERE usuario=?";
$stmt = $conexion->prepare($sql_part);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result_part = $stmt->get_result();

if ($result_part->num_rows === 1) {

    $fila = $result_part->fetch_assoc();
    $hash_guardado = $fila['passwd'];

    if (password_verify($passwd, $hash_guardado)) {
        // LOGIN CORRECTO COMO PARTICIPANTE
        header("Location: ../html/participante.html");
        exit;
    } else {
        echo "Usuario o contraseña incorrectos";
        exit;
    }
}

// 3. SI NO SE ENCUENTRA AL USUARIO EN NINGUNA TABLA:
echo "Usuario o contraseña incorrectos";

?>
