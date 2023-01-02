let express = require('express');
let router = express.Router();
let exerciseController = require('../controllers/exerciseController');
let userController = require('../controllers/userController');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('createExercise', { title: 'Express' });
});
router.post('/saveExercise', function (req, res) {
  exerciseController.saveExercise(req, res);
});
router.post('/checkUserIsCreator', function (req, res) {
  console.log('cos');
  userController.checkUserIsCreator(req, res);
});
module.exports = router;
