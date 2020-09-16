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
    
    $query = "SELECT count(*) as count FROM `fichas` where id='$ficha'";

    $result = mysqli_query($connection, $query);
    $json =array();
    //$json[] = $data['COUNT(*)'];


    echo json_encode(mysqli_fetch_assoc($result));
    
    $connection->close();
  }else{
    echo json_encode("No ha enviado datos.");
  }

?>
