var AnswerModel = require('../models/answerModel.js');
const QuestionModel = require('../models/questionModel.js');
const userModel = require('../models/userModel.js');

async function unselectAnswers(id) {
    const selected = await AnswerModel.find({ $and: [{ accepted: true }, { questionID: id }] }).exec()

    for (answer of selected) {
        if (answer.accepted == true) {

            answer.accepted = false
            answer.save(function (err, answer) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer.',
                        error: err
                    });
                }
            });
        }
    }
}


/**
 * answerController.js
 *
 * @description :: Server-side logic for managing answers.
 */
module.exports = {

    /**
     * answerController.list()
     */
    list: function (req, res) {
        AnswerModel.find({questionID : req.params.id}, function (err, answers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }

            data = [];
            data.answers = answers;
            data.answers = data.answers.reverse()
            data.count = 0
            for (answer of answers) {
                data.count++
            }
            return res.render('answer/userList', data);
        });
    },

    /**
     * answerController.show()
     */
    show: async function (req, res) {
        var id = req.params.id;
        var qID = req.params.questionID
        await unselectAnswers(qID)
        AnswerModel.findOne({_id: id}, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }
            answer.accepted = true ? true : answer.accepted;
            answer.save(function (err, answer) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer.',
                        error: err
                    });
                }
            });

            return res.redirect('/questions/myAnswers/'+answer.questionID);
        });
    },

    /**
     * answerController.create()
     */
    create: function (req, res) {
        if (!req.sessionID) {
            return res.redirect('/error', {message: "neprijavljen uporabnik"});
        }

        var answer = new AnswerModel({
			content : req.body.content,
			accepted : false,
			userID : req.session.userId,
			questionID : req.body.questionID,
            date: new Date()
        });

        answer.save(function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating answer',
                    error: err
                });
            }

            return res.redirect('questions/' + answer.questionID);
        });
    },

    /**
     * answerController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        AnswerModel.findOne({_id: id}, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }

            answer.content = req.body.content ? req.body.content : answer.content;
			answer.accepted = req.body.accepted ? req.body.accepted : answer.accepted;
			answer.userID = req.body.userID ? req.body.userID : answer.userID;
			answer.questionID = req.body.questionID ? req.body.questionID : answer.questionID;
			
            answer.save(function (err, answer) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer.',
                        error: err
                    });
                }

                return res.json(answer);
            });
        });
    },

    /**
     * answerController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        var qID = req.params.questionID

        AnswerModel.findByIdAndRemove(id, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the answer.',
                    error: err
                });
            }

            return res.redirect('/questions/myAnswers/' + qID);
        });
    }
};
