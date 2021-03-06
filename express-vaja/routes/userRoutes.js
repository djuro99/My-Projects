function requiresLogin(req,res,next){
    if(req.session && req.session.userId){
        return next();
    } else {
        var err = new Error("You must be logged in to view this page.");
        err.status = 401;
        return next(err);
    }
}

var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

var multer = require('multer');
var upload = multer({dest: 'public/users/images/'});
const UserModel = require('../models/userModel.js');


/*
 * GET
 */
router.get('/', userController.list);
router.get('/login', userController.showLogin);
router.get('/register', userController.showRegister);
router.get('/profile', userController.profile);
router.get('/add', userController.add);
router.get('/logout', userController.logout);
/*
 * GET
 */
router.get('/:id', userController.show);


/*
 * POST
 */
router.post('/login', userController.login);
router.post('/', userController.create);
router.post('/image', requiresLogin, upload.single('image'), userController.image);


/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
