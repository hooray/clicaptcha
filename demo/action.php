<?php
	header("Content-type: text/html; charset=utf-8");
	require('../check.php');
	
	session_start();
	error_reporting(E_ERROR | E_WARNING | E_PARSE);
	
	echo checkCaptcha($_POST['click-captcha-submit-info']) ? '后端二次验证成功' : '后端二次验证失败';
?>