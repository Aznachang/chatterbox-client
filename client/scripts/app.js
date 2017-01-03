// YOUR CODE HERE:
// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };
var app = {};
var friends = []; //store all friends - use to display ALL friend's messages

$(document).ready(function () {
  
  app.server = 'https://api.parse.com/1/classes/messages';

  app = $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server + '?where={"createdAt":{"$gte":{"__type":"Date","iso":"2016-12-31T00:00:00Z"}}}',
    type: 'GET',
    //data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
    //  console.log(data);
      var box = $('#chats');
      var rooms = {};

      $.each(data.results, function (i, userObj) {
        //add in rooms to the {rooms} (line 20)
        // console.log(userObj.roomname);
        if (rooms[userObj.roomname] !== 'undefined') {
          rooms[userObj.roomname] = userObj.roomname;
          //console.log(rooms); 
        }
        var name = app.escapeHTML(userObj.username);
        var text = app.escapeHTML(userObj.text);
        if (userObj.username !== 'undefined') {
          box.append('<div class = \"' + name + '\">' + name + ': ' + text + '</div>'); 
        }
      });
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
  console.log(app);

  app.init = function () {
    app.fetch();

  };

  app.escapeHTML = function(str) {
    return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;");
  };

  $('#refresh').on('click', function(e) {
    e.preventDefault();

    location.reload();
  });

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

  //add a friend upon clicking their username
  app.handleUsernameClick = function(username) {
    var chats = $('#chats');
    //var classes = username.split(' ');

    console.log(chats.find('div.' + username));
    chats.find('div.' + username).css('font-weight', 'Bold');
  };

  $('div').on('click', function(e) {
    e.preventDefault();
    var selectedUser = $(e.target).attr('class');

    if (friends.indexOf(selectedUser) === -1) {
      friends.push(selectedUser); //push clicked Username to [friends]
    }
    app.handleUsernameClick(selectedUser);
    console.log(friends);
  });
  
  /** Submit a Message **/
  $('#send').on('submit', function(e) {
    e.preventDefault();
    console.log('Form Submitted!');
    //console.log($('#message').val());

    var message = {
      username: window.location.search,
      text: $('#message').val(),
      roomname: 'lobby'
    };

    app.handleSubmit(message);
  });

  //GET username info
  app.fetch = function () {
    //console.log(app.server);
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