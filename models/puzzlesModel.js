let admin=require('./firebase/adminFirebase').admin;
let db=admin.firestore();
exports.savePuzzle=function(puzzle,callback){
    let sfDocRef = db.collection("metaData").doc("puzzle");
    db.runTransaction(function(transaction) {
        return transaction.get(sfDocRef).then(function(sfDoc) {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            let data=sfDoc.data();
            let newNumberOfPuzzles = data['numberOfPuzzles'] + 1;
            let currentId=data['currentId'];
            let puzzlesRef= db.collection('puzzles').doc();
            transaction.update(sfDocRef, { numberOfPuzzles: newNumberOfPuzzles,currentId:currentId+1});
            transaction.set(puzzlesRef,{fen:puzzle.fen, solution:puzzle.solution,id:currentId});
        });
    }).then(function() {
        callback(true);
    }).catch(function(err) {
        console.log(err);
        callback(false);
    });
};
exports.getPuzzle=function(puzzleId,callback){
    db.collection('puzzles').doc(puzzleId).get().then(function(puzzle){callback(puzzle)});
};
exports.getRandomPuzzle=function(callback){
    db.collection('metaData').doc('puzzle').get().then(function(doc){
        if(doc.exists){
            let lastId=doc.data()['currentId'];
            db.collection('puzzles').orderBy('id').startAt(Math.floor(Math.random()*lastId)).limit(1).get().then(function(querySnapshot){
                querySnapshot.forEach(function(doc) {
                    callback(doc.data());
                });
            });
        }
    });
};





