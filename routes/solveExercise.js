let express = require('express');
let router = express.Router();
let exerciseController=require('../controllers/exerciseController');
let solveExerciseController=require('../controllers/solveExerciseContrroler');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('solveExercise', { title: 'Express' });
});
router.post('/newRandomExercise', function(req, res, next) {
    exerciseController.getRandomExercise(req,res);
});
router.post('/newExerciseUser', function(req, res, next) {
    exerciseController.getExerciseForUser(req,res);
});
router.post('/exerciseComplete', function(req, res, next) {
    solveExerciseController.solvePuzzleUser(req,res);
});

module.exports = router;