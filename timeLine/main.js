var GRID_ROW = 1;
var GRID_COL = 8;
var GRID = GRID_ROW * GRID_COL;
var timer;
var hasStarted = false;
var UPDATE_INTERVAL = 5000;
var FRAME_WIDTH = 120;
var FRAME_HEIGHT = 80;
var curr_frame = 0;
var video = document.getElementById("video");
var timeline = document.getElementById("timeline");
var cxt = timeline.getContext("2d");

function startVideo(){
    if(hasStarted){
        return;
    }
    hasStarted = true;
    updateFrame();
    timer = setInterval(updateFrame, UPDATE_INTERVAL);
    timeline.onclick = function(event){
        var offX = event.clientX - timeline.offsetLeft;
        var offY = event.clientY - timeline.offsetTop;
        var clickFrame = Math.floor(offY / FRAME_HEIGHT) * GRID_COL;
        clickFrame += Math.floor(offX / FRAME_WIDTH);
        var seekedFrame = Math.floor(curr_frame / GRID) * GRID + clickFrame;
        if(seekedFrame > curr_frame){
            seekedFrame -= GRID;
        }
        if(seekedFrame < 0){
            return;
        }
        video.currentTime = seekedFrame * UPDATE_INTERVAL / 1000;
        curr_frame = seekedFrame;
    };
}

function updateFrame(){
    var framePosition =  curr_frame % GRID;
    var posX = framePosition % GRID_COL * FRAME_WIDTH;
    var posY = Math.floor(framePosition / GRID_COL) * FRAME_HEIGHT;
    cxt.drawImage(video, 0, 0, 800, 75, posX, posY, FRAME_WIDTH, FRAME_HEIGHT);
    curr_frame++;
}

function stopTimeline(){
    clearInterval(timer);
}
