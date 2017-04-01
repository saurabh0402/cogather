(function(){
	var codeId;
	var codeBox = document.getElementsByClassName("code")[0];

	function init(){
		codeId = location.href.slice(location.href.lastIndexOf('/') + 1);
		var socket = io.connect();
		socket.emit('joinRoom', codeId);

		codeBox.addEventListener("input", function(){
			socket.emit('codeChanged', codeId, this.value);
		});

		socket.on('codeChanged', function(code){
			codeBox.value = code;
		});

		socket.on('joined', function(){
			console.log("Someone joined");
		})
	}

	window.onload = init;
	
})();