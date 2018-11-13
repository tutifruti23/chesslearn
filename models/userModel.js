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
        let minLevel=data.minLevel===undefined?1:parseInt(data.minLevel);
        let maxLevel=data.maxLevel===undefined?5:parseInt(data.maxLevel);
        callback(exercises,exercisesBlocked,minLevel,maxLevel);
    });
};
exports.getUserData=function(userId,parameters,callback){
    db.collection('users').doc(userId).get().then(function(doc){
        callback(doc.data());
    });
};
exports.getUserLevels=function(userId,callback){
  db.collection('users').doc(userId).get().then(function(doc) {
      let levels = {};
      let data = doc.data();
      levels.minLevel=data.minLevel===undefined?1:parseInt(data.minLevel);
      levels.maxLevel=data.maxLevel===undefined?5:parseInt(data.maxLevel);
      callback(levels);
  });
};
exports.saveUsersLevels=function(userId,minLevel,maxLevel,callback){
    db.collection('users').doc(userId).update({
        minLevel:parseInt(minLevel),
        maxLevel:parseInt(maxLevel)
    }).then(function(){callback(true)}).catch(function(){callback(false)});
};
exports.deletePuzzleHistory=function(userId,callback){
    db.collection('users').doc(userId).update({
        lastPuzzles:FieldValue.delete()
    }).then(function(){callback(true)}).catch(function(){callback(false)});
};
exports.deleteExercisesHistory=function(userId,callback){
    let ref=db.collection('users').doc(userId);
    ref.update({ exercises:FieldValue.delete(),
        exercisesBlocked:FieldValue.delete()}).then(function(){
        callback(true);
    }).catch(function () {callback(false);});
    ref.collection('exercises').get()
        .then(function(querySnapshot) {
            // Once we get the results, begin a batch
            let batch = db.batch();

            querySnapshot.forEach(function(doc) {
                // For each doc, add a delete operation to the batch
                batch.delete(doc.ref);
            });
            // Commit the batch
            return batch.commit();
        }).then(function() {
        // Delete completed!
        // ...
    });

};
