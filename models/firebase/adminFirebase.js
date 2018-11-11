let admin = require("firebase-admin");
exports.FieldValue = admin.firestore.FieldValue;
let serviceAccount = require("./service2.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chesstrainer-c8633.firebaseio.com/"
});
exports.admin=admin;
exports.db=admin.firestore();
exports.getUserIdFromToken=function(token,callback){
    admin.auth().verifyIdToken(token)
        .then(function(decodedToken) {
            callback( decodedToken.uid)
        }).catch(function(error) {
        // Handle error
    });

};
