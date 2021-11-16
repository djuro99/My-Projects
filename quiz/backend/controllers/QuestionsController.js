const session = require('express-session');
var QuestionsModel = require('../models/QuestionsModel.js');
var scoreModel = require('../models/ScoreModel.js')
var userModel = require('../models/userModel.js')


let startTime = 0
let totalTime = 0
let endTime = 0
let rank = 1
let points = 0
let totalRank = 0
let totalPoints = 0
let userID = ""
let category = ""

function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

/**
 * QuestionsController.js
 *
 * @description :: Server-side logic for managing Questionss.
 */
module.exports = {

    /**
     * QuestionsController.list()
     */
      

    list: function (req, res) {
        QuestionsModel.find(function (err, Questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Questions.',
                    error: err
                });
            }

            return res.json(Questions);
        });
    },
    
    findUser: function (req, res) {
        userModel.findOne({_id: req.session.userId}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            return res.json(user);
        });
    },

    categoryList: function (req, res) {
        var id = req.params.id;
        QuestionsModel.find({category: id}, function (err, Questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Questions.',
                    error: err
                });
            }

            return res.json(Questions);
        });
    },

    userQuestions: function (req, res) {
        var id = req.params.id;
        scoreModel.find({userID: req.session.userId}, function (err, scores) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Questions.',
                    error: err
                });
            }

            return res.json(scores);
        });
    },

    listScore: function (req, res) {
        scoreModel.find(function (err, Scores) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Score.',
                    error: err
                });
            }

            return res.json(Scores);
        });
    },

    generate: function (req, res) {
        category = req.params.cat
        userID = req.session.id
        var Score = new scoreModel({
            rank: totalRank,
            time: totalTime,
            points: totalPoints,
            category: category,
            userID: req.session.id,
            date: new Date()
        });
        Score.save()
        QuestionsModel.find({category: req.params.cat}, function (err, Questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Questions.',
                    error: err
                });
            }
            arr = []
            for(let i = 0; i < Questions[0].results.length; i++)
                arr.push(i)
            shuffle(arr)
            data = []
            for(let i = 0; i < 10; i++){
                data.push(Questions[0].results[arr[i]]);
            }
            date = new Date()
            startTime = date.getSeconds() + date.getMinutes() * 60
            totalTime = 0
            return res.json(data);
        });
    },

    addTime: function(req, res) {
        date = new Date()
        endTime = date.getSeconds() + date.getMinutes() * 60
        endTime -= startTime
        totalTime += endTime
        scoreModel.findOne({userID: userID}, function (err, Score) {
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

			Score.time = totalTime;
			
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

    downgrade: function(req, res) {
        rank -= 0.25
        scoreModel.findOne({userID: userID}, function (err, Score) {
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

			Score.rank = rank;
			
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

    calculatePoints: function(req, res) {
        date = new Date()
        startTime = date.getSeconds() + date.getMinutes() * 60
        totalRank += rank
        points = (100*rank)*(2.72**(-0.2*endTime))
        totalPoints += points
        endTime = 0
        rank = 1
        scoreModel.findOne({userID: userID}, function (err, Score) {
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

			Score.rank = totalRank;
            Score.points = totalPoints;
			
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

    results: function (req, res) {
        totalTime = 0
        totalPoints = 0
        totalRank = 0
        scoreModel.findOne({userID: userID}, function (err, Score) {
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
     * QuestionsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        QuestionsModel.findOne({_id: id}, function (err, Questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Questions.',
                    error: err
                });
            }

            if (!Questions) {
                return res.status(404).json({
                    message: 'No such Questions'
                });
            }

            return res.json(Questions);
        });
    },

    /**
     * QuestionsController.create()
     */
    create: function (req, res) {
        QuestionsModel.findOne({ category: req.body.category }, function (err, Questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Questions',
                    error: err
                });
            }

            if (!Questions) {
                return res.status(404).json({
                    message: 'No such Questions'
                });
            }
            var question = {
                question: req.body.question, correct_answer: req.body.correct_answer,
                incorrect_answers: [req.body.incorrect_answer1, req.body.incorrect_answer2, req.body.incorrect_answer3]
            }
            Questions.results.push(question)

            Questions.save(function (err, Questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating Questions',
                        error: err
                    });
                }

                return res.status(201).json(Questions);
            });
        });
    },

    /**
     * QuestionsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        QuestionsModel.findOne({_id: id}, function (err, Questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Questions',
                    error: err
                });
            }

            if (!Questions) {
                return res.status(404).json({
                    message: 'No such Questions'
                });
            }

            Questions.category = req.body.category ? req.body.category : Questions.category;
			Questions.results = req.body.results ? req.body.results : Questions.results;
			
            Questions.save(function (err, Questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Questions.',
                        error: err
                    });
                }

                return res.json(Questions);
            });
        });
    },

    /**
     * QuestionsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        var cat = req.params.cat;

        QuestionsModel.findOne({category: cat}, function (err, Questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Questions.',
                    error: err
                });
            }

            if (!Questions) {
                return res.status(404).json({
                    message: 'No such Questions'
                });
            }

            Questions.results.splice(id, 1)

            Questions.save(function (err, Questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Questions.',
                        error: err
                    });
                }

                return res.json(Questions);
            });
        });
    },

    edit: function (req, res) {
        var id = req.params.id;
        var cat = req.params.cat;

        QuestionsModel.findOne({category: cat}, function (err, Questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Questions.',
                    error: err
                });
            }

            if (!Questions) {
                return res.status(404).json({
                    message: 'No such Questions'
                });
            }

            var question = {
                question: req.body.question, correct_answer: req.body.correct_answer,
                incorrect_answers: [req.body.incorrect_answer1, req.body.incorrect_answer2, req.body.incorrect_answer3]
            }
            Questions.results.splice(id, 1, question)
            Questions.save(function (err, Questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Questions.',
                        error: err
                    });
                }

                return res.json(Questions);
            });
        });
    }
};
