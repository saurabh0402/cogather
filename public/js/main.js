(function(){
	var codeId;
	var html = document.getElementsByClassName("html")[0],
		css = document.getElementsByClassName("css")[0],
		js = document.getElementsByClassName("js")[0],
		op = document.getElementsByClassName("output")[0];

	function init(){
		codeId = location.href.slice(location.href.lastIndexOf('/') + 1);
		var socket = io.connect();
		socket.emit('joinRoom', codeId);

		html.addEventListener("input", function(){
			socket.emit('codeChanged', codeId, this.value, 'html');
			op.src = op.src;
		});

		css.addEventListener("input", function(){
			socket.emit('codeChanged', codeId, this.value, 'css');
			op.src = op.src;
		});

		js.addEventListener("input", function(){
			socket.emit('codeChanged', codeId, this.value, 'js');
			op.src = op.src;
		});

		socket.on('codeChanged', function(code, lang){
			document.getElementsByClassName(lang)[0].value = code;
			op.src = op.src;
		});

		document.getElementsByClassName("downloadFile")[0].addEventListener("click", function(e){
			e.preventDefault();
			window.open("/save/" + codeId);
		});

		op.src = location.origin + '/usr/code/' + codeId + '/index.html';

	}

	window.onload = init;
	
})();