var http = require('http'),
	express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	socketIo = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIo(server);

app.use(express.static(__dirname + '/public'));

function createRandomString(){
	var ans = '';
	for(i = 0; i < 5; i++){
		ans += String.fromCharCode(Math.floor(Math.random()*25) + 65);
	}
	return ans.toLowerCase();
}

app.get("/", function(req, res){
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/createNewLink", function(req, res){
	var codeId = createRandomString();
	res.redirect('/code/' + codeId);
});

app.get("/code/:codeId", function(req, res){
	res.sendFile(__dirname + '/views/code.html');
});

io.on('connection', function(socket){
	socket.on('joinRoom', function(roomName){
		socket.join(roomName);
	});

	socket.on('codeChanged', function(room, code){
		socket.to(room).emit('codeChanged', code);
	});
});

app.use(function(req, res, next){
	res.status(404);
	res.send("404 error");
});

server.listen(3000, function(){
	console.log("app running on port 3000");
});