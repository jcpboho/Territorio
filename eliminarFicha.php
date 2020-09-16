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
    
    $query = "DELETE  a, e 
              FROM `alumnos` a
               JOIN evs e 
                  ON a.ficha = e.ficha
              WHERE e.ficha = '$ficha'";

    $result = mysqli_query($connection, $query);

    if (mysqli_affected_rows($connection)>0) {
      echo json_encode(mysqli_affected_rows($connection));
    }else{      
      echo json_encode($connection->error);
    }

    
    $connection->close();

  }else{
    echo json_encode("No ha enviado datos.");
  }

?>
