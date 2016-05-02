var express = require('express');
var router = express.Router();

var fileParse = require('../modules/fileParse');

var testSetModel = require('../models/testSetModel.js');
var trainingSetModel = require('../models/trainingSetModel.js');

var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var net = new Architect.Perceptron(1024,30,10);
var trainer = null;

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
    res.render('index', { title: 'Index', text: 'Go to /store to transfer data to the database (only once), then go to /train to start training the NN, and then finally you can use the canvas down here to test the neural network, or go to /test for a validation using the test set' });
});

router.get('/store', function(req, res, next) {
    fileParse.parseAllFiles('public/digits/trainingDigits/', function(err) {
        if(err) return res.json(500, { message: 'Error getting data' });
        fileParse.parseAllFiles('public/digits/testDigits/', function(err) {
            if(err) return res.json(500, { message: 'Error getting data' });

            res.render('index', { title: 'Store', text: 'Data Stored' });
        });
    });
});

router.get('/train', function(req, res, next) {
    trainingSetModel.find({}).select({input:1, output:1, _id:0}).exec(function(err, trainingSet){
        if(err) return res.json(500, { message: 'Error getting data' });
		//console.log(trainingSet[0]);
		var options = {
			rate: 0.03,
			iterations: 10,
			error: 0.000001,
			shuffle: true,
			log: true,
			cost: Trainer.cost.CROSS_ENTROPY
		};
		trainer = new Trainer(net,options);
		for(var i=0; i<10; i++){
			var ocr = trainer.train(trainingSet);
			console.log(ocr);
			options.error = 0.0001;
		}
		//console.log(trainer);
        res.render('index', { title: 'Train', text: "Training done" });
    });
});

router.get('/test', function(req, res, next) {
    testSetModel.find({}).select({input:1, output:1, _id:0}).exec(function(err, testSet){
        if(err) return res.json(500, { message: 'Error getting data' })
		try {
			var testData="";
			if(trainer==null) testData += "You need to train the network first, however here are the stats for now. ";
			var good = 0;
			var a = 0;
			var b = 0;
			var c = 0;
			var d = 0;
			for(var k in testSet) {
				if(indexOfMax(net.activate(testSet[k].input)) == indexOfMax(testSet[k].output)){
					good++;
					a++;
					d+=9;
				}
				else {
					c++;
					b++;
					d+=8;
				}
			}
			testData += "Tested " + testSet.length + " inputs, " + good + " were correct, rate of " + Math.floor((good/testSet.length)*100) + "%. \n a=" + a + " b=" + b + " c=" + c + " d=" + d;
			res.render('index', { title: 'Test', text: testData});
		}
		catch (e) {
			res.render('index', { title: 'Test', text: "You need to train the network first" });
		}	
    });
});

router.post('/testCharacter', function(req, res, next) {
    var letter = req.body.letter.replace(/[\n\r]+/g, '').split(",").map(Number);
	try {
		if(trainer==null) throw "You need to train the network first";
		else {
			var result = net.activate(letter);
			//console.log(letter[0])
			//console.log(result)
			res.json({read: indexOfMax(result), output: result});
		}
	}
	catch (e) {
		res.json(e);
	}
});

module.exports = router;
