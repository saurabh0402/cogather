var http = require('http'),
	express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	socketIo = require('socket.io'),
	childProcess = require('child_process'),
	fs = require('fs');

var app = express();
var server = http.createServer(app);
var io = socketIo(server);

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/createnewlink", function(req, res){
	var cp = childProcess.spawn('python3', ['pythonScripts/createFolder.py']);
	cp.stdout.on('data', function(name){
		name = name.toString();
		var codeId = name.trim();
		res.redirect('/code/' + codeId);
	})
});

app.get("/code/:codeId", function(req, res){
	res.sendFile(__dirname + '/views/code.html');
});

io.on('connection', function(socket){
	socket.on('joinRoom', function(roomName){
		socket.join(roomName);
	});

	socket.on('codeChanged', function(room, code){
		var cp = childProcess.spawn('python3', ['pythonScripts/editFiles.py']);

		cp.stdin.write(room + '\n', function(){
			code = code.split('\n').join('`!');
			cp.stdin.write(code + '\n');
		});

		cp.on('close', function(){
			fs.readFile('./savedFiles/' + room + '/index.html', function(err, data){
				var ans = data.toString().split('`!').join('\n');
				socket.to(room).emit('codeChanged', ans);
			});
		});
		
	});
});

app.use(function(req, res, next){
	res.status(404);
	res.send("404 error");
});

server.listen(3000, function(){
	console.log("app running on port 3000");
});