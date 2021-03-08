	"use strict";

	const PLAYLIST_VERSION = "0.1.4";
	const YOUTUBE_API_KEY = "foo";

	const DEFAULT_SETTINGS = {
		"centuryClub": false,
		"pissBreakVideo": false,
		"shuffle": false,
	}

	let videoFrame;

	var iterationCount = 0;
	var roundTotalCount = 60;
	var roundTime = 60;
	var arrayTrimLength = roundTotalCount - 3;

	if (DEFAULT_SETTINGS["centuryClub"]) {
		// TODO: Add watch event to update count, and rebuild playlist with additional videos
		roundTotalCount = 100;
	}

	function hashCheck(hash) {
		// Debug Mode
		if (hash == "#debug") {
			roundTime = 3;
		}

				//
		if (hash == "#shuffle") {
			DEFAULT_SETTINGS["shuffle"] = true;
		}

		// Remove "#" from hash
		hash = hash.substring(1);

		// Check if string is a number
		if (!isNaN(hash) && hash !== "") {
			hash = parseInt(hash, 10);
			hash = hash - 1;
			iterationCount = hash;
		}
	}

	hashCheck(window.location.hash);

	let srcPlaylist;
	let videoPlaylist;
	let startingVideos;
	let endingVideos;
	let pauseVideos;
	let introVideos;
	let skipVideos; // a video "bone pile" in case the user skips
	let noMoreSkips = {
		"title": "They Live - The Long Fight",
		"videoId": "dN8Z7y_QcwE",
		"start": 123
	};
	let playerTimerInterval;

	let replacementVideo;

	function shuffle(array) {
		var currentIndex = array.length,
			temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	async function buildPlayLists(){
		console.log("buildPlayLists");

		// Only fetch JSON if not in localStorage or out of date
		const localStorageVersion = localStorage.getItem("version");

		if (localStorageVersion !== PLAYLIST_VERSION) {
			// Fetch JSON
			const json = await fetch("assets/js/playlist.json")
		  .then(response => response.json())
		  .then(data => {return data});

			localStorage.setItem("version", json.version);
			localStorage.setItem("playlist", JSON.stringify(json.playlist));
		}

		// Set localStorage data source
		const playlist = JSON.parse(localStorage.getItem("playlist"));

		// Define the playlists
		srcPlaylist = playlist.videoPlaylist;
		introVideos = playlist.introVideos;
		pauseVideos = playlist.pauseVideos;
		startingVideos = playlist.startingVideos;
		endingVideos = playlist.endingVideos;

		// TODO: Add shuffle option, rename videoPlaylist to "tempVideoPlaylist"
		if (DEFAULT_SETTINGS["shuffle"]) {
			shuffle(srcPlaylist);
		}

		// Trim main playlist to 57 videos and create new array for overflow/skip videos.
		videoPlaylist = srcPlaylist.slice(0, arrayTrimLength);
		skipVideos = srcPlaylist.slice(arrayTrimLength + 1);

		let startingVideosRandomNum = Math.floor(Math.random() * startingVideos.length);
		videoPlaylist.unshift(startingVideos[startingVideosRandomNum]);

		// Add ending videos to random array
		videoPlaylist.push(endingVideos[0], endingVideos[1]);

	}

	buildPlayLists();

	const startButton = document.getElementById("startButton");
	const playButton = document.getElementById("playButton");
	const newVideo = document.getElementById("newVideo");
	const progressBar = document.getElementById("progressBar");
	const roundCount = document.getElementById("roundCount");
	const roundTotal = document.getElementById("roundTotal");
	const countdownSeconds = document.getElementById("countdownSeconds");
	const staticFx = document.getElementById("staticFx");
	const muteButton = document.getElementById("muteButton");
	const settingsOpenButton = document.getElementById("settingsOpenButton");
	const settingsCloseButton = document.getElementById("settingsCloseButton");
	const settingsPanel = document.querySelector(".settings-panel");
	const settingsOptionButtons = document.querySelectorAll(".settings-button");

	let playerParams = {
		height: '390',
		width: '640',
		// videoId: videoPlaylist[iterationCount].videoId,
		playerVars: {
			controls: 0,
			modestbranding: 1,
			// start: videoPlaylist[iterationCount].start,
			autoplay: 0,
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	};

	function onYouTubeIframeAPIReady() {
		console.log("onYouTubeIframeAPIReady");
		videoFrame = new YT.Player("videoFrame", playerParams);
	}

	const player = {
		state: {
			isPaused: false,
			currentVideoId: "",
			currentVideoStartTime: 0,
			elapsedTimeLeftInRound: 0,
		},
		init: function() {
			console.log("init");
		},
		next: async function() {
			iterationCount++;
			staticFx.play();
			staticFx.classList.remove("hidden");
			player.ui.resetProgressBar();
			await player.updateState(iterationCount);
			console.log(videoPlaylist[iterationCount]);
			videoFrame.loadVideoById(
				player.state.currentVideoId,
				player.state.currentVideoStartTime,
			)

			roundCount.innerHTML = iterationCount + 1;

			// refresh data
		},
		pause: function() {
			progressBar.classList.add("no-animation");
			videoFrame.pauseVideo();
			player.state.isPaused = true;
			clearInterval(playerTimerInterval);
			if (!DEFAULT_SETTINGS["pissBreakVideo"]) {
				videoFrame.loadVideoById(
					pauseVideos[0].videoId,
					0
				)
			} else {
				staticFx.play();
			}
			// pause video
			// update button
		},
		play: function() {
			player.state.isPaused = false;
			const adjustedStartTime = (roundTime - player.state.elapsedTimeLeftInRound) + player.state.currentVideoStartTime;
			videoFrame.playVideo();
			playerTimer(player.state.elapsedTimeLeftInRound);
			videoFrame.loadVideoById(
				player.state.currentVideoId,
				adjustedStartTime,
			)
		},
		playPause: function() {
			staticFx.play();
			staticFx.classList.remove("hidden");
			player.ui.togglePlayPause();
			if (player.state.isPaused) {
				player.play();
			} else {
				player.pause();
			}
			// pause video
			// update button
		},
		repeat: function(videoId, startTime) {
			console.log("repeat");
			var repeatVideoId = player.state.currentVideoId;
			var repeatStartTime = player.state.currentVideoStartTime;
			if (videoId) {repeatVideoId = videoId};
			if (startTime) {repeatStartTime = startTime};
			videoFrame.loadVideoById(
				repeatVideoId,
				repeatStartTime,
			)
		},
		setup: async function() {
			roundTotal.innerHTML = roundTotalCount;
			roundCount.innerHTML = iterationCount + 1;
			countdownSeconds.innerHTML = roundTime;
			videoFrame.setVolume(100);
			await player.updateState(iterationCount);
			staticFx.play();
			staticFx.classList.remove("hidden");
			console.log(videoPlaylist[iterationCount]);
			videoFrame.cueVideoById(
				player.state.currentVideoId,
				player.state.currentVideoStartTime,
			);
			playButton.addEventListener("click", this.playPause, false);
			newVideo.addEventListener("click", this.newVideo, false);
			startButton.addEventListener("click", this.start, false);
			muteButton.addEventListener("click", this.mute, false);
			settingsOpenButton.addEventListener("click", player.ui.openSettingsPanel, false);
			settingsCloseButton.addEventListener("click", player.ui.closeSettingsPanel, false);
			settingsOptionButtons.forEach(button => {
				button.addEventListener("click", player.ui.toggleSettingsButton, false);
			});
		},
		saveSetting: function(setting) {
			// TODO: Save settings to local storage
			DEFAULT_SETTINGS[setting] = !DEFAULT_SETTINGS[setting];

			if (setting === "centuryClub") {
				roundTotalCount = 100;
				roundTotal.innerHTML = roundTotalCount;
			}

		},
		start: function() {
			videoFrame.playVideo();
			playerTimer();
			//
			document.body.classList.add("is-loaded");
		},
		mute: function() {
			const muteButtonClassList = muteButton.children[0].classList;
			muteButtonClassList.toggle("fa-volume");
			muteButtonClassList.toggle("fa-volume-mute");

			document.body.classList.toggle("is-muted");

			if (videoFrame.isMuted()) {
				videoFrame.unMute();
				staticFx.muted = false;
			} else {
				videoFrame.mute();
				staticFx.muted = true;
			}
		},
		newVideo: function() {
			staticFx.play();
			staticFx.classList.remove("hidden");

			if (skipVideos.length < 1) {
				replacementVideo = noMoreSkips;
			} else {
				replacementVideo = skipVideos[0];
				skipVideos.shift()
			}

			const adjustedStartTime = (roundTime - player.state.elapsedTimeLeftInRound) + replacementVideo.start;

			clearInterval(playerTimerInterval);

			videoFrame.playVideo();

			playerTimer(player.state.elapsedTimeLeftInRound);

			videoFrame.loadVideoById(
				replacementVideo.videoId,
				adjustedStartTime,
			)
		},
		ui: {
			resetProgressBar: function() {
				progressBar.classList.add("no-animation");
				progressBar.style.width = "100%";
			},
			togglePlayPause: function() {
				const playButtonClassList = playButton.children[0].classList;
				playButtonClassList.toggle("fa-play");
				playButtonClassList.toggle("fa-pause");
			},
			toggleSettingsButton: function() {
				event.target.children[0].classList.toggle("fa-toggle-off");
				event.target.children[0].classList.toggle("fa-toggle-on");
				if (event.target.dataset.value === "false") {
					event.target.dataset.value = "true";
				} else {
					event.target.dataset.value = "false";
				}
				player.saveSetting(event.target.dataset.setting);
			},
			openSettingsPanel: function() {
				settingsPanel.classList.toggle("open");
			},
			closeSettingsPanel: function() {
				settingsPanel.classList.remove("open");
			},
			updateProgressBar: function(time) {
				const progress = (time / roundTime) * 100;
				progressBar.style.width = Math.floor(progress) + "%";
			}
		},
		updateState: async function(count) {
			// Sets player state video/start time based on which round the user is in.
			const youtubeFetchURL = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoPlaylist[count].videoId}&key=${YOUTUBE_API_KEY}`;

			// const videoStatus = await fetch(youtubeFetchURL)
      // .then((response) => response.json())
      // .then(data => {
      //   return data;
      // });
			//
			// const canBeEmbedded = videoStatus.items[0].contentDetails.contentRating.ytRating;
			//
			// // TODO: Catch videos that cannot be embedded and skip them (without updating video count);
			// if (canBeEmbedded === "ytAgeRestricted") {
			// 	console.error(`The video, "${videoPlaylist[count].title}" is age-restricted (https://youtu.be/${videoPlaylist[count].videoId})`);
			// 	// throw new Error("This video is age-restricted");
			// }

			player.state.currentVideoId = videoPlaylist[count].videoId;
			player.state.currentVideoStartTime = videoPlaylist[count].start;
		},
	};

	async function onPlayerReady(event) {
		const bodyID = document.body.id;

		if (bodyID === "player") {
			console.log("player");
			await player.setup();
			player.init();
		} else if (bodyID === "start") {
			console.log("start");
			videoFrame.setVolume(0);
			videoFrame.cueVideoById(
				introVideos[0].videoId,
				introVideos[0].start,
			);
			videoFrame.playVideo();
			document.body.classList.add("is-loaded");
		}
	}

	function onPlayerStateChange(event) {
		var videoData = videoFrame.getVideoData();
		// Remove static FX is YouTube
		// console.log( videoFrame.getCurrentTime() );
		if (event.data === 1) {
			staticFx.classList.add("hidden");
			staticFx.pause();
		}
		if (videoData.video_id === "VUdukEEf3ek" && event.data === 0) {
			console.log("Oh behave!");
			player.repeat("VUdukEEf3ek", 0);
		}
	}

	function playerTimer(timeRemaining) {
		let roundCountdownTime = roundTime;

		// If coming back from a pause, set the interval countdown accordingly.
		if (timeRemaining) {
			roundCountdownTime = timeRemaining - 1;
			progressBar.classList.remove("no-animation");
		}

		playerTimerInterval = setInterval(function() {

			var timer = roundCountdownTime--;

			// Display the result in the element with id="demo"
			progressBar.classList.remove("no-animation");
			player.ui.updateProgressBar(timer);
			player.state.elapsedTimeLeftInRound = timer;

			// If the count down is finished, write some text
			if (timer < 1) {
				staticFx.play();
				staticFx.classList.remove("hidden");
				clearInterval(playerTimerInterval);
				player.next();
				// Remove this
				playerTimer();
			} else if (timer < 10) {
				countdownSeconds.innerHTML = "0" + timer;
			} else if (roundTime - 2) {
				staticFx.classList.add("hidden");
				staticFx.pause();
				countdownSeconds.innerHTML = timer;
			} else {
				countdownSeconds.innerHTML = timer;
			}
		}, 1000);
	}
