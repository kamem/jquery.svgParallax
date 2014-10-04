(function($,global){
$.fn.svgParallax = function(el,options) {
	var $parallaxWindow = this,
		$el = $(el),
		$paths = $el.find('path');

	var ops = $.extend({
			direction : 'y',

			type : 'type2',

			fixPosition : 0,
			speed : 1,
			minValue : -99999,
			maxValue : 99999,
			adjustment : 0,

			contentStartLinePercent : 50,
			startAnimation : '',
			endAnimation : '',

			debug: false
		},options),

		parallaxObj = $el,

		direction = ops.direction,
		directionStr = direction === 'y' ? 'top' : 'left',

		type = ops.type,

		speed = ops.speed,
		minValue = ops.minValue,
		maxValue = ops.maxValue,
		fixPosition = ops.fixPosition,
		contentStartLinePercent = ops.contentStartLinePercent,
		startAnimation = ops.startAnimation,
		endAnimation = ops.endAnimation,

		debug = ops.debug,

		line = false,
		pathsLength = [];

	$paths.each(function(i,path) {
		var style = path.style;
		style.strokeDasharray = style.strokeDashoffset = path.getTotalLength();
		pathsLength[i] = parseInt(path.getTotalLength());
	});

	var adjustment = Math.max.apply(null, pathsLength);


	/**
	 *	値の取得
	 *
	 *	* scrollY : スクロール量
	 *	* windowWidth : ウィンドウの横幅
	 *	* windowHeight : ウィンドウの縦幅
	 *	* contentStartLine : ウィンドウのセンターライン
	 *
	 *	@method info
	 *	@return {Object}
	 */
	function info() {
		var dstr = directionStr.charAt(0).toUpperCase() + directionStr.substring(1),
			scrollNum = $parallaxWindow['scroll' + dstr](),
			windowWidth = (!(window.innerWidth)) ? document.documentElement.clientWidth : window.innerWidth,
			windowHeight = (!(window.innerHeight)) ?  document.documentElement.clientHeight : window.innerHeight;

		return {
			scrollNum: scrollNum,
			windowWidth: windowWidth,
			windowHeight: windowHeight,
			contentStartLine:  scrollNum + ((direction === 'y' ? windowHeight : windowWidth) / (100 / contentStartLinePercent))
		};
	};

	/*------------------------------------------------------------------------------------------
		パララックス効果のメイン処理
	------------------------------------------------------------------------------------------*/
	var parallax = {

		/**
		 *	（scrollNum）スクロール量 / speed
		 *
		 *	スクロール方向と反対に動かしたい場合はspeedをマイナスにします。
		 *
		 *	@method parallax.type2
		 */
		type2 : function() {

			$paths.each(function(i,path) {
				var style = path.style;
				var value = -parseInt(-info().scrollNum / speed + fixPosition / speed) + adjustment;
				value = path.getTotalLength() - value;
				value = 0 > value ? 0 : path.getTotalLength() < value ? path.getTotalLength() : value;

				style.strokeDashoffset = value;
			});
		}
	};

	/*------------------------------------------------------------------------------------------
		初回実行
	------------------------------------------------------------------------------------------*/
	info();
	parallax[type]();

	/*------------------------------------------------------------------------------------------
		ウィンドウズサイズを変更したとき
	------------------------------------------------------------------------------------------*/
	$(window).bind("resize",function(){
		info();
		parallax[type]();
	});

	/*------------------------------------------------------------------------------------------
		スクロールしたとき
	------------------------------------------------------------------------------------------*/
	$parallaxWindow.scroll(function(){
		info();
		parallax[type]();
	});
};
}(jQuery,this));