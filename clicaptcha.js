/**
 * js-cookie v2.1.0
 * https://github.com/js-cookie/js-cookie
 */
 (function(factory){if(typeof define==='function'&&define.amd){define(factory)}else if(typeof exports==='object'){module.exports=factory()}else{var _OldCookies=window.Cookies;var api=window.Cookies=factory();api.noConflict=function(){window.Cookies=_OldCookies;return api}}}(function(){function extend(){var i=0;var result={};for(;i<arguments.length;i++){var attributes=arguments[i];for(var key in attributes){result[key]=attributes[key]}}return result}function init(converter){function api(key,value,attributes){var result;if(arguments.length>1){attributes=extend({path:'/'},api.defaults,attributes);if(typeof attributes.expires==='number'){var expires=new Date();expires.setMilliseconds(expires.getMilliseconds()+attributes.expires*864e+5);attributes.expires=expires}try{result=JSON.stringify(value);if(/^[\{\[]/.test(result)){value=result}}catch(e){}if(!converter.write){value=encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent)}else{value=converter.write(value,key)}key=encodeURIComponent(String(key));key=key.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent);key=key.replace(/[\(\)]/g,escape);return(document.cookie=[key,'=',value,attributes.expires&&'; expires='+attributes.expires.toUTCString(),attributes.path&&'; path='+attributes.path,attributes.domain&&'; domain='+attributes.domain,attributes.secure?'; secure':''].join(''))}if(!key){result={}}var cookies=document.cookie?document.cookie.split('; '):[];var rdecode=/(%[0-9A-Z]{2})+/g;var i=0;for(;i<cookies.length;i++){var parts=cookies[i].split('=');var name=parts[0].replace(rdecode,decodeURIComponent);var cookie=parts.slice(1).join('=');if(cookie.charAt(0)==='"'){cookie=cookie.slice(1,-1)}try{cookie=converter.read?converter.read(cookie,name):converter(cookie,name)||cookie.replace(rdecode,decodeURIComponent);if(this.json){try{cookie=JSON.parse(cookie)}catch(e){}}if(key===name){result=cookie;break}if(!key){result[name]=cookie}}catch(e){}}return result}api.get=api.set=api;api.getJSON=function(){return api.apply({json:true},[].slice.call(arguments))};api.defaults={};api.remove=function(key,attributes){api(key,'',extend(attributes,{expires:-1}))};api.withConverter=init;return api}return init(function(){})}));

(function($){
	$.fn.extend({
		'clicaptcha': function(options){
			var opts = $.extend({}, defaluts, options); //使用jQuery.extend覆盖插件默认参数
			var $this = this;
			if(!$('#clicaptcha-container').length){
				$('body').append('<div id="clicaptcha-container">'+
					'<div class="clicaptcha-imgbox">'+
						'<img class="clicaptcha-img" alt="验证码加载失败，请点击刷新按钮">'+
					'</div>'+
					'<div class="clicaptcha-title"></div>'+
					'<div class="clicaptcha-refresh-box">'+
						'<div class="clicaptcha-refresh-line clicaptcha-refresh-line-left"></div>'+
						'<a href="javascript:;" class="clicaptcha-refresh-btn" title="刷新"></a>'+
						'<div class="clicaptcha-refresh-line clicaptcha-refresh-line-right"></div>'+
					'</div>'+
				'</div>');
				$('body').append('<div id="clicaptcha-mask"></div>');
				$('#clicaptcha-mask').click(function(){
					$('#clicaptcha-container').hide();
					$(this).hide();
				});
				$('#clicaptcha-container .clicaptcha-refresh-btn').click(function(){
					$this.clicaptcha(opts);
				});
			}
			$('#clicaptcha-container, #clicaptcha-mask').show();
			$('#clicaptcha-container .clicaptcha-imgbox .step').remove();
			$('#clicaptcha-container .clicaptcha-imgbox .clicaptcha-img').attr('src', opts.src + '?' + new Date().getTime()).load(function(){
				var thisObj = $(this);
				var text = Cookies.get('clicaptcha_text').split(',');
				var title = '请依次点击';
				var t = [];
				for(var i = 0; i < text.length; i++){
					t.push('“<span>'+text[i]+'</span>”');
				}
				title += t.join('、');
				$('#clicaptcha-container .clicaptcha-title').html(title);
				var xyArr = [];
				thisObj.off('mousedown').on('mousedown', function(e){
					e.preventDefault();
					thisObj.off('mouseup').on('mouseup', function(e){
						$('#clicaptcha-container .clicaptcha-title span:eq('+xyArr.length+')').addClass('clicaptcha-clicked');
						xyArr.push(e.offsetX + ',' + e.offsetY);
						$('#clicaptcha-container .clicaptcha-imgbox').append('<span class="step" style="left:' + (e.offsetX - 13) + 'px;top:' + (e.offsetY - 13) + 'px">' + xyArr.length + '</span>')
						if(xyArr.length == text.length){
							var captchainfo = [xyArr.join('-'), thisObj.width(), thisObj.height()].join(';');
							$.ajax({
								type: 'POST',
								url: opts.src,
								data: {
									do : 'check',
									info : captchainfo
								}
							}).done(function(cb){
								if(cb == 1){
									$this.val(captchainfo).data('ischeck', true);
									$('#clicaptcha-container .clicaptcha-title').html(opts.success_tip);
									setTimeout(function(){
										$('#clicaptcha-container, #clicaptcha-mask').hide();
										opts.callback();
									}, 1500);
								}else{
									$('#clicaptcha-container .clicaptcha-title').html(opts.error_tip);
									setTimeout(function(){
										$this.clicaptcha(opts);
									}, 1500);
								}
							});
						}
					});
				});
			});
			return this;
		},
		'clicaptchaCheck': function(){
			var ischeck = false;
			if(this.data('ischeck') == true){
				ischeck = true;
			}
			return ischeck;
		},
		'clicaptchaReset': function(){
			this.val('').removeData('ischeck');
			return this;
		}
	});
	//默认参数
	var defaluts = {
		src: 'clicaptcha/clicaptcha.php',
		success_tip: '验证成功！',
		error_tip: '未点中正确区域，请重试！',
		callback: function(){}
	};
})(window.jQuery);