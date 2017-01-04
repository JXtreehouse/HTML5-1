var canvas,
    context,
    canvas_width,
    canvas_height,
    row = 50,
    col = 50,
    grid_width,
    grid_height;

function init(){
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas_width = canvas.width;
    canvas_height = canvas.height;
    drawBg(context);
    drawAxis(context);
    writePoint(context);
}

//画背景灰色线
function drawBg(cxt){
    var i = 0;
    grid_width = Math.floor(canvas_width / col);
    grid_height = Math.floor(canvas_height / row);
    for(i=0;i<row;i++){
        cxt.moveTo(0, i * grid_height);
        cxt.lineTo(canvas_width, i * grid_height);
    }
    for(i=0;i<col;i++){
        cxt.moveTo(i * grid_width, 0);
        cxt.lineTo(i * grid_width, canvas_height);
    }
    cxt.strokeStyle = '#ccc';
    cxt.lineWidth = 0.5;
    cxt.stroke();
}

function drawAxis(cxt){
    cxt.save(); //为啥注释掉也没影响呢？
    //画x轴
    cxt.beginPath();
    cxt.moveTo(0, 4 * grid_height);
    cxt.lineTo((Math.floor(col / 2) - 1) * grid_width, 4 * grid_height);
    cxt.font = 'bold 40px'; //为啥不好使？
    cxt.fillText('x', Math.floor(col / 2) * grid_width - 3, 4 * grid_height + 3);
    cxt.moveTo((Math.floor(col / 2) + 1) * grid_width, 4 * grid_height);
    cxt.lineTo(canvas_width, 4 * grid_height);
    cxt.moveTo(canvas_width - 5, 4 * grid_height - 5);
    cxt.lineTo(canvas_width, 4 * grid_height);
    cxt.lineTo(canvas_width - 5, 4 * grid_height + 5);
    //画y轴
    cxt.moveTo(6 * grid_width, 0);
    cxt.lineTo(6 * grid_width, (Math.floor(row / 2) - 1) * grid_height);
    cxt.fillText('y', 6 * grid_width - 3, Math.floor(row / 2) * grid_height + 3);
    cxt.moveTo(6 * grid_width, (Math.floor(row / 2) + 1) * grid_height);
    cxt.lineTo(6 * grid_width, canvas_height);
    cxt.moveTo(6 * grid_width - 5, canvas_height - 5);
    cxt.lineTo(6 * grid_width, canvas_height);
    cxt.lineTo(6 * grid_width + 5, canvas_height - 5);
    cxt.closePath();
    cxt.strokeStyle = '#000';
    cxt.lineWidth = 0.3;
    cxt.stroke();
    cxt.restore();
}

function writePoint(cxt){
    cxt.fillRect(0, 0, 3, 3);
    cxt.fillText('(0, 0)', 10, 15);
    cxt.fillRect(canvas_width-3, canvas_height-3, 3, 3);
    var str = '(' + canvas_width + ', ' + canvas_height + ')';
    cxt.textAlign = 'right';
    cxt.textBaseline = 'bottom';
    cxt.fillText(str, canvas_width-5, canvas_height-5);
}

init();
