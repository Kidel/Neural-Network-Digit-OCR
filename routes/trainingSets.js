var express = require('express');
var router = express.Router();
var trainingSetController = require('../controllers/trainingSetController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    trainingSetController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    trainingSetController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    trainingSetController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    trainingSetController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    trainingSetController.remove(req, res);
});

module.exports = router;