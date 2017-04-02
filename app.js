var https = require('https'),
	express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	socketIo = require('socket.io'),
	childProcess = require('child_process'),
	fs = require('fs');

var option = {
	key: fs.readFileSync('./certificates/server.key'),
	cert: fs.readFileSync('./certificates/server.crt'),
	ca: fs.readFileSync('./certificates/ca.crt'),
	requestCert: true,
    rejectUnauthorized: false
}

var app = express();
var server = https.createServer(option, app);
var io = socketIo(server);

var languages = {
	'html': 'index.html',
	'css': 'main.css',
	'js': 'main.js'
};

app.get('/usr/code/:codeId/:file', function(req, res){
	if(req.params.file == 'index.html')
		req.params.file = 'op.html';
	res.sendFile(__dirname + '/savedFiles/' + req.params.codeId + '/' + req.params.file);
});

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

app.get('/video', function(req, res){
	res.sendFile(__dirname + '/views/video.html');
});

app.get("/save/:codeId", function(req, res){
	var id = req.params.codeId;
	var cp = childProcess.spawn('python3', ['./pythonScripts/saveFiles.py']);
	cp.stdin.write(id + '\n');
	cp.on('close', function(){
		res.sendFile(__dirname + '/savedFiles/' + id + '/' + id + '.zip');
	});
});

io.on('connection', function(socket){
	socket.on('joinRoom', function(roomName){
		socket.join(roomName);
		fs.readFile('./savedFiles/' + roomName + '/' + languages['html'], function(err, data){
			socket.emit('codeChanged', data.toString(), 'html');
		});

		fs.readFile('./savedFiles/' + roomName + '/' + languages['css'], function(err, data){
			socket.emit('codeChanged', data.toString(), 'css');
		});

		fs.readFile('./savedFiles/' + roomName + '/' + languages['js'], function(err, data){
			socket.emit('codeChanged', data.toString(), 'js');
		});
	});

	socket.on('codeChanged', function(room, code, lang){
		var cp = childProcess.spawn('python3', ['./pythonScripts/editFiles.py']);

		cp.stdin.write(room + '\n', function(){
			cp.stdin.write(languages[lang] + '\n', function(){
				code = code.split('\n').join('`!');
				cp.stdin.write(code + '\n');
			});
		});

		cp.on('close', function(){
			socket.emit('doneChangingCode');
			fs.readFile('./savedFiles/' + room + '/' + languages[lang], function(err, data){
				socket.to(room).emit('codeChanged', data.toString(), lang);
			});
		});
	});

	socket.on('joinVideoRoom', function(room){
		socket.join(room + 'video');
	});

	socket.on('videoMsg', function(room, msg){
		socket.to(room + 'video').emit('msg', msg);
	});
});

app.use(function(req, res, next){
	res.status(404);
	res.send("404 error");
});

server.listen(3000, function(){
	console.log("app running on port 3000");
});