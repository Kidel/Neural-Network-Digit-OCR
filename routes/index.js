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

var myPerceptron = new Architect.Perceptron(1024, 10, 1);
var trainer = new Trainer(myPerceptron);

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
    trainingSetModel.find(function(err, trainingSet){
        if(err) return res.json(500, { message: 'Error getting data' });
        trainer.train(trainingSet, {
            rate: .1,
            iterations: 50,
            error: .005
        });
        res.render('index', { title: 'Index', text: "Training done" });
    });
});

router.get('/test', function(req, res, next) {
    testSetModel.find(function(err, testSet){
        if(err) return res.json(500, { message: 'Error getting data' });
        res.render('index', { title: 'Index', text: myPerceptron.activate(testSet[200].input)[0] + " " +  testSet[200].output});
    });
});

router.post('/testCharacter', function(req, res, next) {
    var letter = req.body.letter.replace(/[\n\r]+/g, '').split(",").map(Number);
    res.json(myPerceptron.activate(letter)[0]);
});

module.exports = router;
