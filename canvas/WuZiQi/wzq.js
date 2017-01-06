var canvas = document.getElementById('canvas');
var cxt = canvas.getContext('2d');
var me = true;
var chessBoard = []; //记录棋盘落子情况数组 二维 0表示为落子 1表示我方已落子 2表示电脑已落子
var winArr = [];  //赢法数组 三维
var myWin = [];  //用户赢数组 一维
var computerWin = []; //电脑赢数组 一维
var count = 0;
var over = false;
var message = document.getElementById('message');
var mask = document.getElementById('mask');
var btn = document.getElementById('gameAgain');

function initArr(){
    var i,j,k;
    //初始化棋盘数组和赢法数组
    for(i=0;i<15;i++){
        winArr[i] = [];
        chessBoard[i] = [];
        for(j=0;j<15;j++){
            winArr[i][j] = [];
            chessBoard[i][j] = 0;
        }
    }
    //横线
    for(i=0;i<15;i++){
        for(j=0;j<11;j++){
            for(k=0;k<5;k++){
                winArr[i][j+k][count] = true;
            }
            count++;
        }
    }
    //竖线
    for(i=0;i<15;i++){
        for(j=0;j<11;j++){
            for(k=0;k<5;k++){
                winArr[j+k][i][count] = true;
            }
            count++;
        }
    }
    //斜线
    for(i=0;i<11;i++){
        for(j=0;j<11;j++){
            for(k=0;k<5;k++){
                winArr[i+k][j+k][count] = true;
            }
            count++;
        }
    }
    //反斜线
    for(i=0;i<11;i++){
        for(j=14;j>3;j--){
            for(k=0;k<5;k++){
                winArr[i+k][j-k][count] = true;
            }
            count++;
        }
    }
    //初始化myWin和computerWin数组
    for(i=0;i<count;i++){
        myWin[i] = 0;
        computerWin[i] = 0;
    }
}

//画棋盘
function drawChessBoard(){
    for(var i=0;i<15;i++){
        cxt.moveTo(15 + 30 * i, 15);
        cxt.lineTo(15 + 30 * i, 435);
        cxt.moveTo(15, 15 + 30 * i);
        cxt.lineTo(435, 15 + 30 * i);
    }
    cxt.strokeStyle = '#BFBFBF';
    cxt.stroke();
}

//画棋子
function drawOneChess(i, j, me){
    cxt.beginPath();
    cxt.arc(15 + 30 * i, 15 + 30 * j, 13, 0, Math.PI * 2);
    cxt.closePath();
    var gradient = cxt.createRadialGradient(15 + 30 * i + 2, 15 + 30 * j - 2, 13, 15 + 30 * i + 2, 15 + 30 * j - 2, 0);
    if(me){
        gradient.addColorStop(0, '#0A0A0A');
        gradient.addColorStop(1, '#636766');
    }else{
        gradient.addColorStop(0, '#D1D1D1');
        gradient.addColorStop(1, '#F9F9F9');
    }
    cxt.fillStyle = gradient;
    cxt.fill();
}

function computerAI(){
    var myScore = [];
    var computerScore = [];
    var i, j, k, u = 0, v = 0;
    var max = 0;
    for(i=0;i<15;i++){
        myScore[i] = [];
        computerScore[i] = [];
        for(j=0;j<15;j++){
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for(i=0;i<15;i++){
        for(j=0;j<15;j++){
            if(chessBoard[i][j] === 0){
                for(k=0;k<count;k++){
                    if(winArr[i][j][k]){
                        if(myWin[k] === 1){
                            myScore[i][j] += 200;
                        }else if(myWin[k] === 2){
                            myScore[i][j] += 400;
                        }else if(myWin[k] === 3){
                            myScore[i][j] += 2000;
                        }else if(myWin[k] === 4){
                            myScore[i][j] += 10000;
                        }
                        if(computerWin[k] === 1){
                            computerScore[i][j] += 220;
                        }else if(computerWin[k] === 2){
                            computerScore[i][j] += 420;
                        }else if(computerWin[k] === 3){
                            computerScore[i][j] += 2100;
                        }else if(computerWin[k] === 4){
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                if(myScore[i][j] > max){
                    max = myScore[i][j];
                    u = i;
                    v = j;
                }else if(myScore[i][j] === max){
                    if(computerScore[i][j] > computerScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
                if(computerScore[i][j] > max){
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                }else if(computerScore[i][j] === max){
                    if(myScore[i][j] > myScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    drawOneChess(u, v, false);
    chessBoard[u][v] = 2;
    for(k=0;k<count;k++){
        if(winArr[u][v][k]){
            computerWin[k]++;
            myWin[k] = 6;
            if(computerWin[k] === 5){
                message.innerHTML = "很遗憾，你输了";
                mask.style.display = "block";
                over = true;
            }
        }
    }
    if(!over){
        me = !me;
    }
}

//落子
function takeChess(e){
    if(over){
        return;
    }
    if(!me){
        return;
    }
    var posX = e.offsetX,
        posY = e.offsetY,
        i = Math.floor(posX / 30),
        j = Math.floor(posY / 30);
    if(chessBoard[i][j] === 0){
        chessBoard[i][j] = 1;
        drawOneChess(i, j, me);
        for(var k=0;k<count;k++){
            if(winArr[i][j][k]){
                myWin[k]++;
                computerWin[k] = 6;  //6表示第k种赢法不可能赢
                if(myWin[k] === 5){
                    message.innerHTML = "恭喜，你赢了";
                    mask.style.display = "block";
                    over = true;
                }
            }
        }
        if(!over){
            me = !me;
            computerAI();
        }
    }
}

function init(){
    drawChessBoard();
    initArr();
    canvas.onclick = takeChess;
    btn.onclick = function(e){
        e.stopPropagation();
        mask.style.display = 'none';
        me = true;
        over = false;
        cxt.clearRect(0, 0, 450, 450);
        drawChessBoard();
        initArr();
    };
}

init();
