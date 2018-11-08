let db=require('./firebase/adminFirebase').db;

exports.changeRating=function(userId,newRating,callback){
    db.collection('users').doc(userId).update({rating:newRating}).then(function(){callback(true)}).catch(function(){callback(false)})


};
exports.getUserRating=function(userId,callback){
    db.collection('users').doc(userId).get().then(function(doc){
        let data=doc.data();
        console.log(data);
        callback(data.rating);
    });
};

