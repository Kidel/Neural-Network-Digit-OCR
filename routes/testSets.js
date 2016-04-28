var express = require('express');
var router = express.Router();
var testSetController = require('../controllers/testSetController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    testSetController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    testSetController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    testSetController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    testSetController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    testSetController.remove(req, res);
});

module.exports = router;