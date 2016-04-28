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
    res.render('index', { title: 'Index', text: 'Still nothing here' });
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
    console.log(req.body.letter);
    res.render('index', { title: 'Index', text: myPerceptron.activate(req.body.letter)[0] });
});

module.exports = router;
