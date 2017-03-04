var WINDOW_WIDTH = 1200;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;
const endTime = new Date();
endTime.setTime(endTime.getTime() + 3600*1000);
var curShowTimeSeconds = 0;
var balls = [];
var colors = ["#33b5e5","#0099cc","#aa66cc","#9933cc","#99cc00","#669900","#ffbb33","#ff8800","#ff4444","#cc0000"];

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	WINDOW_WIDTH = document.body.clientWidth || document.documentElement.clientWidth;
	WINDOW_HEIGHT = document.body.clientHeight || document.documentElement.clientHeight;
	RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1;
	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	curShowTimeSeconds = getCurrentShowTimeSeconds();
	setInterval(function(){
		render(context);
		update();
	},50);
}

function getCurrentShowTimeSeconds(){
	var curTime = new Date();
	var ret = endTime.getTime() - curTime.getTime();
	ret = Math.round(ret/1000);
	return ret >= 0 ? ret : 0;
}

function update(){
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();
	var nextHours = parseInt(nextShowTimeSeconds / 3600);
	var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600)/60);
	var nextSeconds = nextShowTimeSeconds % 60;
	var curHours = parseInt(curShowTimeSeconds / 3600);
	var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600)/60);
	var curSeconds = curShowTimeSeconds % 60;
	if(nextSeconds != curSeconds){
		if(parseInt(curHours/10) != parseInt(nextHours/10)){
			addBalls(MARGIN_LEFT,MARGIN_TOP,parseInt(curHours/10));
		}
		if(parseInt(curHours%10) != parseInt(nextHours%10)){
			addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
		}
		if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
			addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
			addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
		}
		if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
			addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
		}
		if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
			addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
		}
		curShowTimeSeconds = nextShowTimeSeconds;
	}
	updateBalls();
}

function addBalls(x,y,num){
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j] == 1){
				var aBall = {
					x:x+2*j*(RADIUS+1)+(RADIUS+1),
					y:y+2*i*(RADIUS+1)+(RADIUS+1),
					g:1.5+Math.random(),
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]
				};
				balls.push(aBall);
			}
		}
	}
}

function updateBalls(){
	var i;
	for(i=0;i<balls.length;i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		if(Math.abs(balls[i].vy)<balls[i].g && balls[i].y>=(WINDOW_HEIGHT-RADIUS-balls[i].g)){
			balls[i].vy = 0;
		}else{
			balls[i].vy += balls[i].g;
		}
		if(balls[i].y >= WINDOW_HEIGHT-RADIUS){
			balls[i].y = WINDOW_HEIGHT-RADIUS;
			balls[i].vy = -balls[i].vy*0.65;
		}
	}
	var count = 0;
	for(i=0;i<balls.length;i++){
		if(balls[i].x+RADIUS>0&&balls[i].x-RADIUS<=WINDOW_WIDTH){
			balls[count++] = balls[i];
		}
	}
	while(balls.length>Math.min(300,count)){
		balls.pop();
	}
}

function render(ctxt){
	ctxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

	var hours = parseInt(curShowTimeSeconds / 3600);
	var minutes = parseInt((curShowTimeSeconds - hours * 3600)/60);
	var seconds = curShowTimeSeconds % 60;

	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),ctxt);
	renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),ctxt);
	renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,ctxt);
	renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),ctxt);
	renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),ctxt);
	renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,ctxt);
	renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),ctxt);
	renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),ctxt);

	for(var i=0;i<balls.length;i++){
		ctxt.fillStyle = balls[i].color;
		ctxt.beginPath();
		ctxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
		ctxt.closePath();
		ctxt.fill();
	}
}

function renderDigit(x,y,num,ctxt){
	ctxt.fillStyle = "rgb(0,102,153)";
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j] == 1){
				ctxt.beginPath();
				ctxt.arc(x+2*j*(RADIUS+1)+(RADIUS+1),y+2*i*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
				ctxt.closePath();
				ctxt.fill();
			}
		}
	}
}
