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
    console.log(req.body);
    let data=req.body;
    let onlyRepetition=req.body.onlyRepetition;
    admin.getUserIdFromToken(data.token,function(userId){
        userModel.getUserExercises(userId,function(userExercises,userBlockedExercises){
            exercisesModel.getRepeatExerciseForUser(userId,function(exercise){
                if(exercise!==null){
                    exercisesModel.getExercise(exercise.docId,function(docExercise){
                        docExercise.attempts=exercise.attempts;
                        docExercise.lastTimeSolved=exercise.lastTimeSolved;
                        res.send(docExercise);
                    });

                }else{
                    if(onlyRepetition==='false'){
                        exercisesModel.getNewExerciseForPlayer(1,5,userExercises,userBlockedExercises,function(exe){
                            if(exe!==null){
                                userModel.addUserExercise(userId,exe.docId);
                                exe['lastTimeSolved']='never';
                                exe['attempts']=0;
                            }
                            res.send(exe);
                        });
                    }else{
                        res.send(null);
                    }

                }
            });
        });
    });
};


