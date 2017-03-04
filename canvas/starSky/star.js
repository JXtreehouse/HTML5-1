window.onload = function(){
	var canvas = document.getElementById("canvas");
	canvas.width = 1100;
	canvas.height = 700;
	var context = canvas.getContext("2d");
	var skyStyle = context.createRadialGradient(canvas.width/2,canvas.height,0,canvas.width/2,canvas.height,canvas.height);
	skyStyle.addColorStop(0.0,"#035");
	skyStyle.addColorStop(1.0,"black");
	context.fillStyle = skyStyle;
	context.fillRect(0,0,canvas.width,canvas.height);
	// context.fill();
	// context.stroke();
	for(var i=0;i<200;i++){
		var r = Math.random() * 5 + 5;
		var x = Math.random() * canvas.width;
		var y = Math.random() * canvas.height * 0.65;
		if(x>=800&&x<=1000&&y>=100&&y<=300){
			x -= 200;
			y -= 200;
		}
		var rot = Math.random() * 360;
		drawStar(context,x,y,r,rot);
	}
	fillMoon(context,2,900,200,100,30);
	drawLand(canvas,context,canvas.height*0.75,canvas.width*0.4,canvas.width*0.6);
};

function drawLand(cvs,cxt,y,x1,x2){
	cxt.save();
	cxt.beginPath();
	cxt.moveTo(0,y);
	cxt.bezierCurveTo(x1,y-200,x2,y+200,cvs.width,y);
	cxt.lineTo(cvs.width,cvs.height);
	cxt.lineTo(0,cvs.height);
	cxt.closePath();
	var landBg = cxt.createLinearGradient(0,800,0,0);
	landBg.addColorStop(0.0,"#030");
	landBg.addColorStop(1.0,"#580");
	cxt.fillStyle = landBg;
	cxt.fill();
	cxt.restore();
}

function drawStar(cxt,x,y,R,rot){
	cxt.save();

	cxt.translate(x,y);
	cxt.rotate(rot/180*Math.PI);
	cxt.scale(R,R);

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

function fillMoon(cxt,d,x,y,R,rot,fillColor){
	cxt.save();
	cxt.translate(x,y);
	cxt.rotate(rot/180*Math.PI);
	cxt.scale(R,R);
	pathMoon(cxt,d);
	cxt.fillStyle = fillColor || "#fb5";
	cxt.fill();
	cxt.restore();
}

function pathMoon(cxt,d){
	cxt.beginPath();
	cxt.arc(0,0,1,0.5*Math.PI,1.5*Math.PI,true);
	cxt.moveTo(0,-1);
	cxt.quadraticCurveTo(1.3,0,0,1);
	//cxt.arcTo(d,0,0,1,dis(0,-1,d,0)/d);
	cxt.closePath();
}

function dis(x1,y1,x2,y2){
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}
