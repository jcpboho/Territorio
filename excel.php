<?php

  	include('./globaldatos.php');

  	$con = new Conectar();
  	$connection = $con->conexion();
	$connection->set_charset("utf8");

	if (isset($_POST["ficha"])) {
		$ficha = $_POST["ficha"];
		$fecha = $_POST["fecha"];

		header("Access-Control-Allow-Origin: *");
		header('Access-Control-Allow-Credentials: true');
		header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
		header("Access-Control-Allow-Headers: X-Requested-With");
		header('Content-type: application/vnd.ms-excel;charset=UTF-8');
		header('Content-Disposition: attachment; filename='.$ficha.$fecha.'.xls');
		
	  
		$queryNotas = "SELECT a.id, a.email, a.cc, a.nombre, r.nota, r.idevs, e.nombre as evidencia FROM `alumnos` a inner join `relacion-ficha-evs` r on r.idalumno = a.id inner join `evs` e on r.idevs = e.id  where a.ficha = $ficha ORDER BY a.id ASC, r.idevs ASC";

		$queryColumnas = "SELECT * FROM `evs` where ficha = $ficha  ORDER BY id" ;

		$queryCount = "SELECT count(*) as cantidad FROM `evs` where ficha = $ficha";

		$resultColumnas = mysqli_query($connection, $queryColumnas);


		$resultFilas = mysqli_query($connection, $queryNotas);



		$resultCount = mysqli_query($connection, $queryCount);
		$dataCount = mysqli_fetch_assoc($resultCount)

	?>

	<meta charset = "UTF-8">



	<table border="1" cellpadding="2" cellspacing="0" width="100%">
	    <caption style="font-size: 150%; font-weight: bold;"><?php echo $ficha; ?> - Reporte de Calificaciones -<?php echo $fecha; ?></caption>
	    <tr>
	        <td style="background-color: #08c;color: white">Cc</td>
	        <td style="background-color: #08c;color: white">Aprendiz</td>
	        <td style="background-color: #08c;color: white">Correo</td>

			<?php
		  	while ($data = mysqli_fetch_assoc($resultColumnas)) {
			?>
	        	<td style="background-color: #08c;width: 65px; font-size: 10px;font-family: auto; color: white"><?= $data["Nombre"];?></td>
			<?php
		  	}
			?>
	    </tr>

	   
    	<?php
    	$numero = 1;
	  	while ($data = mysqli_fetch_assoc($resultFilas)) {

	  		if($numero == 1){
		?>
			    <tr>
			        
			        <td><?= $data["cc"];?></td>
			        <td style="font-size: 10px;"><?= $data["nombre"];?></td>
			        <td style="font-size: 10px;"><?= $data["email"];?></td>

			        <?php 
			        if ($data["nota"] == "A" || $data["nota"] >= 70) {
			        ?>
			        	<td style="background-color: #92D050"><?= $data["nota"];?></td>	
					<?php 
			        }else if ($data["nota"] == "SC") {
			       	?>
						<td style="background-color: #FFF2CC"><?= $data["nota"];?></td>	
			        <?php 
			        }else if ($data["nota"] == "SN") {
			       	?>
						<td style="background-color: #00B0F0"><?= $data["nota"];?></td>	
			        <?php 
			        }else if ($data["nota"] == "RV") {
			       	?>
						<td style="background-color: #FFBE33"><?= $data["nota"];?></td>	
			        <?php 
			        }else if ($data["nota"] == "D" || $data["nota"] < 70) {
			       	?>
						<td style="background-color: #FF3300"><?= $data["nota"];?></td>	
					<?php 
			        }?>		        
	        <?php 
	        	$numero++;
	        }else if ($numero == $dataCount["cantidad"]){
	        ?>

			        <?php 
			        if ($data["nota"] == "A" || $data["nota"] >= 70) {
			        ?>
			        	<td style="background-color: #92D050"><?= $data["nota"];?></td>	
					<?php 
			        }else if ($data["nota"] == "SC") {
			       	?>
						<td style="background-color: #FFF2CC"><?= $data["nota"];?></td>	
			        <?php 
			        }else if ($data["nota"] == "SN") {
			       	?>
						<td style="background-color: #00B0F0"><?= $data["nota"];?></td>	
			        <?php 
			        }else if ($data["nota"] == "RV") {
			       	?>
						<td style="background-color: #FFBE33"><?= $data["nota"];?></td>	
			        <?php 
			        }else if ($data["nota"] == "D" || $data["nota"] < 70) {
			       	?>
						<td style="background-color: #FF3300"><?= $data["nota"];?></td>	
					<?php 
			        }?>	
	    		</tr>	
			         
	        <?php 

	        	$numero=1;
	    	}else{
	    	?>
			        <?php 
			        if ($data["nota"] == "A" || $data["nota"] >= 70) {
			        ?>
			        	<td style="background-color: #92D050"><?= $data["nota"];?></td>	
					<?php 
			        }else if ($data["nota"] == "SC") {
			       	?>
						<td style="background-color: #FFF2CC"><?= $data["nota"];?></td>	
			        <?php 
			        }else if ($data["nota"] == "SN") {
			       	?>
						<td style="background-color: #00B0F0"><?= $data["nota"];?></td>	
			        <?php 
			        }else if ($data["nota"] == "RV") {
			       	?>
						<td style="background-color: #FFBE33"><?= $data["nota"];?></td>	
			        <?php 
			        }else if ($data["nota"] == "D" || $data["nota"] < 70) {
			       	?>
						<td style="background-color: #FF3300"><?= $data["nota"];?></td>	
					<?php 
			        }?>	
	    	<?php 

	        	$numero++;
	    	}
	    	?>

		<?php
	  	}
		?>

	</table>

	<?php 
	
    $connection->close();
	} 
	?>
