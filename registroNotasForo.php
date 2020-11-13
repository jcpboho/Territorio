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
//print_r($_REQUEST);	
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
	function querySelect($cc,$connection){
		$select="SELECT id FROM alumnos WHERE cc='$cc'";
		$result = mysqli_query($connection, $select);
		$result =mysqli_fetch_assoc($result);
		return $result["id"];
	}
	function queryInsert($idalumno,$idevs,$nota){
		$insert = "('".$idalumno.$idevs."', '".$idalumno."','".$idevs."', '".$nota."'),";
		return $insert;
	}


	if ($_POST["proceso"] == "insertar") {

			foreach($todo as $array) {

				$nota = notas($array->value);
				$idalumno = querySelect($array->cc,$connection);
			  	$queryValues .= queryInsert($idalumno, $_POST["evs"], $nota );
				  	
			}
		
		$query = "INSERT INTO `relacion-ficha-evs`(`id`,`idalumno`, `idevs`, `nota`) VALUES ".trim($queryValues, ',').";";
		$result = mysqli_query($connection, $query);

	}else{

		foreach($todo as $array) {

			$nota = notas($array->value);
			$idalumno = querySelect($array->cc,$connection);
		  	$queryValues .= "when id = ".$idalumno.$_POST["evs"]." then '".$nota."' ";	 
		  	$queryWheres .= $idalumno.$_POST["evs"].",";

		}

		$query = "UPDATE `relacion-ficha-evs` SET nota = (case ".$queryValues." end) WHERE id in (".trim($queryWheres, ',').");";
		$result = mysqli_query($connection, $query);

	}

    	$connection->close();
	header('Content-type: application/json');
	if ($result) {
		echo json_encode("Notas inscritas o actualizadas correctamente.");
	}else{
		echo json_encode($connection->error);
		//echo "error registroNotasSimple.php";
	}


?>
