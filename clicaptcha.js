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
			$('#clicaptcha-container .clicaptcha-imgbox .clicaptcha-img').attr('src', opts.src + '?' + new Date().getTime()).on('load', function(){
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