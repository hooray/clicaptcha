# clicaptcha
这是一个基于PHP的jQuery中文点击验证码插件

## 在线演示
[点击查看](http://captcha.oschina.mopaasapp.com/demo)

## 效果图
![](http://ww1.sinaimg.cn/large/60c18c1cgw1f1h52b5qzzj20bd09vjtf.jpg)

## 调用方式
```
<input type="hidden" id="clicaptcha-submit-info" name="clicaptcha-submit-info">
```
```
$('#clicaptcha-submit-info').clickCaptcha({
    src: '../clicaptcha.php',
	success_tip: '验证成功！',
	error_tip: '未点中正确区域，请重试！',
	callback: function(){
		//...
	}
});
```
```
//后端进行二次验证
require('../clicaptcha.class.php');
$clicaptcha = new clicaptcha();
echo $clicaptcha->check($_POST['clicaptcha-submit-info']) ? '后端二次验证成功' : '后端二次验证失败';
```