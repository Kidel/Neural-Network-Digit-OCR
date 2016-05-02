"use strict";
var context = document.getElementById('sheet').getContext("2d");
var canvas = document.getElementById('sheet');
context = canvas.getContext("2d");
context.strokeStyle = "#666666"; var RED = 102; //#66 = 102
context.lineJoin = "round";
context.lineWidth = 26;

var clickX = [];
var clickY = [];
var clickDrag = [];
var paint;

var WIDTH = 32;
var HEIGHT = 32;

/**
 * Add information where the user clicked at.
 * @param {number} x
 * @param {number} y
 * @return {boolean} dragging
 */
function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

/**
 * Resets the complete canvas.
 */
function resetCanvas() {
    // Clears the canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

/**
 * Redraw the complete canvas.
 */
function redraw() {
    // Clears the canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (var i = 0; i < clickX.length; i += 1) {
        if (!clickDrag[i] && i == 0) {
            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        } else if (!clickDrag[i] && i > 0) {
            context.closePath();

            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        } else {
            context.lineTo(clickX[i], clickY[i]);
            context.stroke();
        }
    }
}

/**
 * Draw the newly added point.
 * @return {void}
 */
function drawNew() {
    var i = clickX.length - 1;
    if (!clickDrag[i]) {
        if (clickX.length == 0) {
            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        } else {
            context.closePath();

            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        }
    } else {
        context.lineTo(clickX[i], clickY[i]);
        context.stroke();
    }
}

function mouseDownEventHandler(e) {
    paint = true;
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    if (paint) {
        addClick(x, y, false);
        drawNew();
    }
}

function touchstartEventHandler(e) {
    paint = true;
    if (paint) {
        addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, false);
        drawNew();
    }
}

function mouseUpEventHandler(e) {
    context.closePath();
    paint = false;
}

function mouseMoveEventHandler(e) {
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    if (paint) {
        addClick(x, y, true);
        drawNew();
    }
}

function touchMoveEventHandler(e) {
    if (paint) {
        addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, true);
        drawNew();
    }
}

function setUpHandler(isMouseandNotTouch, detectEvent) {
    removeRaceHandlers();
    if (isMouseandNotTouch) {
        canvas.addEventListener('mouseup', mouseUpEventHandler);
        canvas.addEventListener('mousemove', mouseMoveEventHandler);
        canvas.addEventListener('mousedown', mouseDownEventHandler);
        mouseDownEventHandler(detectEvent);
    } else {
        canvas.addEventListener('touchstart', touchstartEventHandler);
        canvas.addEventListener('touchmove', touchMoveEventHandler);
        canvas.addEventListener('touchend', mouseUpEventHandler);
        touchstartEventHandler(detectEvent);
    }
}

function mouseWins(e) {
    setUpHandler(true, e);
}

function touchWins(e) {
    setUpHandler(false, e);
}

function removeRaceHandlers() {
    canvas.removeEventListener('mousedown', mouseWins);
    canvas.removeEventListener('touchstart', touchWins);
}

//name: Hermite resize
//about: Fast image resize/resample using Hermite filter with JavaScript.
//author: ViliusL
//demo: http://viliusle.github.io/miniPaint/
function resample_hermite(canvas, W, H, W2, H2){
    var time1 = Date.now();
    W2 = Math.round(W2);
    H2 = Math.round(H2);
    var img = canvas.getContext("2d").getImageData(0, 0, W, H);
    var img2 = canvas.getContext("2d").getImageData(0, 0, W2, H2);
    var data = img.data;
    var data2 = img2.data;
    var ratio_w = W / W2;
    var ratio_h = H / H2;
    var ratio_w_half = Math.ceil(ratio_w/2);
    var ratio_h_half = Math.ceil(ratio_h/2);

    for(var j = 0; j < H2; j++){
        for(var i = 0; i < W2; i++){
            var x2 = (i + j*W2) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r= 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            for(var yy = Math.floor(j * ratio_h); yy < (j + 1) * ratio_h; yy++){
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy*dy //pre-calc part of w
                for(var xx = Math.floor(i * ratio_w); xx < (i + 1) * ratio_w; xx++){
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx*dx);
                    if(w >= -1 && w <= 1){
                        //hermite filter
                        weight = 2 * w*w*w - 3*w*w + 1;
                        if(weight > 0){
                            dx = 4*(xx + yy*W);
                            //alpha
                            gx_a += weight * data[dx + 3];
                            weights_alpha += weight;
                            //colors
                            if(data[dx + 3] < 255)
                                weight = weight * data[dx + 3] / 250;
                            gx_r += weight * data[dx];
                            gx_g += weight * data[dx + 1];
                            gx_b += weight * data[dx + 2];
                            weights += weight;
                        }
                    }
                }
            }
            data2[x2]     = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }
    console.log("hermite = "+(Math.round(Date.now() - time1)/1000)+" s");
    canvas.getContext("2d").clearRect(0, 0, Math.max(W, W2), Math.max(H, H2));
    canvas.width = W2;
    canvas.height = H2;
    canvas.getContext("2d").putImageData(img2, 0, 0);
}

function getData() {
    var c=document.getElementById("sheet");
    var resizeCanvas = document.createElement("canvas");
    resizeCanvas.height = c.height;
    resizeCanvas.width = c.width;
    var resizeCtx = resizeCanvas.getContext('2d');
    // Put original canvas contents to the resizing canvas
    resizeCtx.drawImage(c, 0, 0);
    // Resize using Hermite resampling
    resample_hermite(resizeCanvas, c.width, c.height,WIDTH,HEIGHT);
    var ctx=resizeCanvas.getContext("2d");
    var imgData=ctx.getImageData(0,0,WIDTH,HEIGHT);
    var letter = [];
    var i=0;
    for(var pixel=0; pixel<imgData.data.length; pixel+=4){
        letter[i]=Math.floor(imgData.data[pixel]/RED);
        i++;
    }
    for(var j=0; j<letter.length; j+=WIDTH){
        console.log(letter.slice(j, j+WIDTH));
    }
    return letter;
}

function sendCanvas(data, urlServer) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var status = xhttp.status; // HTTP response status, e.g., 200 for "200 OK"
        var responseText = xhttp.responseText; // Returned data, e.g., an HTML document.
        if(status!=200){
            document.getElementById("interpretation").style.color = "red";
        } else {
            document.getElementById("interpretation").style.color = "black";
        }
        document.getElementById("interpretation").innerHTML = responseText;
    };
    xhttp.open("POST", urlServer, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("letter=" + data);
}

canvas.addEventListener('mousedown', mouseWins);
canvas.addEventListener('touchstart', touchWins);