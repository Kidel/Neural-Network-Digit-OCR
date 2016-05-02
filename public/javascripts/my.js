var socket = io();
socket.on('trainingStatus', function(msg){
    document.getElementById("trainingStatus").innerHTML = msg;
});
socket.on('testingStatus', function(msg){
    document.getElementById("testingStatus").innerHTML = msg;
});
socket.on('storingStatus', function(msg){
    document.getElementById("storingStatus").innerHTML = msg;
});