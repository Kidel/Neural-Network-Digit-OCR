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

var net = new Architect.Perceptron(1024,9,1);
var trainer = null;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Index', text: 'Go to /store to transfer data to the database, then go to /train to start training, and then finally you can use the canvas down here to test the neural network' });
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
		trainer = new Trainer(net);
        var ocr = trainer.train(trainingSet) // TODO persist ocr somehow
        res.render('index', { title: 'Index', text: "Training done" });
    });
});

router.get('/test', function(req, res, next) {
    testSetModel.find({}).select({input:1, output:1, _id:0}).exec(function(err, testSet){
        if(err) return res.json(500, { message: 'Error getting data' });
		try {
			res.render('index', { title: 'Index', text: net.activate(testSet[200].input) + " " +  testSet[200].output});
		}
		catch (e) {
			res.render('index', { title: 'Index', text: "You need to train the network first" });
		}	
    });
});

router.post('/testCharacter', function(req, res, next) {
    var letter = req.body.letter.replace(/[\n\r]+/g, '').split(",").map(Number);
	try {
		if(trainer==null) throw "You need to train the network first";
		else {
			var result = net.activate(letter)[0];
			//console.log(letter[0])
			//console.log(result)
			res.json(result);
		}
	}
	catch (e) {
		res.json(e);
	}
});

module.exports = router;
