let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('createPuzzle', { title: 'Express' });
});
module.exports = router;
