let db=require('./firebase/adminFirebase').db;
let randomInt=require('random-int');
let maxInt=100000;

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
            transaction.set(exercisesRef,{fen:exercise.fen,id:currentId,result:exercise.result,level:parseInt(exercise.level),random:randomInt(maxInt)});
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
        function(doc){
            let data=doc.data();
            data.docId=doc.id;
            callback(data);
        }
    );
};
exports.getRandomExercise=function(callback){
    let random=randomInt(maxInt);
    function checkDocs(snapshot){

        let data=snapshot.docs[0].data();
        data['docId']=snapshot.docs[0].id;
        callback(data);
    }
    db.collection('exercises').where('random','>=',random).limit(1).get().then(function(querySnapshot){
        if(querySnapshot.size>0){
            checkDocs(querySnapshot);
        }else{
            db.collection('exercises').where('random','<',random).limit(1).get().then(function(qSnapshot){
                checkDocs(qSnapshot);
            });
        }
    }).catch(function(err){
        console.log(err);
        console.log('no documents');

    });
};
exports.getNewExerciseForPlayer=function(minLevel,maxLevel,userExercises,callback){
    if(minLevel>maxLevel){
        callback(null);
        return;
    }
    function checkDocs(snapshot){
        let size=snapshot.size;
        let isDone=false;
        for(let i=0;i<size;i++){
            if(!userExercises.includes(snapshot.docs[i].id)){
                let data=snapshot.docs[i].data();
                data['docId']=snapshot.docs[i].id;
                callback(data);
                isDone=true;
                break;
            }
        }
        if(!isDone)
            callback(null);
    }
    db.collection('exercises').where('level','>=',minLevel).where('level','<=',maxLevel).get().then(function(querySnapshot){
        if(querySnapshot.size>0){
            checkDocs(querySnapshot);
        }else{
            callback(null);
        }
    }).catch(function(err){
        console.log(err);
        console.log('no documents');

    });
};
exports.getRepeatExerciseForUser=function(userId,callback){
    db.collection('users').doc(userId).collection('exercises').where('nextAttempt','<',new Date()).limit(1).get().then(function(querySnapshot){
        if(querySnapshot.size>0){
             let data=querySnapshot.docs[0].data();
             data['docId']=querySnapshot.docs[0].id;
             callback(data);
        }else{
            callback(null);
        }

    });
};
