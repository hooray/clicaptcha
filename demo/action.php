<?php
	require('../clicaptcha.class.php');
	
	$clicaptcha = new clicaptcha();
	echo $clicaptcha->check($_POST['clicaptcha-submit-info']) ? '后端二次验证成功' : '后端二次验证失败';
?>