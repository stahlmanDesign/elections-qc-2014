<?php
	$dataString = json_decode($_REQUEST["dataToSave"], true);
	$fp = file_put_contents('data/data.json', json_encode($dataString));
?>