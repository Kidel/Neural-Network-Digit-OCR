var trainingSetModel = require('../models/trainingSetModel.js');

/**
 * trainingSetController.js
 *
 * @description :: Server-side logic for managing trainingSets.
 */
module.exports = {

    /**
     * trainingSetController.list()
     */
    list: function(req, res) {
        trainingSetModel.find(function(err, trainingSets){
            if(err) {
                return res.json(500, {
                    message: 'Error getting trainingSet.'
                });
            }
            return res.json(trainingSets);
        });
    },

    /**
     * trainingSetController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        trainingSetModel.findOne({_id: id}, function(err, trainingSet){
            if(err) {
                return res.json(500, {
                    message: 'Error getting trainingSet.'
                });
            }
            if(!trainingSet) {
                return res.json(404, {
                    message: 'No such trainingSet'
                });
            }
            return res.json(trainingSet);
        });
    },

    /**
     * trainingSetController.create()
     */
    create: function(req, res) {
        var trainingSet = new trainingSetModel({			input : req.body.input,			output : req.body.output
        });

        trainingSet.save(function(err, trainingSet){
            if(err) {
                return res.json(500, {
                    message: 'Error saving trainingSet',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: trainingSet._id
            });
        });
    },

    /**
     * trainingSetController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        trainingSetModel.findOne({_id: id}, function(err, trainingSet){
            if(err) {
                return res.json(500, {
                    message: 'Error saving trainingSet',
                    error: err
                });
            }
            if(!trainingSet) {
                return res.json(404, {
                    message: 'No such trainingSet'
                });
            }

            trainingSet.input =  req.body.input ? req.body.input : trainingSet.input;			trainingSet.output =  req.body.output ? req.body.output : trainingSet.output;			
            trainingSet.save(function(err, trainingSet){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting trainingSet.'
                    });
                }
                if(!trainingSet) {
                    return res.json(404, {
                        message: 'No such trainingSet'
                    });
                }
                return res.json(trainingSet);
            });
        });
    },

    /**
     * trainingSetController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        trainingSetModel.findByIdAndRemove(id, function(err, trainingSet){
            if(err) {
                return res.json(500, {
                    message: 'Error getting trainingSet.'
                });
            }
            return res.json(trainingSet);
        });
    }
};