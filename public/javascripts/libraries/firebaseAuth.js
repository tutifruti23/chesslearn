let userData;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userData=user;
        displayUserData(user);
        initInfo();
    } else {
        logout();
    }
});
function displayUserData(user){
    if(user){
        $('#accountInfoMenu').show();
        $('#signInButtonMenu').hide();
    }else{
        $('#accountInfoMenu').hide();
        $('#signInButtonMenu').show();
    }
}
function signIn(){

}
function signOut(){
    firebase.auth().signOut().then(function() {
        displayUserData();
        userData=undefined;
        logout();
    }, function(error) {
        // An error happened.
    });
}
function setDataWithToken(callback){
    if(userData!==undefined){
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            callback(idToken);
        }).catch(function(error) {
            // Handle error
        });
    }else{
        callback(null);
    }
}

$(function(){
    $("#signOut").on('click',function(){
        signOut();
    });
});

