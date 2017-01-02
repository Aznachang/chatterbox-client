// YOUR CODE HERE:
var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};

var app = $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'https://api.parse.com/1/classes/messages',
  type: 'GET',
  //data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    var box = $('h1');
    $.each(data.results, function (i, userObj) {
      var chat = $('div');
      console.log(chat);
      //chat.innerHTML = userObj.username + ': ' + userObj.text;
      box.append('<div>' + userObj.username + ': ' + userObj.text + '</div>'); 
    });
    // data.results.forEach(function(userObj) {
    //   var chat = $('div');
    //   chat.text(userObj.username + ': ' + userObj.text);
    //   //dynamically add each username and text msg to bottom of <h1>
    //   box.append(chat); 
    // });

  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message', data);
  }
});

app.init = function () {};

//POST new data
app.send = function () {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

// $('#sendMsg').on('click',
//   app.send
// );

//GET username info
app.fetch = function () {};