var fs = require('graceful-fs');

var trainingSetModel = require('../models/trainingSetModel.js');
var testSetModel = require('../models/testSetModel.js');

// reads all files in a folder and executes the onFileContent function on filename and content
function readFiles(dirname, onFileContent, onError, callback) {
    var err = false;
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(dirname + filename, 'utf-8', function(err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                onFileContent(dirname, filename, content);
            });
        });
    });
    callback(err);
}


function fileToDB(dirname, filename, content){
    input = content.replace(/[\n\r\s]+/g, '').split("").map(Number);
	output=[];
	for(var i=0;i<10;i++){
		output[i]=0;
	}
    output[filename.split("_")[0]*1]=1;

    var setModel;

    if(dirname.indexOf('training') != -1)
        setModel = trainingSetModel;
    else
        setModel = testSetModel;

    var set = new setModel({
        input : input,
        output : output
    });

    set.save(function(err, set){
        if(err) {
            console.log("error: " + err);
        }
        console.log("success");
    });
}


function parseAllFiles(dirname, callback) {
    readFiles(dirname, fileToDB, function(err) {console.log("error: " + err);}, callback);
}


module.exports = {readFiles: readFiles, fileToDB: fileToDB, parseAllFiles: parseAllFiles};