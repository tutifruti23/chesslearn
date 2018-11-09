let express = require('express');
let router = express.Router();
let puzzleController=require('../controllers/puzzleController');
let solvePuzzleController=require('../controllers/solvePuzzleController');
let userController=require('../controllers/userController');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('solvePuzzle', { title: 'Express' });
});
router.get('/newRandomPuzzle', function(req, res, next) {
   puzzleController.getRandomPuzzle(req,res);
});
router.post('/solvePuzzle',function(req,res){
    solvePuzzleController.solvePuzzle(req,res);
});
router.post('/getRating',function(req,res){
    userController.getUserPuzzleRating(req,res);
});
module.exports = router;