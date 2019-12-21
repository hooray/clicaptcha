# clicaptcha
这是一个基于PHP的jQuery中文点击验证码插件

## 效果图
![](https://i.loli.net/2019/12/21/MzK7hOwNWaBAC9v.png)

## 调用方式
```html
<input type="hidden" id="clicaptcha-submit-info" name="clicaptcha-submit-info">
```
```js
$('#clicaptcha-submit-info').clickCaptcha({
    src: '../clicaptcha.php',
	success_tip: '验证成功！',
	error_tip: '未点中正确区域，请重试！',
	callback: function(){
		//...
	}
});
```
```php
//后端进行二次验证
require('../clicaptcha.class.php');
$clicaptcha = new clicaptcha();
echo $clicaptcha->check($_POST['clicaptcha-submit-info']) ? '后端二次验证成功' : '后端二次验证失败';
```

## Vue 版
[vue-clicaptcha](https://github.com/hooray/vue-clicaptcha)