let express = require('express');
let router = express.Router();
let exerciseController=require('../controllers/exerciseController');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('jestem tu');
    res.render('solveExercise', { title: 'Express' });
});
router.get('/newRandomExercise', function(req, res, next) {
    exerciseController.getRandomExercise(req,res);
});

module.exports = router;