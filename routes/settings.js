let express = require('express');
let router = express.Router();
let userController=require('../controllers/userController');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('settings', { title: 'Express' });
});
router.post('/getUserLevels',function(req,res){
    userController.getUserLevels(req,res);
});
router.post('/changeUserLevels',function(req,res){
    userController.setUserLevels(req,res);
});
router.post('/deletePuzzlesHistory',function(req,res){
    userController.deleteUserPuzzleHistory(req,res);
});
router.post('/deleteExercisesHistory',function(req,res){
    userController.deleteUserExercisesHistory(req,res);
});
module.exports = router;
