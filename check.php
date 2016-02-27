<?php
	function checkCaptcha($info, $unset = true){
		$flag = true;
		if(isset($_SESSION['click_captcha_text'])){
			$textArr = $_SESSION['click_captcha_text'];
			list($xy, $w, $h) = explode(';', $info);
			$xyArr = explode('-', $xy);
			$xpro = $w / $textArr['width'];//宽度比例
			$ypro = $h / $textArr['height'];//高度比例
			foreach($xyArr as $k => $v){
				$xy = explode(',', $v);
				$x = $xy[0];
				$y = $xy[1];
				if($x / $xpro < $textArr['text'][$k]['x'] || $x / $xpro > $textArr['text'][$k]['x'] + $textArr['text'][$k]['width']){
					$flag = false;
					break;
				}
				if($y / $ypro < $textArr['text'][$k]['y'] - $textArr['text'][$k]['height'] || $y / $ypro > $textArr['text'][$k]['y']){
					$flag = false;
					break;
				}
			}
			if($unset){
				unset($_SESSION['click_captcha_text']);
			}
		}else{
			$flag = false;
		}
		return $flag;
	}
?>