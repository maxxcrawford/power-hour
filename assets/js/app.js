"use strict";

let videoFrame;

var iterationCount = 0;
var roundTotalCount = 60;

// TODO: Randomize playlist order at beginning
const videoPlaylist = [
  {videoId: "dpCe36t6oC4", start: 81},
  {videoId: "ncR2_pnzngM", start: 99},
  {videoId: "IKiSPUc2Jck", start: 36},
  {videoId: "ulwUkaKjgY0", start: 0},
  {videoId: "mGrFtyd_LMI", start: 0},
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

const playPause = document.getElementById("playPause");
const progressBar = document.getElementById("progressBar");
const roundCount = document.getElementById("roundCount");
const roundTotal = document.getElementById("roundTotal");
const countdownSeconds = document.getElementById("countdownSeconds");

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
    console.log("init");
  },
  next: function() {
    iterationCount++;
    console.log(videoPlaylist[iterationCount]);
    videoFrame.loadVideoById(videoPlaylist[iterationCount].videoId, videoPlaylist[iterationCount].start, "large")
    roundCount.innerHTML = iterationCount;
    // refresh data
  },
  pause: function() {
    // pause video
    // update button
  },
  setup: function(elem) {
    console.log("setup", elem, this.start);
    roundTotal.innerHTML = roundTotalCount;
    roundCount.innerHTML = iterationCount + 1;
    elem.addEventListener("click", this.start, false);
  },
  start: function() {
    videoFrame.playVideo();
    countdownTimer();
    player.ui.togglePlayPause();
  },
  ui: {
    togglePlayPause: function() {
      const playPauseClassList = playPause.children[0].classList;
      playPauseClassList.toggle("fa-play-circle");
      playPauseClassList.toggle("fa-pause-circle");
    },
    updateProgressBar: function(time) {
      const progress = (time/60)*100;
      progressBar.style.width = Math.floor(progress) + "%";
    },
    resetProgressBar: function() {
      progressBar.classList.add("no-animation");
      progressBar.style.width = "100%";
      progressBar.classList.remove("no-animation");
    }
  }
};

function onPlayerReady(event) {
	console.log("onPlayerReady");
  player.setup(playPause);
  player.init();
  // event.target.playVideo();
}

function countdownTimer() {

  console.log("countdownTimer");

  var countDownDate = 60;

  var x = setInterval(function() {

      var timer = countDownDate--;

			// Display the result in the element with id="demo"

      player.ui.updateProgressBar(timer);

			// If the count down is finished, write some text
			if (timer < 1) {
				clearInterval(x);

        player.next();
        // Remove this
				countdownTimer();
			} else if (timer < 10) {
        countdownSeconds.innerHTML = "0" + timer;
			} else {
        countdownSeconds.innerHTML = timer;
      }
		}, 1000);
}
