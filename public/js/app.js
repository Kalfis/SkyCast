'use strict';

$(function(){

  $('#signup-success').hide();
  $('#login-form').hide();
  $('#signup-form').hide();
  $('#my-profile').hide();
  $('#logout-link').hide();
  $('#login-failed').hide();

  $('#signup-link').click((event) => {
    event.preventDefault();
    console.log('Sign up clicked');
    $('#signup-success').hide();
    $('#login-form').hide();
    $('#signup-form').show();
  })

  $('#submit-signup').click((event) => {
    event.preventDefault();
    console.log('clicked submit for sign up');
    $('#signup-form').hide();
    $('#login-form').show();
    $('#signup-success').show();
    let user = {};
    user.username = $('#signup-username').val();
    user.password = $('#signup-password').val();
      $.ajax({
        url: '/users/signup',
        method: 'POST',
        data: user
      }) //closes sign up ajax
  }) //closes sign up click event

  //Let user log in.
  //======================================
  $('#login-link').click((event) => {
    event.preventDefault();
    console.log('Log in button clicked');
    $('#signup-form').hide();
    $('#login-form').show();
  }) // ends login-link click event

  // create a login submit button with matching id in index
$('#submit-login').click((event) => {
  event.preventDefault();
  console.log('clicked log in submit button.');
  // console.log(req.body);
  let user = {};
  user.username = $('#username-input').val();
  user.password = $('#password-input').val();
  $.ajax({
    url: '/users/authenticate',
    method: "POST",
    data: user
    // console.log(req.body);
  }) //closes .ajax
  // data here references the object containing a token or error message
  .done(function(data){
    //console.log('user_object: '+data.user)
    console.log(data)
    // if user is authenticated in /users/authenticate and granted token, hide login form
    if (data.token) {
      $('#signup-success').hide();
      // console.log(user);
      console.log('token: '+data.token);
      // putting the data.token into the user object
      data.user.token = data.token;
      console.log('user_token: '+data.user.token)
      $('#login-form').hide();
      $('#login-link').hide();
      $('#signup-link').hide();

      // Show users the link to their profile
      $('#my-profile').show();

      $('#welcome-divider').show();
      $('#profile-divider').show();

      $('#logout-link').show();



      // append a personalized welcome message to our user-actions div
      let welcomeUser = document.createElement('div');
      welcomeUser.id = "welcome-user";
      // user.username is something we sent in the post request, so it's still accessible using this syntax.
      welcomeUser.innerHTML = '<p> Hi, ' + user.username;
      // In /users/authenticate, we're retrieving user data associated with the username and password sent in the post method, then sending all user info back as part of "data"
      console.log('user._id: '+ data.user._id);
      // note that we have to use .append here, and not .appendChild
      $('#user-welcome').append(welcomeUser);

      //
      let currentUser = document.createElement('div');
      currentUser.id = "current-user";
      currentUser.innerHTML = data.user._id;
      $('#user-actions').append(currentUser);
      $('#current-user').hide();
      //

      // Once a user has logged in, they can click on a link to view their profiles.
      $('#my-profile').click((event) => {
        event.preventDefault();
        let myId = data.user._id
        console.log('myId: ' + myId);

        $.ajax({
          url: '/users/' + myId
          // /users/:id will return all user info for that id.
        })
        .done(function(data) {
          $('#user-profile').empty();

           showUser(data);
        }) //ends .done
      }); //ends click event on my-profile link

    // if user is not granted token, give them a 'not found' message
    } else {
      $('#login-failed').show();
    }
  // what happens here with tokens--do I need to insert into header?
  })
}); //ends login-submit button click event

}) //close main anonymous function
