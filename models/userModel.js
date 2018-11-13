let db=require('./firebase/adminFirebase').db;
let admin=require('./firebase/adminFirebase');
let FieldValue = require('./firebase/adminFirebase').FieldValue;
exports.changeRating=function(userId,newRating,callback){
    db.collection('users').doc(userId).update({rating:newRating}).then(function(){callback(true)}).catch(function(){callback(false)})


};
exports.getUserRating=function(userId,callback){
    db.collection('users').doc(userId).get().then(function(doc){
        let data=doc.data();
        callback(data.rating);
    });
};
exports.addUserSolvePuzzle=function(userId,puzzleDocId){
    let ref= db.collection('users').doc(userId);
    ref.update({
        lastPuzzles: FieldValue.arrayUnion(puzzleDocId)
    }).then(function(){

    }).catch(function (error) {
        console.log(error);
    });
};
exports.addUserExercise=function(userId,exerciseDocId){
    let ref= db.collection('users').doc(userId);
    let date=new Date();
    ref.collection('exercises').doc(exerciseDocId).set({
        box:1,
        nextAttempt:date,
        lastTimeSolved:date,
        attempts:0
    }).then(function(){}).catch(function(err){console.log(err)});

    ref.update({
        exercises: FieldValue.arrayUnion(exerciseDocId)
    }).then(function(){

    }).catch(function (error) {
        console.log(error);
    });
};
exports.getUserRatingAndLastPuzzles=function(userId,callback){
    db.collection('users').doc(userId).get().then(function(doc){
        let data=doc.data();
        callback(data.rating,data.lastPuzzles);
    });
};
exports.getUserExercises=function(userId,callback){
    db.collection('users').doc(userId).get().then(function(doc){
        let data=doc.data();
        let exercises=data.exercises===undefined?[]:data.exercises;
        let exercisesBlocked=data.exercisesBlocked===undefined?[]:data.exercisesBlocked;
        callback(exercises,exercisesBlocked);
    });
};
exports.getUserData=function(userId,parameters,callback){
    db.collection('users').doc(userId).get().then(function(doc){
        callback(doc.data());
    });
};