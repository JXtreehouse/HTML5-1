var searchlight = {x:300,y:300,radius:100,vx:Math.random()*5+10,vy:Math.random()*5+10};
var rot = 0;
var scale = 1;
var isIncrease = true;
var canvas1 = document.getElementById("canvas1");
var context1 = canvas1.getContext("2d");
var balls = [];
window.onload = function(){
	var canvas = document.getElementById("canvas");
	canvas.width = 600;
	canvas.height = 600;
	var context = canvas.getContext("2d");
	setInterval(function(){
		draw(context);
		update(canvas);
	},50);

	canvas1.width = 600;
	canvas1.height = 600;
	for(var i=0;i<10;i++){
		var aBall = {
			x:Math.random()*canvas1.width,
			y:Math.random()*canvas1.height,
			radius:Math.random()*20+10
		};
		balls.push(aBall);
	}
	drawBalls(context1,0,0);
	canvas1.addEventListener("mousemove",detect);
};


function draw(cxt){
	var cvs = cxt.canvas;
	cxt.clearRect(0,0,cvs.width,cvs.height);
	cxt.save();
	cxt.beginPath();
	cxt.fillStyle = "black";
	cxt.fillRect(0,0,cvs.width,cvs.height);
	cxt.beginPath();
	//cxt.arc(searchlight.x,searchlight.y,searchlight.radius,0,2.0*Math.PI);
	drawStar(cxt,searchlight.x,searchlight.y,searchlight.radius,rot);
	cxt.fillStyle = "white";
	cxt.fill();
	cxt.clip();
	cxt.font = "bold 150px Arial";
	cxt.textAlign = "center";
	cxt.textBaseline = "middle";
	cxt.fillStyle = "#058";
	cxt.fillText("canvas",cvs.width/2,cvs.height/4);
	cxt.fillText("canvas",cvs.width/2,cvs.height/2);
	cxt.fillText("canvas",cvs.width/2,cvs.height*3/4);
	cxt.restore();
}

function update(cvs){
	rot += 2;
	if(scale<0.5){
		isIncrease = true;
	}
	else if(scale>1.5){
		isIncrease = false;
	}
	if(isIncrease){
		scale += 0.05;
	}else{
		scale -= 0.05;
	}
	searchlight.x += searchlight.vx;
	searchlight.y += searchlight.vy;
	if(searchlight.x-searchlight.radius<=0){
		searchlight.vx = -searchlight.vx;
		searchlight.x = searchlight.radius;
	}
	if(searchlight.x+searchlight.radius>=cvs.width){
		searchlight.vx = -searchlight.vx;
		searchlight.x = cvs.width - searchlight.radius;
	}
	if(searchlight.y-searchlight.radius<=0){
		searchlight.vy = -searchlight.vy;
		searchlight.y = searchlight.radius;
	}
	if(searchlight.y+searchlight.radius>=cvs.height){
		searchlight.vy = -searchlight.vy;
		searchlight.y = cvs.height - searchlight.radius;
	}
}

function drawStar(cxt,x,y,R,rot){
	cxt.save();

	cxt.translate(x,y);
	cxt.rotate(rot/180*Math.PI);
	cxt.scale(R*scale,R*scale);

	starPath(cxt);
	cxt.fillStyle = "#fb3";
	// cxt.strokeStyle = "#fd5";
	// cxt.lineWidth = 3;
	// cxt.lineJoin = "round";
	cxt.fill();
	// cxt.stroke();
	cxt.restore();
}

function starPath(cxt){
	cxt.beginPath();
	for(var i=0;i<5;i++){
		cxt.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI),
			-Math.sin((18 + i * 72) / 180 * Math.PI));
		cxt.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * 0.5,
			-Math.sin((54 + i * 72) / 180 * Math.PI) * 0.5);
	}
	cxt.closePath();
}

//右半部分的mouseover效果
function detect(event){
	var x = event.clientX - canvas1.getBoundingClientRect().left;
	var y = event.clientY - canvas1.getBoundingClientRect().top;
	drawBalls(context1,x,y);
}

function drawBalls(cxt,x,y){
	var cvs = cxt.canvas;
	cxt.clearRect(0,0,cvs.width,cvs.height);
	cxt.lineWidth = 2;
	cxt.strokeStyle = "gray";
	cxt.rect(0,0,cvs.width,cvs.height);
	cxt.stroke();
	for(var i=0;i<balls.length;i++){
		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,balls[i].radius,0,2.0*Math.PI);
		if(cxt.isPointInPath(x,y)){
			context1.fillStyle = "red";
		}else{
			cxt.fillStyle = "#035";
		}
		cxt.fill();
	}
}
