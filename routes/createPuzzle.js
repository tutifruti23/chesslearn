let express = require('express');
let router = express.Router();
let puzzleController = require('../controllers/puzzleController');
let userController = require('../controllers/userController');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('createPuzzle', { title: 'Express' });
});
router.post('/savePuzzle', function (req, res) {
  puzzleController.savePuzzle(req, res);
});
router.post('/checkUserIsCreator', function (req, res) {
  userController.checkUserIsCreator(req, res);
});
module.exports = router;
