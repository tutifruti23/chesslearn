let express = require('express');
let router = express.Router();
let puzzleController=require('../controllers/puzzleController');
let solvePuzzleController=require('../controllers/solvePuzzleController');
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


module.exports = router;