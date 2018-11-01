let admin = require("firebase-admin");
let serviceAccount = require("./service2.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chesstrainer-c8633.firebaseio.com/"
});
exports.admin=admin;
exports.db=admin.firestore();
