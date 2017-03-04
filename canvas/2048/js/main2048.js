var board = [];
var score = 0;
var hasConflicted = [];
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}

	var gridContainer = $("#grid-container");
	gridContainer.css("width",gridContainerWidth - 2 * cellSpace);
	gridContainer.css("height",gridContainerWidth - 2 * cellSpace);
	gridContainer.css("padding",cellSpace);
	gridContainer.css("border-radius",0.02 * gridContainerWidth);

	var gridCell = $(".grid-cell");
	gridCell.css("width",cellSideLength);
	gridCell.css("height",cellSideLength);
	gridCell.css("border-radius",0.02 * cellSideLength);

}

//开始新游戏
function newgame(){
	//初始化棋盘
	init();
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

//初始化棋盘
function init(){
	var i, j;
	for(i=0;i<4;i++){
		for(j=0;j<4;j++){
			var gridCell = $("#grid-cell-" + i + "-" + j);
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
	}
	for(i=0;i<4;i++){
		board[i] = [];
		hasConflicted[i] = [];
		for(j=0;j<4;j++){
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	updateBoardView();
	score = 0;
	updateScore(score);
}

function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j +'"></div>');
			var theNumberCell = $("#number-cell-"+ i + "-" + j);
			if(board[i][j] === 0){
				theNumberCell.css("width","0px");
				theNumberCell.css("height","0px");
				theNumberCell.css("top",getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css("left",getPosLeft(i,j)+cellSideLength/2);
			}else{
				theNumberCell.css("width",cellSideLength);
				theNumberCell.css("height",cellSideLength);
				theNumberCell.css("top",getPosTop(i,j));
				theNumberCell.css("left",getPosLeft(i,j));
				theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
				theNumberCell.css("color",getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		}
	$(".number-cell").css("line-height",cellSideLength + "px");
	$(".number-cell").css("font-size",0.6 * cellSideLength + "px");
}

function generateOneNumber(){
	if(nospace(board)){
		return false;
	}
	//随机生成一个位置
	var randx = parseInt(Math.floor(Math.random()*4));
	var randy = parseInt(Math.floor(Math.random()*4));
	while(true){
		if(board[randx][randy] === 0){
			break;
		}
		randx = parseInt(Math.floor(Math.random()*4));
		randy = parseInt(Math.floor(Math.random()*4));
	}
	//随机生成一个数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;

	//在随机位置显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	return true;
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37:   //left
			event.preventDefault();
			if(moveLeft()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		case 38:   //top
			event.preventDefault();
			if(moveUp()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		case 39:   //right
			event.preventDefault();
			if(moveRight()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		case 40:   //down
			event.preventDefault();
			if(moveDown()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		default:   //default
			break;
	}
});

document.addEventListener("touchstart",function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener("touchmove",function(event){
	event.preventDefault();
});

document.addEventListener("touchend",function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;

	if(Math.abs(deltax)<0.3*documentWidth && Math.abs(deltay)<0.3*documentWidth)
		return;

	//x
	if(Math.abs(deltax) >= Math.abs(deltay)){
		if(deltax < 0){
			//move left
			if(moveLeft()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
		}
		else{
			//move right
			if(moveRight()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
		}
	}
	//y
	else{
		if(deltay < 0){
			//move up
			if(moveUp()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
		}
		else{
			//move down
			if(moveDown()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
		}
	}
});

function moveLeft(){
	if(!canMoveLeft(board))
		return false;
	//moveLeft
	for(var i=0;i<4;i++)
		for(var j=1;j<4;j++){
			if(board[i][j] !== 0){
				for(var k=0;k<j;k++){
					if(board[i][k] === 0 && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
					}else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] *= 2;
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);
						hasConflicted[i][k] = true;
					}
				}
			}
		}
	setTimeout(updateBoardView,200);
	return true;
}

function moveUp(){
	if(!canMoveUp(board))
		return false;
	//moveTop
	for(var j=0;j<4;j++)
		for(var i=1;i<4;i++){
			if(board[i][j] !== 0){
				for(var k=0;k<i;k++){
					if(board[k][j] === 0 && noBlockVertical(k,i,j,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
					}else if(board[k][j] == board[i][j] && noBlockVertical(k,i,j,board) && !hasConflicted[k][j]){
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j] *= 2;
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);
						hasConflicted[k][j] = true;
					}
				}
			}
		}
	setTimeout(updateBoardView,200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board))
		return false;
	//moveRight
	for(var i=0;i<4;i++)
		for(var j=2;j>=0;j--){
			if(board[i][j] !== 0){
				for(var k=3;k>j;k--){
					if(board[i][k] === 0 && noBlockHorizontal(i,j,k,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
					}else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] *= 2;
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);
						hasConflicted[i][k] = true;
					}
				}
			}
		}
	setTimeout(updateBoardView,200);
	return true;
}

function moveDown(){
	if(!canMoveDown(board))
		return false;
	//moveDown
	for(var j=0;j<4;j++)
		for(var i=2;i>=0;i--){
			if(board[i][j] !== 0){
				for(var k=3;k>i;k--){
					if(board[k][j] === 0 && noBlockVertical(i,k,j,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
					}else if(board[k][j] == board[i][j] && noBlockVertical(i,k,j,board) && !hasConflicted[k][j]){
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j] *= 2;
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);
						hasConflicted[k][j] = true;
					}
				}
			}
		}
	setTimeout(updateBoardView,200);
	return true;
}

function isgameover(){
	if(nospace(board) && nomove(board)){
		gameover();
	}
}

function gameover(){
	alert("gameover!");
}
