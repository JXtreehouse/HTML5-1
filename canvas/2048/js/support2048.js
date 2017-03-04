documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92*documentWidth;
cellSideLength = 0.18*documentWidth;//棋盘格的宽度
cellSpace = 0.04*documentWidth;//棋盘格间距的宽度

//计算每个单元格的top值
function getPosTop(i,j){
	return cellSpace + i * (cellSpace + cellSideLength);
}

//计算每个单元格的left值
function getPosLeft(i,j){
	return cellSpace + j * (cellSpace + cellSideLength);
}

//设置每个方格的背景颜色
function getNumberBackgroundColor(number){
	switch(number){
		case 2:return "#eee4da";break;
		case 4:return "#ede0c8";break;
		case 8:return "#f2b179";break;
		case 16:return "#f59563";break;
		case 32:return "#f67c5f";break;
		case 64:return "#f65e3b";break;
		case 128:return "#edcf72";break;
		case 256:return "#edcc61";break;
		case 512:return "#9c0";break;
		case 1024:return "#33b5e5";break;
		case 2048:return "#09c";break;
		case 4096:return "#a6c";break;
		case 8192:return "#93c";break;
	}
	return "black";
}

//设置每个方格的颜色
function getNumberColor(number){
	if(number<=4){
		return "#776e65";
	}
	return "white";
}

//判断是否还有空间
function nospace(board){
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			if(board[i][j] == 0)
				return false;
		}
	return true;
}

//判断是否可以向左移动
function canMoveLeft(board){
	for(var i=0;i<4;i++)
		for(var j=1;j<4;j++)
			if(board[i][j] != 0)
				if(board[i][j-1] == 0 || board[i][j-1] == board[i][j])
					return true;
	return false;
}

//判断是否可以向上移动
function canMoveUp(board){
	for(var j=0;j<4;j++)
		for(var i=1;i<4;i++)
			if(board[i][j] != 0)
				if(board[i-1][j] == 0 || board[i-1][j] == board[i][j])
					return true;
	return false;
}

//判断是否可以向右移动
function canMoveRight(board){
	for(var i=0;i<4;i++)
		for(var j=2;j>=0;j--)
			if(board[i][j] != 0)
				if(board[i][j+1] == 0 || board[i][j+1] == board[i][j])
					return true;
	return false;
}

//判断是否可以向下移动
function canMoveDown(board){
	for(var j=0;j<4;j++)
		for(var i=2;i>=0;i--)
			if(board[i][j] != 0)
				if(board[i+1][j] == 0 || board[i+1][j] == board[i][j])
					return true;
	return false;
}

//判断第row行第col1列和第col2列之间是否有障碍物
function noBlockHorizontal(row,col1,col2,board){
	for(var i=col1+1;i<col2;i++)
		if(board[row][i] != 0)
			return false;
	return true;
}

//判断第row1行第j列和第col2列第j列之间是否有障碍物
function noBlockVertical(row1,row2,col,board){
	for(var i=row1+1;i<row2;i++)
		if(board[i][col] != 0)
			return false;
	return true;
}

//移动方块
function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell = $("#number-cell-" + fromx + "-" + fromy);
	numberCell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},200);
}

//判断是否还可以移动
function nomove(board){
	if(canMoveLeft(board) || canMoveUp(board) || canMoveRight(board) || canMoveDown(board))
		return false;
	return true;
}
