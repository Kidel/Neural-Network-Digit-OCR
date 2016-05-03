var express = require('express');
var router = express.Router();

var fileParse = require('../modules/fileParse');

var testSetModel = require('../models/testSetModel.js');
var trainingSetModel = require('../models/trainingSetModel.js');
var networkModel = require('../models/networkModel.js');

var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var net = new Architect.Perceptron(1024,30,10);
router.trainingDone = false;

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

/* GET home page. */
router.get('/', function(req, res, next) {
    trainingSetModel.findOne({}).exec(function (err, result) {
        var status = "";
        var canStore = false;
        if (err) {
            status = err;
            canStore = false;
        }
        if(!result && status == "") {
            status = "The database is empty, store the data first";
            canStore = true;
        }
        else if(status == "") {
            status = "Data has been already stored";
            canStore = false;
        }
        res.render('index', {
            title: 'Neural-Digits', 
            text: 'https://github.com/Kidel/Neural-Digits',
            databaseStatus: status,
            canStore: canStore
        });
    });
});

router.get('/store', function(req, res, next) {
    var io = req.io;
    fileParse.parseAllFiles('public/digits/trainingDigits/', function(err) {
        if(err) return res.json(500, { message: 'Error getting data' });
        fileParse.parseAllFiles('public/digits/testDigits/', function(err) {
            if(err) return res.json(500, { message: 'Error getting data' });
            io.emit('storingStatus', "Data stored with no errors");
        });
    });
    res.json("Storing data");
});

router.get('/train', function(req, res, next) {
    var io = req.io;
    var trainer = null;
    var ocr = null;
    var iterations = 100;
    router.trainingDone = false;
    trainingSetModel.find({}).select({input:1, output:1, _id:0}).exec(function(err, trainingSet){
        if(err) return res.json(500, { message: 'Error getting data' });
        var sqrt = Math.floor(Math.sqrt(iterations));
        var options = {
            rate:  0.03,
            decay: 0.02/(sqrt*2),
            iterations: Math.floor(sqrt/2),
            error: 0.000001,
            shuffle: true,
            log: true,
            cost: Trainer.cost.CROSS_ENTROPY
        };
        for(var i=0; i<(sqrt*2); i++){
            trainer = new Trainer(net, options);
            ocr = trainer.train(trainingSet);
            console.log(ocr);
            options.error = 0.001;
            options.rate -= options.decay;
        }
        console.log("Training done!");
        io.emit('testingStatus', "<-");
        io.emit('trainingStatus', "Training done!");
        router.trainingDone = true;
    });
    res.json("Training started, should end in about " + Math.floor(1+(iterations*10)/60) + " minutes");
});

router.get('/test', function(req, res, next) {
    var io = req.io;
    testSetModel.find({}).select({input:1, output:1, _id:0}).exec(function(err, testSet){
        if(err) return res.json(500, { message: 'Error getting data' });
        try {
            var testData="";
            if(!router.trainingDone) testData += "You need to train the network first, however here are the stats for now. ";
            var good = 0;
            var matrix = [];
            for(var i=0; i<10; i++){
                if(typeof matrix[i]=="undefined") matrix[i] = [];
                for(var j=0; j<10; j++){
                    if(typeof matrix[i][j]=="undefined") matrix[i][j] = 0;
                }
            }
            for(var k in testSet) {
                var app = net.activate(testSet[k].input).map(function(arg) {return arg.toFixed(3)});
                var appT = testSet[k].output.map(function(arg) {return arg.toFixed(3)});
                if(indexOfMax(app) == indexOfMax(appT)){
                    good++;
                }
                for(var i in app){
                    if(indexOfMax(app) == i)
                        for(var j in appT){
                            if(indexOfMax(appT) == j) matrix[i][j]++;
                        }
                }
            }
            console.log("predictions");
            console.log(matrix);
            testData += "Tested " + testSet.length + " inputs, " + good + " were correct, rate of " + Math.floor((good/testSet.length)*100) + "%. ";
            //res.render('index', { title: 'Test', text: testData});
            io.emit('testingStatus', testData);
        }
        catch (e) {
            console.log(e);
            //res.render('index', { title: 'Test', text: "You need to train the network first" });
            io.emit('testingStatus', "You need to train the network first");
        }
    });
    res.json("Testing started, will end soon");
});

router.post('/testCharacter', function(req, res, next) {
    var letter = req.body.letter.replace(/[\n\r]+/g, '').split(",").map(Number);
    try {
        if(!router.trainingDone) throw "You need to train the network first";
        else {
            var result = net.activate(letter);
            //console.log(letter[0])
            //console.log(result)
            res.json({"It's a": indexOfMax(result), output: result.map(function(arg, index) {return "'" + index + "':" + Math.floor(arg*100)+"%"})});
        }
    }
    catch (e) {
        res.json(e);
    }
});

router.get('/storeNetwork', function(req, res, next) {
    var io = req.io;
    var networkData = new networkModel({network: JSON.stringify(net.toJSON())});
    networkModel.remove({}, function(err) {
        if (err) {
            console.log("Error deleting the old network");
            io.emit('storeNetStatus', "Error deleting the old network");
        }
        else {
            networkData.save(function (err2, networkData) {
                if (err2) {
                    console.log("Error storing the network");
                    io.emit('storeNetStatus', "Error storing the network");
                }
                else {
                    console.log("Network data stored");
                    io.emit('storeNetStatus', "Network data stored");
                }
            });
            console.log("Storing new data...");
            io.emit('storeNetStatus', "Storing new data...");
        }
    });
    res.json("Deleting the old network...");
});

router.get('/loadNetwork', function(req, res, next) {
    var io = req.io;
    networkModel.findOne({}, function(err, networkData) {
        if (err) {
            console.log("Error loading the network");
            io.emit('loadNetStatus', "Error loading the network");
        }
        else {
            var networkImport = JSON.parse(networkData.network);
            net = Network.fromJSON(networkImport);
            router.trainingDone = true;
            console.log("Network data loaded");
            io.emit('testingStatus', "<-");
            io.emit('trainingStatus', "Training done!");
            io.emit('loadNetStatus', "Network data loaded");
        }
    });
    res.json("Loading a saved network...");
});

module.exports = router;
