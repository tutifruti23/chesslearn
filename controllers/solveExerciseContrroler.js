let userModel=require('../models/userModel');
let admin=require('../models/firebase/adminFirebase');
let solveExerciseModel=require('../models/solveExerciseModel');
exports.solvePuzzleUser=function(req,res){
    let data=req.body;
    console.log(data);
    admin.getUserIdFromToken(data.token,function(userId){
       solveExerciseModel.solveExerciseUser(userId,data.isGood,data.docId,function(){
           res.send(true);
       });
    });
};
