<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json; charset=utf-8');
header('P3P: CP="IDC DSP COR CURa ADMa OUR IND PHY ONL COM STA"');

  include('./globaldatos.php');

	$todo = $_REQUEST["param"];
	//print_r($todo);

	$con = new Conectar();
	$connection = $con->conexion();
	$connection->set_charset("utf8");
  	$queryValues="";
	foreach($todo as $array) {
		$queryValues .= "('".$array["idEVS"]."', '".$array["nomEVS"]."','".$_POST["ficha"]."','".$_POST["tipo"]."'),";	  	
	}

  	$query = "INSERT INTO `evs`(`id`, `nombre`,`ficha`,`tipo`)	VALUES ".trim($queryValues, ',').";";

	$result = mysqli_query($connection, $query);

	if ($result) {
		echo json_encode(" Evidencias subidas");
    	$connection->close();
	}else{
		echo json_encode($connection->error);
	}

?>
