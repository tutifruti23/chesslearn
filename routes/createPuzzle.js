let express = require('express');
let router = express.Router();
let puzzleController=require('../controllers/puzzleController');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('createPuzzle', { title: 'Express' });
});
router.post('/savePuzzle',function(req,res){
    puzzleController.savePuzzle(req,res);
});
module.exports = router;
