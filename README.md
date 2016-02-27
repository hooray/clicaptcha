# click-captcha
这是一个基于PHP的jQuery中文点击验证码插件

## 在线演示
[点击查看](http://captcha.oschina.mopaasapp.com/demo)

## 效果图
![](http://ww1.sinaimg.cn/large/60c18c1cgw1f1e0mrqp12j20bh09v40h.jpg)

## 调用方式
```
$('#captcha').clickCaptcha({
	src: '../captcha.php',
	callback: function(){
		//...
	}
});
```