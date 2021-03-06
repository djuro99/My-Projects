var express = require('express');
var router = express.Router();
var answerController = require('../controllers/answerController.js');

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
router.get('/', answerController.list);
router.get('/remove/:id&:questionID', requiresLogin, answerController.remove);

/*
 * GET
 */
router.get('/:id&:questionID', requiresLogin, answerController.show);

/*
 * POST
 */
router.post('/', requiresLogin, answerController.create);

/*
 * PUT
 */
router.put('/:id', answerController.update);

/*
 * DELETE
 */
router.delete('/:id', answerController.remove);

module.exports = router;
