let db=require("./firebase/adminFirebase").db;
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
exports.solveExerciseUser=function(userId,isGood,exerciseDocId,callback){

    let sfDocRef = db.collection("users").doc(userId).collection('exercises').doc(exerciseDocId);
    db.runTransaction(function(transaction) {
        return transaction.get(sfDocRef).then(function(sfDoc) {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            let data=sfDoc.data();
            let box=data.box;
            let nextBox;
            let attempts=data.attempts;
            if(attempts===undefined)
                attempts=0;
            if(isGood==='true'){
                nextBox=box===5?5:box+1;
            }
            else{
                nextBox=1;
            }
            let nextRepeatDays;
            switch (nextBox){
                case 1:nextRepeatDays=1;break;
                case 2:nextRepeatDays=3;break;
                case 3:nextRepeatDays=5;break;
                case 4:nextRepeatDays=10;break;
                default:nextRepeatDays=30;
            }
            let date=new Date();
            let nextRepeatDate=addDays(date,nextRepeatDays);
            transaction.update(sfDocRef,{nextAttempt:nextRepeatDate,box:nextBox,attempts:attempts+1,lastTimeSolved:date});
        });
    }).then(function() {
        callback(true);
    }).catch(function(err) {
        console.log(err);
        callback(false);
    });


};







