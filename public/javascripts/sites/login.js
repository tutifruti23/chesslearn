function changeToRegister() {
  $('#register-form').delay(100).fadeIn(100);
  $('#login-form').fadeOut(100);
  $('#login-form-link').removeClass('active');
  $(this).addClass('active');
}
function changeToLogin() {
  $('#login-form').delay(100).fadeIn(100);
  $('#register-form').fadeOut(100);
  $('#register-form-link').removeClass('active');
  $(this).addClass('active');
}
function clearInfo() {
  $('#info').text('');
}
$(function () {
  $('#login-form-link').click(function (e) {
    changeToLogin();
    e.preventDefault();
  });
  $('#register-form-link').click(function (e) {
    changeToRegister();
    e.preventDefault();
  });
  $('#register-submit').click(function (e) {
    e.preventDefault();
    clearInfo();
    $.post(
      'login/register',
      {
        name: $('#username-register').val(),
        email: $('#email-register').val(),
        password: $('#password-register').val(),
      },
      function (result) {
        if (result.status) {
          changeToLogin();
          $('#info').text('Registration completed successful!');
        } else {
          $('#info').text('Registration not completed, try again.');
        }
      }
    );
  });
  $('#login-submit').click(function (e) {
    e.preventDefault();
    clearInfo();
    let user = $('#username-login').val();
    let password = $('#password-login').val();
    firebase.auth().signInWithEmailAndPassword(user, password);
  });
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      location.href = '/basics';
    } else {
      // User is signed out.
      // ...
    }
  });
});
