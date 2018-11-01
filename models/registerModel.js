let admin = require("./firebase/adminFirebase").admin;
exports.userRegister=function(userData,callback){
    admin.auth().createUser({
        email:userData.email,
        displayName:userData.name,
        password:userData.password,
    })
        .then(function() {
            callback(true);
        })
        .catch(function(error) {
            callback(false,error);
        });
};
