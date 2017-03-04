var canvas = document.getElementById('canvas');
var cxt = canvas.getContext('2d');
var CANVAS_WIDTH = Math.min(700,$(window).width()-20);
var CANVAS_HEIGHT = CANVAS_WIDTH;
var isMouseDown = false;
var lastPos = {left:0,top:0};
var lastTime = 0;
var lastLineWidth = 1;
var maxLineWidth = 30;
var minLineWidth = -1;
var maxSpeed = 10;
var minSpeed = 0.1;
var strokeColor = "black";


function getDistance(point1,point2){
	return Math.sqrt((point1.x-point2.x) * (point1.x-point2.x) + (point1.y-point2.y) * (point1.y-point2.y));
}

function windowToCanvas(x,y){
	var origin = canvas.getBoundingClientRect();
	return {x:Math.round(x-origin.left),y:Math.round(y-origin.top)};
}

function getLineWidth(s,t){
	var v = s / t;
	var lineWidth = 0;
	if(v >= maxSpeed){
		lineWidth = minLineWidth;
	}else if(v <= minSpeed){
		lineWidth = maxLineWidth;
	}else{
		lineWidth = maxLineWidth - (v - minSpeed) / (maxSpeed - minSpeed) * (maxLineWidth - minLineWidth);
	}
	if(lastLineWidth == -1){
		return lineWidth;
	}
	return lastLineWidth * 1 / 3 + lineWidth * 2 / 3;
}

$('#clear').click(function(){
	cxt.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	drawGrid();
});

$('.color').click(function(){
	$('.color').removeClass('color-selected');
	$(this).addClass('color-selected');
	strokeColor = $(this).css('background-color');
});

function beginStroke(point){
	isMouseDown = true;
	lastPos = windowToCanvas(point.x,point.y);
	lastTime = new Date().getTime();
}

function endStroke(){
	isMouseDown = false;
}

function stroke(point){
	var currentPos = windowToCanvas(point.x,point.y);
	var currentTime = new Date().getTime();
	var t = currentTime - lastTime;
	var s = getDistance(lastPos,currentPos);
	var currentLineWidth = getLineWidth(s,t);
	cxt.beginPath();
	cxt.moveTo(lastPos.x,lastPos.y);
	cxt.lineTo(currentPos.x,currentPos.y);
	cxt.closePath();
	cxt.lineWidth = currentLineWidth;
	cxt.lineCap = "round";
	cxt.lineJoin = "round";
	cxt.strokeStyle = strokeColor;
	cxt.stroke();
	lastPos = currentPos;
	lastTime = currentTime;
	lastLineWidth = currentLineWidth;
}

canvas.onmousedown = function(e){
	preDefault(e);
	beginStroke({x:e.clientX,y:e.clientY});
};

canvas.onmousemove = function(e){
	preDefault(e);
	if(isMouseDown){
		stroke({x:e.clientX,y:e.clientY});
	}
};

canvas.onmouseup = function(e){
	preDefault(e);
	endStroke();
};

canvas.onmouseout = function(e){
	preDefault(e);
	endStroke();
};

canvas.addEventListener('touchstart',function(e){
	preDefault(e);
	var pos = e.touches[0];
	beginStroke({x:pos.pageX,y:pos.pageY});
});

canvas.addEventListener('touchmove',function(e){
	preDefault(e);
	if(isMouseDown){
		var pos = e.touches[0];
		stroke({x:pos.pageX,y:pos.pageY});
	}
});

canvas.addEventListener('touchend',function(e){
	preDefault(e);
	endStroke();
});

function drawGrid(){
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	$('.controler').css('width',CANVAS_WIDTH);
	cxt.save();

	cxt.beginPath();
	cxt.strokeStyle = "red";
	cxt.rect(3,3,CANVAS_WIDTH-6,CANVAS_HEIGHT-6);
	cxt.closePath();
	cxt.lineWidth = 6;
	cxt.stroke();

	cxt.beginPath();
	cxt.setLineDash([5]);  //画虚线
	cxt.lineWidth = 1;

	cxt.moveTo(0,0);
	cxt.lineTo(CANVAS_WIDTH-0,CANVAS_HEIGHT-0);

	cxt.moveTo(CANVAS_WIDTH-0,0);
	cxt.lineTo(0,CANVAS_HEIGHT-0);

	cxt.moveTo(0,CANVAS_HEIGHT/2);
	cxt.lineTo(CANVAS_WIDTH-0,CANVAS_HEIGHT/2);

	cxt.moveTo(CANVAS_WIDTH/2,0);
	cxt.lineTo(CANVAS_WIDTH/2,CANVAS_HEIGHT-0);

	cxt.stroke();
	cxt.closePath();
	cxt.restore();
}

drawGrid();
