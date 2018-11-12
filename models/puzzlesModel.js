let admin=require('./firebase/adminFirebase').admin;
let db=require('./firebase/adminFirebase').db;
let randomInt=require('random-int');
let maxInt=100000;
exports.savePuzzle=function(puzzle,callback){
    if(puzzle.solution===undefined||puzzle.solution===''){
        callback(false);
        return;
    }
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
            transaction.set(puzzlesRef,{rating:1500,fen:puzzle.fen, solution:puzzle.solution,id:currentId,attempts:0,random:randomInt(maxInt)});
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
        let random=randomInt(maxInt);
        db.collection('puzzles').where('random','>=',random).limit(1).get().then(function(querySnapshot){
            if(querySnapshot.size>0){
                querySnapshot.forEach(function(doc) {
                    let data=doc.data();
                    data['docId']=doc.id;
                    callback(data);
                });
            }else{
                db.collection('puzzles').where('random','<',random).limit(1).get().then(function(qSnapshot){
                    qSnapshot.forEach(function(doc) {
                        let data=doc.data();
                        data['docId']=doc.id;
                        callback(data);
                    });
                });
            }
        }).catch(function(err){
            console.log('no documents');

        });
};
exports.getPuzzleForPlayer=function(rating,solvedPuzzles,callback){
    let random=randomInt(maxInt);
    function checkDocs(snapshot){
        let size=snapshot.size;
        let isDone=false;
        for(let i=0;i<size;i++){
             if(!solvedPuzzles.includes(snapshot.docs[i].id)){
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
    db.collection('puzzles').where('random','>=',random).limit(100).get().then(function(querySnapshot){
        if(querySnapshot.size>0){
           checkDocs(querySnapshot);
        }else{
            db.collection('puzzles').where('random','<',random).limit(100).get().then(function(qSnapshot){
                checkDocs(qSnapshot);
            });
        }
    }).catch(function(err){
        console.log(err);
        console.log('no documents');

    });
};








