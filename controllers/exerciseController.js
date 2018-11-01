let exercisesModel=require('../models/exercisesModel');

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