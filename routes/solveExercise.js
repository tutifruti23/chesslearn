let express = require('express');
let router = express.Router();
let exerciseController=require('../controllers/exerciseController');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('solveExercise', { title: 'Express' });
});
router.get('/newRandomExercise', function(req, res, next) {
    exerciseController.getRandomExercise(req,res);
});
router.post('/exerciseComplete', function(req, res, next) {

});

module.exports = router;