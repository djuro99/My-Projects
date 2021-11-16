var express = require('express');
var router = express.Router();
var QuestionsController = require('../controllers/QuestionsController.js');

/*
 * GET
 */
router.get('/', QuestionsController.list);
router.get('/user', QuestionsController.findUser);
router.get('/delete/:id&:cat', QuestionsController.remove);
router.post('/edit/:id&:cat', QuestionsController.edit);
router.get('/generate/:cat', QuestionsController.generate);
router.get('/addTime', QuestionsController.addTime)
router.get('/calculatePoints', QuestionsController.calculatePoints)
router.get('/downgrade', QuestionsController.downgrade)
router.get('/results', QuestionsController.results)
router.get('/listScore', QuestionsController.listScore)

/*
 * GET
 */
router.get('/:id', QuestionsController.categoryList);

/*
 * POST
 */
router.post('/', QuestionsController.create);

/*
 * PUT
 */
router.put('/:id', QuestionsController.update);

/*
 * DELETE
 */
router.delete('/:id', QuestionsController.remove);

module.exports = router;
