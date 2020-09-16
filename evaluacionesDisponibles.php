<?php
  header("Access-Control-Allow-Origin: *");
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
  header("Access-Control-Allow-Headers: X-Requested-With");
  header('Content-Type: application/json; charset=utf-8');
  header('P3P: CP="IDC DSP COR CURa ADMa OUR IND PHY ONL COM STA"');

  include('./globaldatos.php');

  if (isset($_POST["ficha"])) {  
    $ficha=$_POST["ficha"];
    //print_r($_POST);
    $con = new Conectar();
    $connection = $con->conexion();
    $connection->set_charset("utf8");
    
    $query = "SELECT id as ide FROM `evs` where tipo = 2 and ficha='$ficha'";
    $queryAlumnos = "SELECT id as ida FROM `alumnos` where ficha='$ficha'";

    $result = mysqli_query($connection, $query);
    $resultAlumnos = mysqli_query($connection, $queryAlumnos);
    
    $ide =[];
    $ida = [];
    //$json[] = $data['COUNT(*)'];

    while ($data = mysqli_fetch_assoc($result)) {
    
      $ide[] =$data["ide"];

    }

    while ($data = mysqli_fetch_assoc($resultAlumnos)) {
    
      $ida[] =$data["ida"];

    }
    echo json_encode([
                    'ide'    => $ide,
                    'ida'      => $ida
                ]);
    
    $connection->close();
  }else{
    echo json_encode("No ha enviado datos.");
  }

?>
