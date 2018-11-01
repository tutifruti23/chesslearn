let express = require('express');
let router = express.Router();
let puzzleController=require('../controllers/puzzleController');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('solvePuzzle', { title: 'Express' });
});
router.get('/newRandomPuzzle', function(req, res, next) {
   puzzleController.getRandomPuzzle(req,res);
});

module.exports = router;