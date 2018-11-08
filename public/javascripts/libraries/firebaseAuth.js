let userData;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userData=user;
        displayUserData(user);
    } else {
        console.log('user not login');
        // No user is signed in.
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
    console.log('logout');
    firebase.auth().signOut().then(function() {
        displayUserData();
        userData=undefined;
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
    }
}

$(function(){
    $("#signOut").on('click',function(){
        signOut();
    });
});

