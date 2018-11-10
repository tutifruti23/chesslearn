let db=require('./firebase/adminFirebase').db;

exports.saveExercise=function(exercise,callback){
    let sfDocRef = db.collection("metaData").doc("exercise");
    db.runTransaction(function(transaction) {
        return transaction.get(sfDocRef).then(function(sfDoc) {
            if (!sfDoc.exists) {
                callback(false);
                return;
            }
            let data=sfDoc.data();
            let newNumberOfExercises = data['numberOfExercises'] + 1;
            let currentId=data['currentId'];
            let exercisesRef= db.collection('exercises').doc();
            transaction.update(sfDocRef, { numberOfExercises: newNumberOfExercises,currentId:currentId+1});
            transaction.set(exercisesRef,{fen:exercise.fen,id:currentId,result:exercise.result,level:exercise.level});
        });
    }).then(function() {
        callback(true);
    }).catch(function(err) {
        console.log(err);
        callback(false);
    });
};
exports.getExercise=function(id,callback){
    db.collection('exercises').doc(id).get().then(
        function(exercise){callback(exercise)}
    );
};
exports.getRandomExercise=function(callback){
    db.collection('metaData').doc('exercise').get().then(function(doc){
        if(doc.exists){
            let lastId=doc.data()['currentId'];
            db.collection('exercises').orderBy('id').startAt(Math.floor(Math.random()*lastId)).limit(1).get().then(function(querySnapshot){
                querySnapshot.forEach(function(doc) {
                    callback(doc.data());
                });
            });
        }
    });


};