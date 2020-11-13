<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json; charset=utf-8');
header('P3P: CP="IDC DSP COR CURa ADMa OUR IND PHY ONL COM STA"');

  include('./globaldatos.php');



 // $resultados = file_get_contents('php://input');

 // $todo = json_decode($resultados, true);
//print_r($_REQUEST["param"]);
  //$todo = json_decode($_REQUEST["param"]);

  //$ficha = preg_split("#\_([A-Z].*?)(.*?)\_#", $todo["periodo"]["id_externo"], null ,PREG_SPLIT_DELIM_CAPTURE);
  //$ficha = $ficha[2];
  $ficha = $_POST['ficha'];
  
  //$array = $todo["alumnos"];
  //print_r($_POST);
  $con = new Conectar();
  $connection = $con->conexion();
  $connection->set_charset("utf8");
  $queryValues="";
  //foreach ($array as $value) {
  while (list($clave, $value) = each($_REQUEST["param"])) {
     $id = $clave;
     $matricula = $value["matricula"];
     $nombre = $value["nombre"];
     $correo = $value["email"];
     $queryValues .="('".$id."', '".$matricula."', '".$nombre."', '".$ficha."', '".$correo."'),";

  }
  
  $query = "INSERT INTO `alumnos`(`id`, `cc`, `nombre`, `ficha`, `email`) VALUES ".trim($queryValues, ',').";";

  $result = mysqli_query($connection, $query);

      $connection->close();
  if ($result) {
    echo json_encode("Aprendices registrados");
    //echo $id.", $matricula, $nombre, $ficha";
  }else{
    echo json_encode($connection->error);
  }
 
?>
