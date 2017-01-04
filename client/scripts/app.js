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
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message2', data);
      }
    });
  };

  app.handleSubmit = function (message) {
    app.send(message);
  };

  /** bold all [friends] messages **/
  app.handleUsernameClick = function(username) {
    var chats = $('#chats');
    //var classes = username.split(' ');

    //console.log(chats.find('div.' + username));
    chats.find('div.' + username).css('font-weight', 'Bold');
  };

  /** Calls handleUsernameClick to push to friends **/
  $('div').on('click', function(e) {
    e.preventDefault();
    var selectedUser = $(e.target).attr('class');

    if (friends.indexOf(selectedUser) === -1 && selectedUser !== undefined) {
      friends.push(selectedUser); //push clicked Username to [friends]
    }
    app.handleUsernameClick(selectedUser);
  });
  
  /** Submit a Message **/
  $('.submit').on('click', function(e) {
    e.preventDefault();
    console.log('Form Submitted!');
    //console.log($('#message').val());

    var message = {
      username: window.location.search.slice(10),
      text: $('#message').val(),
      roomname: 'lobby'
    };
    app.send(message);
  });

  $('#newRoom').keypress(function(e) {
    //e.preventDefault();
    var key = e.which;
    if (key === 13) {
      var value = $('#newRoom').val();
      var message = {
        roomname: value
      };
      app.send(message);
      location.reload();
    }
  });

  //GET username info
  app.fetch = function () {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      data: {order: '-createdAt'},
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        var box = $('#chats');
        var dropdown = $('#roomSelect');
        var rooms = [];

        $.each(data.results, function (i, userObj) {
          //make sure each room is unique and is not 'undefined' or an 'empty space'
          if (userObj.roomname !== 'undefined' && userObj.roomname !== '' && rooms.indexOf(userObj.roomname) === -1) {
            rooms.push(userObj.roomname);
            dropdown.append('<option value = \"' + userObj.roomname + '\">' + userObj.roomname + '</option>');
          }

          var name = app.escapeHTML(userObj.username);
          var text = app.escapeHTML(userObj.text);
          if (userObj.username !== 'undefined') {
            box.append('<div class = \"' + name + ' ' + userObj.roomname + '\">' + name + ': ' + text + '</div>' + '<br>'); 
          }
          if (userObj.roomname !== 'lobby') {
            $('.' + userObj.username).hide();
          }
        });
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message1', data);
      }
    });
  };

  $('#roomSelect').change(function() {
    var box = $('#chats');
    var choice = $(this).val();
    var messages = box.children();
    console.log(messages);
    $.each(messages, function(i, msg) {  
      if (msg.attr('class') !== choice ) {
        msg.hide();
      }
    });
  });

  app.clearMessages = function () {
    var box = $('#chats');
    box.empty();
  };

  app.renderMessage = function (message) {
    var box = $('#chats');
    box.append('<div>' + message.username + ': ' + message.text + '</div>');
    console.log(message);
    app.send(message);
  };

  // console.log(app.renderMessage (message));

  app.renderRoom = function(room) {
    var room = $('#roomSelect');
    room.append('<option>' + room + '</option>');

  };
  app.init();
});
//'?where={"createdAt":{"$gte":{"__type":"Date","iso":"2016-12-31T00:00:00Z"}}}'