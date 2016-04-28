var testSetModel = require('../models/testSetModel.js');

/**
 * testSetController.js
 *
 * @description :: Server-side logic for managing testSets.
 */
module.exports = {

    /**
     * testSetController.list()
     */
    list: function(req, res) {
        testSetModel.find(function(err, testSets){
            if(err) {
                return res.json(500, {
                    message: 'Error getting testSet.'
                });
            }
            return res.json(testSets);
        });
    },

    /**
     * testSetController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        testSetModel.findOne({_id: id}, function(err, testSet){
            if(err) {
                return res.json(500, {
                    message: 'Error getting testSet.'
                });
            }
            if(!testSet) {
                return res.json(404, {
                    message: 'No such testSet'
                });
            }
            return res.json(testSet);
        });
    },

    /**
     * testSetController.create()
     */
    create: function(req, res) {
        var testSet = new testSetModel({
            input : req.body.input,
            output : req.body.output
        });

        testSet.save(function(err, testSet){
            if(err) {
                return res.json(500, {
                    message: 'Error saving testSet',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: testSet._id
            });
        });
    },

    /**
     * testSetController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        testSetModel.findOne({_id: id}, function(err, testSet){
            if(err) {
                return res.json(500, {
                    message: 'Error saving testSet',
                    error: err
                });
            }
            if(!testSet) {
                return res.json(404, {
                    message: 'No such testSet'
                });
            }

            testSet.input =  req.body.input ? req.body.input : testSet.input;
            testSet.output =  req.body.output ? req.body.output : testSet.output;

            testSet.save(function(err, testSet){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting testSet.'
                    });
                }
                if(!testSet) {
                    return res.json(404, {
                        message: 'No such testSet'
                    });
                }
                return res.json(testSet);
            });
        });
    },

    /**
     * testSetController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        testSetModel.findByIdAndRemove(id, function(err, testSet){
            if(err) {
                return res.json(500, {
                    message: 'Error getting testSet.'
                });
            }
            return res.json(testSet);
        });
    }
};