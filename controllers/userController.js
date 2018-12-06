let userModel=require('../models/userModel');
let admin=require('../models/firebase/adminFirebase');
exports.getUserPuzzleRating=function(req,res){
    admin.getUserIdFromToken(req.body.token,function(uid){
        userModel.getUserRating(uid,function(rating){
           res.send({rating:rating});
        });
    });
};
exports.getUserLevels=function (req,res) {
    let data=req.body;
    admin.getUserIdFromToken(data.token,function(uid){
        userModel.getUserLevels(uid,function(levels){
            res.send(levels);
        });
    });
};
exports.setUserLevels=function(req,res){
    let data=req.body;
    admin.getUserIdFromToken(data.token,function(uid){
        userModel.saveUsersLevels(uid,data.minLevel,data.maxLevel,function(isOk){
            res.send(isOk);
        });
    });
};
exports.deleteUserPuzzleHistory=function(req,res){
    let data=req.body;
    admin.getUserIdFromToken(data.token,function(uid){
        userModel.deletePuzzleHistory(uid,function(isOk){
            res.send(isOk);
        });
    });
};
exports.deleteUserExercisesHistory=function(req,res){
    let data=req.body;
    admin.getUserIdFromToken(data.token,function(uid){
        userModel.deleteExercisesHistory(uid,function(isOk){
            res.send(isOk);
        });
    });
};
exports.checkUserIsCreator=function(req,res){
    let data=req.body;
    admin.getUserIdFromToken(data.token,function(uid){
        userModel.checkUserIsCreator(uid,function(isCreator){
           res.send(isCreator);

        });
    });
};