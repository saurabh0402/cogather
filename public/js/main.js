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

		document.getElementsByClassName("saveFile")[0].addEventListener("click", function(e){
			e.preventDefault();
			window.open("/save/" + codeId);
		});
	}

	window.onload = init;
	
})();