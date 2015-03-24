(function($,global){
$.fn.svgParallax = function(el,options) {
	var parallaxWindow = this;
	var $el = $(el);
	var $paths = $el.find('path,line');

	var ops = $.extend({
		direction : 'y',
		type : 'scrollFit',
		fixPosition : 0,
		speed : 1,
		contentStartLinePercent : 50,
		easing: 'liner',
		debug: false
	},options);

	var direction = ops.direction;
	var scrollDirection = direction === 'y' ? 'Top' : 'Left';
	var type = ops.type;
	var speed = ops.speed;
	var fixPosition = ops.fixPosition;
	var contentStartLinePercent = ops.contentStartLinePercent;
	var debug = ops.debug;

	var isLineOver = false;

	var maxPathLength = (function() {
		var pathsLength = [];
		$paths.each(function(i, path) {
			var style = path.style;
			style.strokeDasharray = style.strokeDashoffset = path.getTotalLength();
			pathsLength[i] = parseFloat(path.getTotalLength());
		});
		return Math.max.apply(null, pathsLength);
	})();

	function info() {
		var scrollNum = parallaxWindow['scroll' + scrollDirection]();
		var windowWidth = !window.innerWidth ? document.documentElement.clientWidth : window.innerWidth;
		var windowHeight = !window.innerHeight ?  document.documentElement.clientHeight : window.innerHeight;

		return {
			scrollNum: scrollNum,
			windowWidth: windowWidth,
			windowHeight: windowHeight,
			contentStartLine:  scrollNum + ((direction === 'y' ? windowHeight : windowWidth) / (100 / contentStartLinePercent))
		};
	}

	function strokeDraw(value, path) {
		var style = path.style;
		var strokeDasharray = path.getTotalLength();

		var percent = value / strokeDasharray;
		percent = percent < 0 ? 0 : percent;
		percent = percent > 1 ? 1 : percent;

		style.strokeDashoffset = strokeDasharray - easing[ops.easing](percent, 0, strokeDasharray, 1);
	}

	var timingValue = 0;
	var parallax = {
		scrollFit: function() {
			var value = -parseFloat(-info().scrollNum / speed + fixPosition / speed) + maxPathLength;
			$paths.each(function(i, path) {
				strokeDraw(value, path);
			});
		},

		timing: function() {
			if(info().contentStartLine >= fixPosition) {
				if(!isLineOver) {
					isLineOver = true;
					startPathDrawing(true);
				}
			} else {
				if(isLineOver) {
					isLineOver = false;
					startPathDrawing(false);
				}
			}

			function startPathDrawing(isStart) {
				setTimeout(function() {
					timingValue += isLineOver ? speed : -speed;
					$paths.each(function(i, path) {
						strokeDraw(timingValue, path);
					});

					if(!(timingValue > maxPathLength || timingValue < 0) && isLineOver === isStart) {
						startPathDrawing(isStart);
					}
				}, 0);
			}
		}
	};


	info();
	parallax[type]();

	$(window).on('resize scroll',function(){
		info();
		parallax[type]();
		debugView();
	});


	//debug
	function debugView() {
		if(debug) {
			$('.parallaxDebug').css({
				top: info().contentStartLine
			});
		}
	}

	if(debug) {
		$debug = $('body').append('<hr class="parallaxDebug">').find('.parallaxDebug').css({
			position: 'absolute',
			width: '100%',
			borderBottom: '2px solid red',
			zIndex: 99999
		});
		debugView();
	}
};


var easing = {
	liner : function(t,b,c,d){return b+c*t},
	easeInQuad:function(i,b,c,d){return c*(i/=d)*i+b;},
	easeOutQuad:function(i,b,c,d){return -c*(i/=d)*(i-2)+b;},
	easeInOutQuad:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i+b;}return -c/2*((--i)*(i-2)-1)+b;},
	easeInCubic:function(i,b,c,d){return c*(i/=d)*i*i+b;},
	easeOutCubic:function(i,b,c,d){return c*((i=i/d-1)*i*i+1)+b;},
	easeInOutCubic:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i+b;}return c/2*((i-=2)*i*i+2)+b;},
	easeInQuart:function(i,b,c,d){return c*(i/=d)*i*i*i+b;},
	easeOutQuart:function(i,b,c,d){return -c*((i=i/d-1)*i*i*i-1)+b;},
	easeInOutQuart:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i*i+b;}return -c/2*((i-=2)*i*i*i-2)+b;},
	easeInQuint:function(i,b,c,d){return c*(i/=d)*i*i*i*i+b;},
	easeOutQuint:function(i,b,c,d){return c*((i=i/d-1)*i*i*i*i+1)+b;},
	easeInOutQuint:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i*i*i+b;}return c/2*((i-=2)*i*i*i*i+2)+b;},
	easeInSine:function(i,b,c,d){return -c*Math.cos(i/d*(Math.PI/2))+c+b;},
	easeOutSine:function(i,b,c,d){return c*Math.sin(i/d*(Math.PI/2))+b;},
	easeInOutSine:function(i,b,c,d){return -c/2*(Math.cos(Math.PI*i/d)-1)+b;},
	easeInExpo:function(i,b,c,d){return(i==0)?b:c*Math.pow(2,10*(i/d-1))+b;},
	easeOutExpo:function(i,b,c,d){return(i==d)?b+c:c*(-Math.pow(2,-10*i/d)+1)+b;},
	easeInOutExpo:function(i,b,c,d){if(i==0){return b;}if(i==d){return b+c;}if((i/=d/2)<1){return c/2*Math.pow(2,10*(i-1))+b;}return c/2*(-Math.pow(2,-10*--i)+2)+b;},
	easeInCirc:function(i,b,c,d){return -c*(Math.sqrt(1-(i/=d)*i)-1)+b;},
	easeOutCirc:function(i,b,c,d){return c*Math.sqrt(1-(i=i/d-1)*i)+b;},
	easeInOutCirc:function(i,b,c,d){if((i/=d/2)<1){return -c/2*(Math.sqrt(1-i*i)-1)+b;}return c/2*(Math.sqrt(1-(i-=2)*i)+1)+b;},
	easeInElastic:function(m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b)==1){return p+a;}if(!c){c=b*0.3;}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}return -(n*Math.pow(2,10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c))+p;},
	easeOutElastic:function(m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b)==1){return p+a;}if(!c){c=b*0.3;}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}return n*Math.pow(2,-10*m)*Math.sin((m*b-d)*(2*Math.PI)/c)+a+p;},
	easeInOutElastic:function(m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b/2)==2){return p+a;}if(!c){c=b*(0.3*1.5);}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}if(m<1){return -0.5*(n*Math.pow(2,10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c))+p;}return n*Math.pow(2,-10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c)*0.5+a+p;},
	easeInBack:function(k,b,c,d,j){if(j==undefined){j=1.70158;}return c*(k/=d)*k*((j+1)*k-j)+b;},
	easeOutBack:function(k,b,c,d,j){if(j==undefined){j=1.70158;}return c*((k=k/d-1)*k*((j+1)*k+j)+1)+b;},
	easeInOutBack:function(k,b,c,d,j){if(j==undefined){j=1.70158;}if((k/=d/2)<1){return c/2*(k*k*(((j*=(1.525))+1)*k-j))+b;}return c/2*((k-=2)*k*(((j*=(1.525))+1)*k+j)+2)+b;},
	easeInBounce:function(i,b,c,d){return c-easing.easeOutBounce(d-i,0,c,d)+b;},
	easeOutBounce:function(i,b,c,d){if((i/=d)<(1/2.75)){return c*(7.5625*i*i)+b;}else{if(i<(2/2.75)){return c*(7.5625*(i-=(1.5/2.75))*i+0.75)+b;}else{if(i<(2.5/2.75)){return c*(7.5625*(i-=(2.25/2.75))*i+0.9375)+b;}else{return c*(7.5625*(i-=(2.625/2.75))*i+0.984375)+b;}}}},
	easeInOutBounce:function(i,b,c,d){if(i<d/2){return easing.easeInBounce(i*2,0,c,d)*0.5+b;}return easing.easeOutBounce(i*2-d,0,c,d)*0.5+c*0.5+b;}
};
}(jQuery,this));