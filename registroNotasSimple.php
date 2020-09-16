<?php
 
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json; charset=utf-8');
header('P3P: CP="IDC DSP COR CURa ADMa OUR IND PHY ONL COM STA"');

  	include('./globaldatos.php');
  	//print_r($_REQUEST);

	$todo = json_decode($_REQUEST["param"], false, 512, JSON_UNESCAPED_UNICODE);

	$con = new Conectar();
	$connection = $con->conexion();
	$connection->set_charset("utf8");
	$queryValues="";
	$queryWheres="";

	function notas($nota){	

		if ($_POST["nota"]==="si") {	
			if ($nota > 69) {
				return "A";
			}else if ($nota == "SC") {
				return $nota;
			}else if ($nota == "SN") {
				return $nota;
			}else if ($nota < 70) {
				return "D";
			}
		}else{
			return $nota;
		}
	}

	if ($_POST["proceso"] == "insertar") {

		foreach($todo as $array) {

			$nota = notas($array->value);
			$nombre = preg_split("#\[(.*?)\]#", $array->name, null ,PREG_SPLIT_DELIM_CAPTURE);
		  	$queryValues .= "('".$nombre[1].$nombre[3]."', '".$nombre[1]."','".$nombre[3]."', '".$nota."'),";	  	
		}
		
		$query = "INSERT INTO `relacion-ficha-evs`(`id`,`idalumno`, `idevs`, `nota`) VALUES ".trim($queryValues, ',').";";
		$result = mysqli_query($connection, $query);

	}else{

		foreach($todo as $array) {

			$nota = notas($array->value);

			$nombre = preg_split("#\[(.*?)\]#", $array->name, null ,PREG_SPLIT_DELIM_CAPTURE);
		  	$queryValues .= "when id = ".$nombre[1].$nombre[3]." then '".$nota."' ";	 
		  	$queryWheres .= $nombre[1].$nombre[3].",";	  	
		}

		$query = "UPDATE `relacion-ficha-evs` SET nota = (case ".$queryValues." end) WHERE id in (".trim($queryWheres, ',').");";
		//echo "$query";
		$result = mysqli_query($connection, $query);

	}

	header('Content-type: application/json');
	if ($result) {
		echo json_encode("Notas inscritas o actualizadas correctamente.");
    	$connection->close();
	}else{
		echo json_encode($connection->error);
		//echo "error registroNotasSimple.php";
	}


?>