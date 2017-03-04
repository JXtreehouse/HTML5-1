var canvas;
var cxt;
var CANVAS_WIDTH = 400;
var CANVAS_HEIGHT = 600;
var GRID_WIDTH = 40; //每个方块的边长
var row = CANVAS_HEIGHT / GRID_WIDTH; //画布的行数
var col = CANVAS_WIDTH / GRID_WIDTH;  //画布的列数
var lastTime;
var deltaTime;
var isStop;  //记录当前运动的组件的状态
var index;   //每个组件状态列表的索引
var unitIndex;  //组件列表的索引
var currentUnit;  //当前运动的组件的坐标点集
var gridArr = [];  //记录是否已有方块的矩阵，0：没有，1：有
var finishArr = [];  //存放已停止的组件
var offX = CANVAS_WIDTH / 2;  //当前运动的组件在X轴的偏移量
var offY = 0;  //当前运动的组件在Y轴的偏移量
var scoreSpan = $("#score");
var score = 0;

//初始化方块矩阵为0
function initGridArr(){
	for(var i=0;i<row;i++){
		gridArr[i] = [];
		for(var j=0;j<col;j++){
			gridArr[i][j] = 0;
		}
	}
}

var rowArr = [];

function hasRow(){
	var hasRow, r, c, p, q, len;
	rowArr.length = 0;
	for(var i=row-1;i>=0;i--){
		hasRow = true;
		for(var j=0;j<col;j++){
			if(gridArr[i][j] === 0){
				hasRow = false;
				break;
			}
		}
		if(hasRow){
			rowArr.push(i);
			for(p=0,len=finishArr.length;p<len;p++){
				for(q=0;q<finishArr[p].point.length;q++){
					r = (finishArr[p].offY+finishArr[p].point[q][1]*GRID_WIDTH) / GRID_WIDTH;
					if(r == i){
						c = (finishArr[p].offX+finishArr[p].point[q][0]*GRID_WIDTH) / GRID_WIDTH;
						gridArr[r][c] = 0;
						finishArr[p].point[q] = [-1,-1];
					}
				}
			}
		}
	}
	if(rowArr.length>0){
		for(p=0,len=finishArr.length;p<len;p++){
			for(q=finishArr[p].point.length-1;q>=0;q--){
				if(finishArr[p].point[q][0] != -1 && finishArr[p].point[q][1] != -1){
					r = (finishArr[p].offY+finishArr[p].point[q][1]*GRID_WIDTH) / GRID_WIDTH;
					c = (finishArr[p].offX+finishArr[p].point[q][0]*GRID_WIDTH) / GRID_WIDTH;
					gridArr[r][c] = 0;
					var num = getNum(r);
					finishArr[p].point[q][1] += num;
					r += num;
					gridArr[r][c] = 1;
				}
			}
		}
		return true;
	}
	return false;
}

function getNum(row){
	var count = 0;
	for(var i=0;i<rowArr.length;i++){
		if(row<rowArr[i]){
			count++;
		}
	}
	return count;
}

//画当前组件
function drawUnit(unit){
	for(var i=0;i<unit.point.length;i++){
		if(unit.point[i][0] == -1 && unit.point[i][1] == -1){
			continue;
		}
		cxt.save();
		cxt.beginPath();
		cxt.fillStyle = unitColor[unit.colorIndex];
		cxt.strokeStyle = "black";
		cxt.rect(unit.offX+unit.point[i][0]*GRID_WIDTH+1,unit.offY+unit.point[i][1]*GRID_WIDTH+1,GRID_WIDTH-2,GRID_WIDTH-2);
		cxt.stroke();
		cxt.fill();
		cxt.closePath();
		cxt.restore();
	}
}

//判断当前组件移动的方向是否有阻碍，即相应的gridArr值是否为1或是否到达边界
function hasHinder(dir){
	var r,c;
	for(var i=0;i<4;i++){
		switch(dir){
			case "left":
				r = (offY+currentUnit[i][1]*GRID_WIDTH) / GRID_WIDTH;
				c = (offX+currentUnit[i][0]*GRID_WIDTH) / GRID_WIDTH - 1;
				break;
			case "right":
				r = (offY+currentUnit[i][1]*GRID_WIDTH) / GRID_WIDTH;
				c = (offX+currentUnit[i][0]*GRID_WIDTH) / GRID_WIDTH + 1;
				break;
			case "bottom":
				r = (offY+currentUnit[i][1]*GRID_WIDTH) / GRID_WIDTH + 1;
				c = (offX+currentUnit[i][0]*GRID_WIDTH) / GRID_WIDTH;
				break;
		}
		if(r >= row || c < 0 || c >= col || gridArr[r][c] == 1){
			return true;
		}
	}
	return false;
}

var s = 0;
var speed = 2;
//当前组件下落，更新offY值
function drop(){
	if(hasHinder("bottom")){
		isStop = true;
	}else{
		s += speed * deltaTime * 0.05;
		if(s > GRID_WIDTH){
			s = 0;
			offY += GRID_WIDTH;
		}
	}
}

function render(){
	//背景
	cxt.fillStyle = '#ccc';
	cxt.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	//画停止的组件
	var i;
	for(i=0,len=finishArr.length;i<len;i++){
		drawUnit(finishArr[i]);
	}
	//画当前运动的组件
	if(!isStop){
		drop();
		drawUnit({offX:offX,offY:offY,point:currentUnit,colorIndex:unitIndex});
	}
	//将当前停止的组件存入finishArr，更新gridArr矩阵的值，并生成新的组件
	else{
		var pushUnit = [];
		for(i=0;i<currentUnit.length;i++){
			pushUnit[i] = [];
			pushUnit[i][0] = currentUnit[i][0];
			pushUnit[i][1] = currentUnit[i][1];
		}
		finishArr.push({offX:offX,offY:offY,point:pushUnit,colorIndex:unitIndex});
		for(i=0;i<currentUnit.length;i++){
			var r = (offY+currentUnit[i][1]*GRID_WIDTH) / GRID_WIDTH;
			var c = (offX+currentUnit[i][0]*GRID_WIDTH) / GRID_WIDTH;
			gridArr[r][c] = 1;
		}
		while(1){
			if(hasRow()){
				for(i=0,len=finishArr.length;i<len;i++){
					drawUnit(finishArr[i]);
				}
				score += rowArr.length;
				scoreSpan.html(score);
			}else{
				break;
			}
		}
		index = Math.floor(Math.random()*4);
		unitIndex = Math.floor(Math.random()*7);
		currentUnit = unitList[unitIndex][index];
		drawUnit({offX:offX,offY:offY,point:currentUnit,colorIndex:unitIndex});
		offY = 0;
		offX = CANVAS_WIDTH / 2;
		isStop = false;
	}
}

function gameloop(){
	window.requestAnimFrame(gameloop);
	var now = Date.now();
	deltaTime = now - lastTime;
	render();
	lastTime = now;
}

function init(){
	canvas = document.getElementById('canvas');
	cxt = canvas.getContext('2d');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	initGridArr();
	//生成第一个组件
	index = Math.floor(Math.random()*4);
	unitIndex = Math.floor(Math.random()*7);
	currentUnit = unitList[unitIndex][index];
	drawUnit({offX:offX,offY:offY,point:currentUnit,colorIndex:unitIndex});
	isStop = false;
	lastTime = Date.now();
	gameloop();
}

init();

$(document).keydown(function(e){
	e = event || window.event;
	preDefault(e);
	switch(e.keyCode){
		case 37:
			if(!hasHinder("left")){
				offX -= GRID_WIDTH;
			}
			break;
		case 38:
			index = index == 3 ? 0 : index + 1;
			currentUnit = unitList[unitIndex][index];
			break;
		case 39:
			if(!hasHinder("right")){
				offX += GRID_WIDTH;
			}
			break;
		case 40:
			if(!hasHinder("bottom")){
				offY += GRID_WIDTH;
			}
			break;
	}
});
