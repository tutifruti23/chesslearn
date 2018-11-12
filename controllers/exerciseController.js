let exercisesModel=require('../models/exercisesModel');
let admin=require('../models/firebase/adminFirebase');
let userModel=require('../models/userModel');
exports.saveExercise=function(req,res){
    exercisesModel.saveExercise(req.body,function(isSavedOk){
        res.send(isSavedOk);
    });
};
exports.getRandomExercise=function(req,res){
    exercisesModel.getRandomExercise(function(exercise){
        res.send(exercise);
    });
};
exports.getExerciseForUser=function(req,res){
    let data=req.body;
    admin.getUserIdFromToken(data.token,function(userId){
        userModel.getUserExercises(userId,function(userExercises){
           if(!userExercises)
               userExercises=[];
            exercisesModel.getRepeatExerciseForUser(userId,function(exercise){
                if(exercise!==null){
                    exercisesModel.getExercise(exercise.docId,function(docExercise){
                        res.send(docExercise);
                    });

                }else{
                    exercisesModel.getNewExerciseForPlayer(1,5,userExercises,function(exercise){
                        if(exercise!==null){
                            userModel.addUserExercise(userId,exercise.docId);
                        }
                        res.send(exercise);
                    });
                }
            });
        });
    });
};


