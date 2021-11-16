const UserModel = require('../models/userModel.js');
const questionModel = require('../models/questionModel.js')
const answerModel = require('../models/answerModel.js')
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */

async function getUserQuestions(userId) {
    const questions = await questionModel.find({userID: userId}).exec()
    return questions
}

async function getUserAnswers(userId) {
    const answers = await answerModel.find({userID: userId}).exec()
    return answers
}

async function getAcceptedUserAnswers(userId) {
    const answers = await answerModel.find({ $and: [{ accepted: true }, {userID: userId}]}).exec()
    return answers
}

module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
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

    /**
     * userController.create()
     */
    create: function (req, res) {
        var user = new UserModel({
			username : req.body.username,
			email : req.body.email,
			password : req.body.password,
            path: 'N/A'
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            return res.redirect('/');
        });
    },
    showLogin: function(req, res) {
        res.render('user/login');
    },

    showRegister: function(req, res) {
        res.render('user/register');
    },

    login: function (req, res, next) {
        UserModel.authenticate(req.body.username, req.body.password, function(error, user) {
            if (error || !user) {
                var err = new Error('Wrong username or password.');
                err.status = 401;
            } else {
                req.session.userId = user._id;
                return res.redirect('profile');
            }
        })
    },

    logout: function (req, res, next) {
        if (req.session) {
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        }
    },

    profile: function (req, res, next) {
        UserModel.findById(req.session.userId)
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
                    res.render('user/profile', data);
                }
            }
        });
    },

    add: function(req, res){
        return res.render('question/addQuestion');
    },

    image: function (req, res, next) {
        UserModel.findById(req.session.userId, function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user == null) {
                    var err = new Error('Not authorized!');
                    err.status = 400;
                    return next(err);
                } else {
                    user.path = 'images/'+req.file.filename ? 'images/'+req.file.filename : user.path
                    user.save(function (err, user) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating user.',
                                error: err
                            });
                        }

                        return res.redirect('/users/profile');
                    });
                }
            }
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.email = req.body.email ? req.body.email : user.email;
			user.password = req.body.password ? req.body.password : user.password;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
