//解决requestAnimationFrame函数的浏览器兼容问题
window.requestAnimFrame = (function() {   
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();

//阻止事件的默认行为
function preDefault(event){
        if(event.preventDefault){
                event.preventDefault();
        }else{
                event.returnValue = false;
        }
}