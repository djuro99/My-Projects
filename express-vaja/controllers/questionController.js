const QuestionModel = require('../models/questionModel.js');
const userModel = require('../models/userModel.js');
const AnswerModel = require('../models/answerModel.js');
const { createIndexes } = require('../models/answerModel.js');
const CommentModel = require('../models/commentModel.js');

async function getUserById(userId) {
    const user = await userModel.findById(userId).exec()
    if (!user)
        return ""
    return user.username
}

async function getUserPathById(userId) {
    const user = await userModel.findById(userId).exec()
    if (!user)
        return ""
    return user.path
}

async function getUserQuestions(userId) {
    const questions = await QuestionModel.find({userID: userId}).exec()
    return questions
}

async function getUserAnswers(userId) {
    const answers = await AnswerModel.find({userID: userId}).exec()
    return answers
}

async function getAcceptedUserAnswers(userId) {
    const answers = await AnswerModel.find({ $and: [{ accepted: true }, {userID: userId}]}).exec()
    return answers
}

async function getComments(questionId) {
    const comments = await CommentModel.find({foreignID: questionId}).exec()
    return comments
}

/**
 * questionController.js
 *
 * @description :: Server-side logic for managing questions.
 */
module.exports = {

    /**
     * questionController.list()
     */
    list: function (req, res) {
        QuestionModel.find(async function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            data = [];
            data.questions = questions;
            data.questions = data.questions.reverse()
            for (let question of data.questions) {
                question.comments = await getComments(question._id)
                question.comments = question.comments.reverse()
            }
            for (let question of data.questions)
            {
                question.username = await getUserById(question.userID)
                question.path = await getUserPathById(question.userID)
                for (let comment of question.comments) {
                    comment.username = await getUserById(comment.userID)
                    comment.path = await getUserPathById(comment.userID)
                }
            }
            return res.render('question/list', data);
        });
    },

    searchByTag: function (req, res) {
        if (req.body.tags == "") {
            return res.redirect('../questions')
        }
        else {
            QuestionModel.find({ tags: req.body.tags }, async function (err, questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting question.',
                        error: err
                    });
                }

                data = [];
                data.questions = questions;
                data.questions = data.questions.reverse()
                for (let question of data.questions) {
                    question.comments = await getComments(question._id)
                    question.comments = question.comments.reverse()
                }
                for (let question of data.questions)
                {
                    question.username = await getUserById(question.userID)
                    question.path = await getUserPathById(question.userID)
                    for (let comment of question.comments) {
                        comment.username = await getUserById(comment.userID)
                        comment.path = await getUserPathById(comment.userID)
                    }
                }
                return res.render('question/list', data);
            });
        }
    },

    userList:  function (req, res) {
        QuestionModel.find({userID: req.session.userId}, async function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            data = [];
            data.questions = questions;
            data.questions = data.questions.reverse()
            data.count = 0
            for (let question of data.questions) {
                question.comments = await getComments(question._id)
                question.comments = question.comments.reverse()
            }
            for (let question of data.questions)
            {
                question.username = await getUserById(question.userID)
                question.path = await getUserPathById(question.userID)
                for (let comment of question.comments) {
                    comment.username = await getUserById(comment.userID)
                    comment.path = await getUserPathById(comment.userID)
                }
            }
            return res.render('question/userList', data);
        });
    },

    /**
     * questionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        AnswerModel.find({questionID: id}, async function (err, answers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            if (!answers) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }
         
            let accepted = null
            data = [];
            data.answers = answers
            data.answers = data.answers.reverse()
            for (let answer of data.answers) {
                answer.comments = await getComments(answer._id)
                answer.comments = answer.comments.reverse()
            }
            for (let answer of data.answers)
            {
                answer.username = await getUserById(answer.userID)
                answer.path = await getUserPathById(answer.userID)
                for (let comment of answer.comments) {
                    comment.username = await getUserById(comment.userID)
                    comment.path = await getUserPathById(comment.userID)
                }
            }
            return res.render('answer/list', data);
        });
    },

    answerUserList: function (req, res) {
        var id = req.params.id;

        AnswerModel.find({questionID: id}, async function (err, answers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            if (!answers) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }
            data = [];
            data.answers = answers;
            data.answers = data.answers.reverse()
            for (let answer of data.answers) {
                answer.comments = await getComments(answer._id)
                answer.comments = answer.comments.reverse()
            }
            for (let answer of data.answers)
            {
                answer.username = await getUserById(answer.userID)
                answer.path = await getUserPathById(answer.userID)
                for (let comment of answer.comments) {
                    comment.username = await getUserById(comment.userID)
                    comment.path = await getUserPathById(comment.userID)
                    comment.qID = id
                }
            }

            return res.render('answer/userList', data);
        });
    },

    profile: function (req, res, next) {
        userModel.findById(req.params.id)
        .exec(async function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user == null) {
                    var err = new Error('Not authorized!');
                    err.status = 400;
                    return next(err);
                } else {
                    data = []
                    data.user = user
                    data.questions = await getUserQuestions(user._id)
                    data.answers = await getUserAnswers(user._id)
                    data.acceptedAnswers = await getAcceptedUserAnswers(user._id)
                    data.user.questionCount = 0
                    data.user.answerCount = 0
                    data.user.acceptedCount = 0
                    for (let question in data.questions) {
                        data.user.questionCount++
                    }
                    for (let answer in data.answers) {
                        data.user.answerCount++                      
                    }
                    for (let answer in data.acceptedAnswers) {
                        data.user.acceptedCount++                      
                    }
                    res.render('user/userProfile', data);
                }
            }
        });
    },

    addAnswer: function (req, res) {
        var id = req.params.id;

        QuestionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }

            return res.render('answer/addAnswer', {"id":id});
        });
    },

    /**
     * questionController.create()
     */
    create: function (req, res) {
        if (!req.sessionID) {
            return res.redirect('/error', {message: "neprijavljen uporabnik"});
        }
        var question = new QuestionModel({
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            date: new Date(),
            userID: req.session.userId
        });

       

        question.save(function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating question',
                    error: err
                });
            }

            return res.redirect('questions/userList');
        });
    },

    add: function(req, res){
        return res.render('question/addQuestion');
    },

    /**
     * questionController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        QuestionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question',
                    error: err
                });
            }

            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }

            question.title = req.body.title ? req.body.title : question.title;
			question.description = req.body.description ? req.body.description : question.description;
			question.tags = req.body.tags ? req.body.tags : question.tags;
			question.date = req.body.date ? req.body.date : question.date;
			
            question.save(function (err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating question.',
                        error: err
                    });
                }

                return res.json(question);
            });
        });
    },

    /**
     * questionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        QuestionModel.findByIdAndRemove(id, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the question.',
                    error: err
                });
            }

            return res.redirect('../userList');
        });
    }
};
