	"use strict";

	let player;

	const playPause = document.getElementById("playPause");


	console.log("init");

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'dpCe36t6oC4',
			playerVars: {
				controls: 0,
				modestbranding: 1,
				start: 81
			},
      events: {
        'onReady': onPlayerReady
      }
    });

		playPause.addEventListener("click", ()=>{
			console.log("click-play", player);
			// player();
			player.playVideo();
		})

  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
		console.log("onPlayerReady");
    event.target.playVideo();
  }
