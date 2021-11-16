var express = require('express');
var router = express.Router();
var questionController = require('../controllers/questionController.js');
const QuestionModel = require('../models/questionModel.js');

function requiresLogin(req,res,next){
    if(req.session && req.session.userId){
        return next();
    } else {
        var err = new Error("You must be logged in to view this page.");
        err.status = 401;
        return next(err);
    }
}

/*
 * GET
 */
router.get('/', questionController.list);
router.get('/userList', requiresLogin, questionController.userList);
router.get('/add', requiresLogin, questionController.add);
router.get('/remove/:id', requiresLogin, questionController.remove);



/*
 * GET
 */
router.get('/:id', questionController.show);
router.get('/myAnswers/:id', requiresLogin, questionController.answerUserList);
router.get('/addAnswer/:id', requiresLogin, questionController.addAnswer);
router.get('/profile/:id', questionController.profile);

/*
 * POST
 */
router.post('/', requiresLogin, questionController.create);
router.post('/searchByTag', questionController.searchByTag);

/*
 * PUT
 */
router.put('/:id', questionController.update);

/*
 * DELETE
 */
router.delete('/:id', questionController.remove);

module.exports = router;
