$(function() {
var svg = document.getElementById("svg1"),
	pathAry = [].slice.call(svg.querySelectorAll('path'));


var requestAnimFrame = function(){
	return (
		function( callback ){
			window.setTimeout(callback, 1000 / 60); //60fps
		}
	);
}();

var current_frame = 0;
var total_frame = 160;
var handle = 0;

var length = [];
var rendered = false;

// 初期化（破線の作成）
// pathを取得してArray化した後、forEachにつっこむ。
pathAry.forEach(function(path,i) {
	var style = path.style;
	style.strokeDasharray = style.strokeDashoffset = path.getTotalLength();
});

// 線を引く関数
function draw(){
	progress = current_frame/total_frame;
	if (progress > 1) {
		// 現在のフレームと総フレームが等しくなれば終わり
		window.clearTimeout(handle);
	} else {
	// 1フレーム進める
		current_frame++;
		for(var j=0, len = pathAry.length; j<len;j++){
			// それぞれのpath要素のオフセットを縮める
			pathAry[j].style.strokeDashoffset = Math.floor(pathAry[j].getTotalLength() * (1 - progress));
		}
		handle = requestAnimFrame(draw);
	}
}

// すでに描画されているか判定する関数
function render(){
	if( rendered ) return;
	rendered = true;
	draw();
}

render();
});