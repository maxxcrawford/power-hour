"use strict";

let videoFrame;

var iterationCount = 0;
var roundTotalCount = 60;
var roundTime = 60;

// Debug Mode
if (window.location.hash == "#debug") {
  roundTime = 12;
}

// TODO: Randomize playlist order at beginning
const videoPlaylist = [
  {videoId: "dpCe36t6oC4", start: 81},
  // {videoId: "ncR2_pnzngM", start: 99},
  {videoId: "IKiSPUc2Jck", start: 36},
  {videoId: "ulwUkaKjgY0", start: 0},
  {videoId: "mGrFtyd_LMI", start: 0},
  {videoId: "K5le9sYdYkM", start: 6},
]

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

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

shuffle(videoPlaylist);

const startButton = document.getElementById("startButton");
const playButton = document.getElementById("playButton");
const progressBar = document.getElementById("progressBar");
const roundCount = document.getElementById("roundCount");
const roundTotal = document.getElementById("roundTotal");
const countdownSeconds = document.getElementById("countdownSeconds");
const staticFx = document.getElementById("staticFx");
const muteButton = document.getElementById("muteButton");

const playerParams = {
  height: '390',
  width: '640',
  videoId: videoPlaylist[iterationCount].videoId,
  playerVars: {
    controls: 0,
    modestbranding: 1,
    start: videoPlaylist[iterationCount].start,
    autoplay: 0,
  },
  events: {
    'onReady': onPlayerReady
  }
};

function onYouTubeIframeAPIReady() {
  videoFrame = new YT.Player("videoFrame", playerParams);
}

const player = {
  init: function() {
    // console.log("init");
  },
  next: function() {
    iterationCount++;
    player.ui.resetProgressBar();
    console.log(videoPlaylist[iterationCount]);
    videoFrame.loadVideoById(videoPlaylist[iterationCount].videoId, videoPlaylist[iterationCount].start, "large")
    roundCount.innerHTML = iterationCount + 1;

    // refresh data
  },
  pause: function() {
    // pause video
    // update button
  },
  setup: function() {
    roundTotal.innerHTML = roundTotalCount;
    roundCount.innerHTML = iterationCount + 1;
    countdownSeconds.innerHTML = roundTime;
    videoFrame.setVolume(100);
    playButton.addEventListener("click", this.start, false);
    startButton.addEventListener("click", this.start, false);
    muteButton.addEventListener("click", this.mute, false);
  },
  start: function() {
    videoFrame.playVideo();
    countdownTimer();
    player.ui.togglePlayPause();
    document.body.classList.add("is-loaded");
  },
  mute: function() {
    const muteButtonClassList = muteButton.children[0].classList;
    muteButtonClassList.toggle("fa-volume");
    muteButtonClassList.toggle("fa-volume-mute");

    document.body.classList.toggle("is-muted");

    if (videoFrame.isMuted()  ) {
      videoFrame.unMute();
      staticFx.muted = false;
    } else {
      videoFrame.mute();
      staticFx.muted = true;
    }

  },
  ui: {
    togglePlayPause: function() {
      const playButtonClassList = playButton.children[0].classList;
      playButtonClassList.toggle("fa-play");
      playButtonClassList.toggle("fa-pause");
    },
    updateProgressBar: function(time) {
      const progress = (time/roundTime)*100;
      progressBar.style.width = Math.floor(progress) + "%";
    },
    resetProgressBar: function() {
      progressBar.classList.add("no-animation");
      progressBar.style.width = "100%";
      //
    }
  }
};

function onPlayerReady(event) {
  player.setup();
  player.init();
  // event.target.playVideo();
}

function countdownTimer() {

  var countdownTime = roundTime;


  var x = setInterval(function() {

      var timer = countdownTime--;

			// Display the result in the element with id="demo"
      progressBar.classList.remove("no-animation");
      player.ui.updateProgressBar(timer);

			// If the count down is finished, write some text
			if (timer < 1) {
        staticFx.classList.remove("hidden");
				clearInterval(x);
        player.next();
        // Remove this
				countdownTimer();
			} else if (timer < 10) {
        countdownSeconds.innerHTML = "0" + timer;
			} else if (roundTime - 2) {
        staticFx.classList.add("hidden");
        countdownSeconds.innerHTML = timer;
			} else {
        countdownSeconds.innerHTML = timer;
      }
		}, 1000);
}
