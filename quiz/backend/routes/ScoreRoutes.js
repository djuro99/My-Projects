var express = require('express');
var router = express.Router();
var ScoreController = require('../controllers/ScoreController.js');

/*
 * GET
 */
router.get('/', ScoreController.list);

/*
 * GET
 */
router.get('/:id', ScoreController.show);

/*
 * POST
 */
router.post('/', ScoreController.create);

/*
 * PUT
 */
router.put('/:id', ScoreController.update);

/*
 * DELETE
 */
router.delete('/:id', ScoreController.remove);

module.exports = router;
