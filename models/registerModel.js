let admin = require("./firebase/adminFirebase").admin;
let db=require("./firebase/adminFirebase").db;
exports.userRegister=function(userData,callback){
    admin.auth().createUser({
        email:userData.email,
        displayName:userData.name,
        password:userData.password,
    })
        .then(function(user) {
           let userDataRef = db.collection("users").doc(user.uid);
            userDataRef.set({
                rating:1500,
                lastPuzzles:[]
            })
                .then(function() {
                    callback(true,user);
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });


        })
        .catch(function(error) {
            callback(false,error);
        });
};
