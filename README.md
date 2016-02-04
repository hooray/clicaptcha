# click-captcha
这是一个基于PHP的jQuery中文点击验证码插件

## 效果图
![](http://ww3.sinaimg.cn/large/60c18c1cgw1f0nz7i4jduj20e609c77j.jpg)

## 调用方式
```
$('#captcha').cliCaptcha({
	src: '../captcha.php',
	titleObj: '#title',
	refreshObj: '#refresh',
	revokeObj: '#revoke',
	successFunc: function(){
		alert('通过验证');
	},
	errorFunc: function(){
		alert('验证失败')
	}
});
```