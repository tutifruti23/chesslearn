let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});
router.post('/login',function(req,res,next){
    console.log('login');

});
router.post('/register',function(req,res,next){
    console.log('register');
});
module.exports = router;
