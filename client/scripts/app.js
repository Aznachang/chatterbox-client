// YOUR CODE HERE:
// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };
var app = {};
$(document).ready(function () {
  app.server = 'https://api.parse.com/1/classes/messages';

  app = $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server + '?where={"createdAt":{"$gte":{"__type":"Date","iso":"2016-12-31T00:00:00Z"}}}',
    type: 'GET',
    //data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      var box = $('#chats');
      var rooms = {};

      $.each(data.results, function (i, userObj) {
        //add in rooms to the {rooms} (line 20)
        // console.log(userObj.roomname);
        if (rooms[userObj.roomname] !== 'undefined') {
          rooms[userObj.roomname] = userObj.roomname;
          console.log(rooms); 
        }
        if (userObj.username !== 'undefined') {
          box.append('<div>' + userObj.username + ': ' + userObj.text + '</div>'); 
        }
        //box.append('<div data-id=' + userObj.username + '>' + userObj.username + ': ' + userObj.text + '</div>'); 
      });
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

  app.init = function () {
    app.fetch();
  };

  //POST new data
  app.send = function (message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(message);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.handleSubmit = function (message) {
    app.send(message);
  };

  app.handleUsernameClick = function() {
    console.log('derp');
  };
  
  $('#send').on('submit', function(e) {
    e.preventDefault();
    console.log('Form Submitted!');
    var message = {
      username: window.location.search,
      text: $('#message').val(),
      roomname: 'lobby'
    };

    app.handleSubmit(message);
   // app.send(message);
    //e.preventDefault();
   // $('#newMsg').val(); //perform some operations
    //this.submit(); //now submit the form
  });

  /*
  $('#submitMsg').on('click', function () {
    console.log('submit button clicked!');
    app.send(message);
  }); */

  //GET username info
  app.fetch = function () {
    console.log(app.server);
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('fetched!');

      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.clearMessages = function () {
    var box = $('#chats');
    box.empty();
  };

  app.renderMessage = function (message) {
    var box = $('#chats');
    box.append('<div>' + message.username + ': ' + message.text + '</div>');
    app.send(message);
  };

  app.renderRoom = function(room) {
    var room = $('#roomSelect');
    room.append('<option>' + room + '</option>');

  };
});