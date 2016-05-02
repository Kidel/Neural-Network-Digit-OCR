function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function getPage(urlServer, elementId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var status = xhttp.status; // HTTP response status, e.g., 200 for "200 OK"
        var responseText = xhttp.responseText; // Returned data, e.g., an HTML document.
        if(status!=200){
            document.getElementById(elementId).style.color = "red";
        } else {
            document.getElementById(elementId).style.color = "black";
        }
        document.getElementById(elementId).innerHTML = responseText.replace(/["]+/g, '');
    };
    xhttp.open("GET", urlServer, true);
    xhttp.send();
}