/**
 * js-cookie v2.1.0
 * https://github.com/js-cookie/js-cookie
 */
 (function(factory){if(typeof define==='function'&&define.amd){define(factory)}else if(typeof exports==='object'){module.exports=factory()}else{var _OldCookies=window.Cookies;var api=window.Cookies=factory();api.noConflict=function(){window.Cookies=_OldCookies;return api}}}(function(){function extend(){var i=0;var result={};for(;i<arguments.length;i++){var attributes=arguments[i];for(var key in attributes){result[key]=attributes[key]}}return result}function init(converter){function api(key,value,attributes){var result;if(arguments.length>1){attributes=extend({path:'/'},api.defaults,attributes);if(typeof attributes.expires==='number'){var expires=new Date();expires.setMilliseconds(expires.getMilliseconds()+attributes.expires*864e+5);attributes.expires=expires}try{result=JSON.stringify(value);if(/^[\{\[]/.test(result)){value=result}}catch(e){}if(!converter.write){value=encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent)}else{value=converter.write(value,key)}key=encodeURIComponent(String(key));key=key.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent);key=key.replace(/[\(\)]/g,escape);return(document.cookie=[key,'=',value,attributes.expires&&'; expires='+attributes.expires.toUTCString(),attributes.path&&'; path='+attributes.path,attributes.domain&&'; domain='+attributes.domain,attributes.secure?'; secure':''].join(''))}if(!key){result={}}var cookies=document.cookie?document.cookie.split('; '):[];var rdecode=/(%[0-9A-Z]{2})+/g;var i=0;for(;i<cookies.length;i++){var parts=cookies[i].split('=');var name=parts[0].replace(rdecode,decodeURIComponent);var cookie=parts.slice(1).join('=');if(cookie.charAt(0)==='"'){cookie=cookie.slice(1,-1)}try{cookie=converter.read?converter.read(cookie,name):converter(cookie,name)||cookie.replace(rdecode,decodeURIComponent);if(this.json){try{cookie=JSON.parse(cookie)}catch(e){}}if(key===name){result=cookie;break}if(!key){result[name]=cookie}}catch(e){}}return result}api.get=api.set=api;api.getJSON=function(){return api.apply({json:true},[].slice.call(arguments))};api.defaults={};api.remove=function(key,attributes){api(key,'',extend(attributes,{expires:-1}))};api.withConverter=init;return api}return init(function(){})}));

(function($){
	$.fn.extend({
		'clickCaptcha': function(options){
			var opts = $.extend({}, defaluts, options); //使用jQuery.extend覆盖插件默认参数
			this.attr('src', opts.src + '?' + new Date().getTime()).load(function(){
				var thisObj = $(this);
				var text = Cookies.get('cli_captcha_text').split(',');
				var title = '请依次点击';
				var t = [];
				for(var i = 0; i < text.length; i++){
					t.push('“<span>'+text[i]+'</span>”');
				}
				title += t.join('、');
				title += '完成验证！';
				$(opts.titleObj).html(title);
				var xyArr = [];
				thisObj.off('mousedown').on('mousedown', function(e){
					e.preventDefault();
					thisObj.off('mouseup').on('mouseup', function(e){
						$(opts.titleObj+' span:eq('+xyArr.length+')').css({
							fontWeight: 'bold',
							color: 'red'
						});
						xyArr.push((e.clientX - $(this).offset().left) + ',' + (e.clientY - $(this).offset().top));
						if(xyArr.length == text.length){
							$.ajax({
								type: 'POST',
								url: opts.src,
								data: {
									do : 'check',
									xy : xyArr.join('-'),
									w : thisObj.width(),
									h : thisObj.height()
								}
							}).done(function(cb){
								if(cb == 1){
									opts.successFunc();
								}else{
									opts.errorFunc();
									thisObj.clickCaptcha(opts);
								}
							});
						}
					});
				});
				if(opts.refreshObj != ''){
					$(opts.refreshObj).off('click').on('click', function(){
						thisObj.clickCaptcha(opts);
					});
				}
				if(opts.revokeObj != ''){
					$(opts.revokeObj).off('click').on('click', function(){
						xyArr.pop();
						$(opts.titleObj+' span:eq('+xyArr.length+')').css({
							fontWeight: '',
							color: ''
						});
					});
				}
			});
			return this;
		}
	});
	//默认参数
	var defaluts = {
		src: 'click-captcha/captcha.php',
		titleObj: '#title',
		refreshObj: '',
		revokeObj: '',
		successFunc: function(){},
		errorFunc: function(){}
	};
})(window.jQuery);