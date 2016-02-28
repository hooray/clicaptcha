<?php
	require('clicaptcha.class.php');
	
	$clicaptcha = new clicaptcha();
	if($_POST['do'] == 'check'){
		echo $clicaptcha->check($_POST['info'], false) ? 1 : 0;
	}else{
		$clicaptcha->creat();
	}
?>