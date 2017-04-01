(function(){
	var codeId;
	var codeBox = document.getElementsByClassName("code")[0],
	op = document.getElementsByClassName("output")[0];

	function init(){
		codeId = location.href.slice(location.href.lastIndexOf('/') + 1);
		var socket = io.connect();
		socket.emit('joinRoom', codeId);

		codeBox.addEventListener("input", function(){
			socket.emit('codeChanged', codeId, this.value);
			op.src = op.src;
		});

		socket.on('codeChanged', function(code){
			codeBox.value = code;
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