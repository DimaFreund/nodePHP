<?php 
	include_once( dirname( __FILE__ ) . '/class/Database.class.php' );
	$pdo = Database::getInstance()->getPdoObject();
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta content="width=device-width, initial-scale=1.0" name="viewport">
		
		<title>NodeJS + PHP</title>
	
		<link rel="stylesheet" href="css/bootstrap.css" />
		<link rel="stylesheet" href="css/bootstrap-responsive.css" />
		
		<link rel="stylesheet" href="css/index.css" />
	</head>

	<body>
	

		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" ></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.5.2/pixi.min.js"></script>
		<script src="js/bootstrap.js"></script>
		<script src="js/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js"></script>
		<script src="js/nodeClient.js"></script>
	</body>
</html>