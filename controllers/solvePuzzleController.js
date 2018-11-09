let solvePuzzleModel=require('../models/solvePuzzleModel');
let userModel=require('../models/userModel');
let admin=require('../models/firebase/adminFirebase');
exports.solvePuzzle=function(req,res){
    let data=req.body;
    admin.getUserIdFromToken(data.token,function(userId){
        userModel.getUserRating(userId,function(userRating){
            solvePuzzleModel.solvePuzzle(data.docId,userRating,data.score,function(isDone,newUserRating){
                if(isDone){
                    userModel.changeRating(userId,newUserRating,function (isDone) {
                        res.send({
                            rating:newUserRating
                        });
                    });
                }
            });
        })

    });
};
