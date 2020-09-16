<?php

	global $config;
	include_once("configdatos.php");

/**
 * 
 */
class Conectar
{
	
	public static function conexion()
	{
		global $config,$data_sql;
		$data_sql = mysqli_connect($config["sql_host"], $config["sql_user"], $config["sql_pass"],$config["db_name"]);
		if (!$data_sql) die("Can't connect to MySql");
		return $data_sql;
	}
}


?>