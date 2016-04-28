var express = require('express');
var router = express.Router();

var fileParse = require('../modules/fileParse');

var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index', text: 'Still nothing here' });
});


// TODO test this
router.get('/store', function(req, res, next) {
  fileParse.parseAllFiles('public/digits/trainingDigits/', function() {
  	fileParse.parseAllFiles('public/digits/testDigits/', function() {
  		res.render('index', { title: 'Store', text: 'Data Stored' });
  	})
  });
});

// TODO learn

// TODO test

module.exports = router;
