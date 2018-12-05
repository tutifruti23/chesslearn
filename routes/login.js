let express = require('express');
let router = express.Router();
let registerController=require('../controllers/registerController');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.post('/register',function(req,res,next){
   registerController.register(req,res);
});
router.post('/login',function(req,res){

});
module.exports = router;
