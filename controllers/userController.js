let userModel=require('../models/userModel');
let admin=require('../models/firebase/adminFirebase');
exports.getUserPuzzleRating=function(req,res){
    admin.getUserIdFromToken(req.body.token,function(uid){
        userModel.getUserRating(uid,function(rating){
           res.send({rating:rating});
        });
    });
};

