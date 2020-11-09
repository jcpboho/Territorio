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
	$queryException="";

	function notas($nota){	

		if ($_POST["nota"]==="si") {	
			if ($nota > 69) {
				return "A";
			}else if ($nota == "SC") {
				return $nota;
			}else if ($nota == "RV") {
				return $nota;
			}else if ($nota < 70) {
				return "D";
			}
		}else{
			return $nota;
		}
	}

	function querySelect($exception,$connection){
		$select="SELECT id FROM alumnos WHERE ".$exception." and ficha = ".$_POST['ficha'];
		$result = mysqli_query($connection, $select);
		return $result;
	}	
	function querySelectExist($id,$connection){
		$select="SELECT count(*) count FROM alumnos WHERE id='$id'";
		$result = mysqli_query($connection, $select);
		$result =mysqli_fetch_assoc($result);
		return $result["count"];
	}

	if ($_POST["proceso"] == "insertar") {

		foreach($todo as $array) {

			$nota = notas($array->value);
			$alumno = $array->alumno;
			$evs = $array->evs;
			if (querySelectExist($alumno,$connection)!=0) {
			  	$queryValues .= "('".$alumno.$evs."', '".$alumno."','".$evs."', '".$nota."'),";	  
			  	$queryException .= " id != ".$alumno." and";	
			}  	
		}

		$querySelect=querySelect(trim($queryException, 'and'),$connection);
		
		while($resultSelect = mysqli_fetch_assoc($querySelect)) {

			$alumno = $resultSelect["id"];
			$evs = $_POST["evs"];
		  	$queryValues .= "('".$alumno.$evs."', '".$alumno."','".$evs."', 'SC'),";	
		}

		$query = "INSERT INTO `relacion-ficha-evs`(`id`,`idalumno`, `idevs`, `nota`) VALUES ".trim($queryValues, ',').";";
		//print_r($query);
		$result = mysqli_query($connection, $query);

	}else{

		foreach($todo as $array) {
			$nota = notas($array->value);
			$alumno = $array->alumno;
			$evs = $array->evs;
			if (querySelectExist($alumno,$connection)!=0) {
			  	$queryValues .= "when id = ".$alumno.$evs." then '".$nota."' ";	 
			  	$queryWheres .= $alumno.$evs.",";	
			  	$queryException .= " id != ".$alumno." and";
			}	  	  	
		}

		$querySelect=querySelect(trim($queryException, 'and'),$connection);
		

		while($resultSelect  = mysqli_fetch_assoc($querySelect)) {

			$alumno = $resultSelect["id"];
			$evs = $_POST["evs"];
			$queryValues .= "when id = ".$alumno.$evs." then 'SC' ";		
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
