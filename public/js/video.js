(function(){
	var socket = io.connect();

	var codeId = location.href.slice(location.href.lastIndexOf('/') + 1),
		videoCont = document.getElementsByClassName("videoCont")[0],
		cont = document.getElementsByClassName("cont")[0];

	socket.emit('joinVideoRoom', codeId);

	var but = document.getElementsByClassName("videoCall")[0],
		config = {
			'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]
		}, peer;

	but.addEventListener("click", function(){
		initiateCall();
		this.disabled = true;
	});

	socket.on('msg', function(msg){
		msg = JSON.parse(msg);
		if(!peer) answerCall();
		if(msg.client)
			peer.setRemoteDescription(new RTCSessionDescription(msg.client));
		else if(msg.candidate)
			peer.addIceCandidate(new RTCIceCandidate(msg.candidate));
		else if(msg.close)
			closeCall();
	});

	function initiateCall(){
		prepareCall();
		navigator.getUserMedia({ video: true, audio: true }, function(stream){
			videoCont.className = "videoCont withVideo";
			cont.className = "cont withVideo";
			var vid = document.createElement('video');
			videoCont.appendChild(vid);
			but.disabled = true;
			vid.src = window.URL.createObjectURL(stream);
			vid.play();
			peer.addStream(stream);
			createAndSendOffer();
		}, function(err){
			document.body.innerText = "Unable to take video";
		});
	}

	function prepareCall(){
		peer = new RTCPeerConnection(config);

		peer.onicecandidate = function(e){
			if(!e || !e.candidate)
				return;
			socket.emit('videoMsg', codeId, JSON.stringify({"candidate": e.candidate}));
		}

		peer.onaddstream = function(e){
			var vid = document.createElement('video');
			videoCont.className = "videoCont withVideo";
			cont.className = "cont withVideo";
			but.disabled = true;
			videoCont.appendChild(vid);
			vid.src = window.URL.createObjectURL(e.stream);
			vid.play();
		}
	}

	function createAndSendOffer(){
		peer.createOffer(function(offer){
			var p = new RTCSessionDescription(offer);
			peer.setLocalDescription(new RTCSessionDescription(p), function(){
				socket.emit('videoMsg', codeId, JSON.stringify({"client": p}));
			}, function(err){
				console.log(err);
			})
		}, function(err){
			console.log(err);
		})
	}

	function answerCall(){
		prepareCall();
		navigator.getUserMedia({ video: true, audio: true}, function(stream){
			var vid = document.createElement('video');
			videoCont.className = "videoCont withVideo";
			cont.className = "cont withVideo";
			but.disabled = true;
			videoCont.appendChild(vid);
			vid.src = window.URL.createObjectURL(stream);
			vid.play();
			peer.addStream(stream);
			createAndSendAnswer();
		}, function(err){
			document.body.innerText = "Unable to take video";
		});
	}

	function createAndSendAnswer(){
		peer.createAnswer(function(ans){
			var p = new RTCSessionDescription(ans);
			peer.setLocalDescription(p, function(){
				socket.emit('videoMsg', codeId, JSON.stringify({"client": p}));
			}, function(err){
				console.log(err);
			});
		}, function(err){
			console.log(err);
		})
	}
})();