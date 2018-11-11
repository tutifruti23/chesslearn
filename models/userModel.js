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
exports.getUserRatingAndLastPuzzles=function(userId,callback){
    db.collection('users').doc(userId).get().then(function(doc){
        let data=doc.data();
        callback(data.rating,data.lastPuzzles);
    });
};