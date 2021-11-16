var ScoreModel = require('../models/ScoreModel.js');

/**
 * ScoreController.js
 *
 * @description :: Server-side logic for managing Scores.
 */
module.exports = {

    /**
     * ScoreController.list()
     */
    list: function (req, res) {
        ScoreModel.find(function (err, Scores) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Score.',
                    error: err
                });
            }

            return res.json(Scores);
        });
    },

    /**
     * ScoreController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ScoreModel.findOne({_id: id}, function (err, Score) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Score.',
                    error: err
                });
            }

            if (!Score) {
                return res.status(404).json({
                    message: 'No such Score'
                });
            }

            return res.json(Score);
        });
    },

    /**
     * ScoreController.create()
     */
    create: function (req, res) {
        var Score = new ScoreModel({
			rank : req.body.rank,
			time : req.body.time,
			points : req.body.points,
			userID : req.body.userID
        });

        Score.save(function (err, Score) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Score',
                    error: err
                });
            }

            return res.status(201).json(Score);
        });
    },

    /**
     * ScoreController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ScoreModel.findOne({_id: id}, function (err, Score) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Score',
                    error: err
                });
            }

            if (!Score) {
                return res.status(404).json({
                    message: 'No such Score'
                });
            }

            Score.rank = req.body.rank ? req.body.rank : Score.rank;
			Score.time = req.body.time ? req.body.time : Score.time;
			Score.points = req.body.points ? req.body.points : Score.points;
			Score.userID = req.body.userID ? req.body.userID : Score.userID;
			
            Score.save(function (err, Score) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Score.',
                        error: err
                    });
                }

                return res.json(Score);
            });
        });
    },

    /**
     * ScoreController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ScoreModel.findByIdAndRemove(id, function (err, Score) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Score.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
