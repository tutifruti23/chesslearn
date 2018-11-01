let express = require('express');
let router = express.Router();
let exerciseController=require('../controllers/exerciseController');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('createExercise', { title: 'Express' });
});
router.post('/saveExercise',function(req,res){
    exerciseController.saveExercise(req,res);
});
module.exports = router;
