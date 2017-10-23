var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

port = 8080;
app.listen(port);
console.log("Server started, port " + port);
function handler (req, res) {
  if (req.url == "/") url_to_load = "/index.html";
  else url_to_load = req.url;
  fs.readFile(__dirname + url_to_load,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading file.');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var phone_socket = null;
var viewer_socket = null;

io.on('connection', function (socket) {
  socket.on('user_is_phone', function (data) {
	console.log("Phone connected.");
    phone_socket = socket;
	if (viewer_socket)  viewer_socket.emit('phone_connected', {});
  });
  socket.on('user_is_viewer', function (data) {
    console.log("Viewer connected.");
    viewer_socket = socket;
  });
  socket.on('gyrodata', function (data) {
	if (viewer_socket)  viewer_socket.emit('gyrodata', data);
  });
});