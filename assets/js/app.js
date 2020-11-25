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
let videoPlaylist = [
  {title: "Brett Lkes Beer (Trap Remix)", videoId: "DaX77nmv7Ec", start:9 },
  {title: "Shaun of the Dead - She's So Drunk", videoId: "JF4EyXhZudo", start:42 },
  {title: "Shaun of the Dead - The Plan", videoId: "dpCe36t6oC4", start:81 },
  {title: "Arnold Schwarzenegger - Total Recall Commentary", videoId: "ncR2_pnzngM", start:99 },
  {title: "Anchorman - Sex Panthor", videoId: "IKiSPUc2Jck", start:36 },
  {title: "The Thing - Chest Defibrillation", videoId: "JjIXwkX1e48", start:0 },
  {title: "Step Brothers - Bunk Beds", videoId: "ulwUkaKjgY0", start:0 },
  {title: "Varsity Blues - Beer Can Challenge", videoId: "RjdPAElUs9E", start:61 },
  {title: "Breakfast Club - Smoking", videoId: "uL_C29H-bYo", start:91 },
  {title: "The Departed - Corner Store Beating", videoId: "U2TdJknauD8", start:18 },
  {title: "Mac & Me - Wheelchair Scene", videoId: "K5le9sYdYkM", start:6 },
  {title: "King of the Hill - That's my purse!", videoId: "mwyBW9-we5A", start:36 },
  {title: "Crispin Glover on Letterman", videoId: "7dYjdKbMT_c", start:91 },
  {title: "There Will Be Blood - I Drink Your Milkshake", videoId: "s_hFTR6qyEo", start:66 },
  {title: "Kicking and Screaming - Food in the Beer", videoId: "h4OULP90F0c", start:17 },
  {title: "Back to the Future - Parking", videoId: "mGrFtyd_LMI", start:49 },
  {title: "Jumanji - What Year is it??", videoId: "20H_uJsmcN0", start:7 },
  {title: "Westworld - Bar shootout", videoId: "Iit33EYEpb0", start:180 },
  {title: "Harold and Kumar DVD Menu", videoId: "C6-SnNMCnJs", start:85 },
  {title: "Austin Powers Evacuation Complete", videoId: "VUdukEEf3ek", start:0 },
  {title: "Inglourious Basterds - That's a bingo!", videoId: "O5s3Oj2cPgc", start:34 },
  {title: "Pulp Fiction - Big Kahuna Burger", videoId: "Mnb_3ibUp38", start:128 },
  {title: "Blockers - Butt Chugging", videoId: "TfsGgp4go6k", start:63 },
  {title: "Stand by Me - Pie Eating Competition", videoId: "zK0JaEde4VI", start:48 },
  {title: "The Living Daylights - Ghetto Blaster", videoId: "BHyPS1boeuI", start:8 },
  {title: "Reno 911 - New Boot Goofin", videoId: "_CU0vYZpslk", start:16 },
  {title: "Anchorman - Fight Scene", videoId: "ipsPgNEmAXI", start:245 },
  {title: "Batman - Joker in Museum", videoId: "ZGFbd-zF_Cg", start:80 },
  {title: "Top Gun - Volleyball", videoId: "via8G0cqQME", start:2 },
  {title: "Accepted - Ask Me About My Wiener", videoId: "eP52omnnZmg", start:12 },
  {title: "Good Will Hunting - My Boy's Wicked Smart", videoId: "hIdsjNGCGz4", start:108 },
  {title: "Tombstone - Doc Holiday", videoId: "MICPyrnGYwg", start:68 },
  {title: "Hot Rod - Falling Down the Mountain", videoId: "A8GnphPdchY", start:78 },
  {title: "Hot Rod - Cool Beans", videoId: "TOUrLn1FFCA", start:27 },
  {title: "The Shining - Bar Scene", videoId: "tmY4k85_XEE", start:0 },
  {title: "Django Unchained - Beer Foam", videoId: "tSjie7nTzJA", start:43 },
  {title: "Beerfest - ZJ", videoId: "2gVhZT1tHzg", start:46 },
  {title: "Beefest - Das Boot", videoId: "wEqVkJiYJ80", start:61 },
  {title: "Silicon Valley - Jerk Algorithm", videoId: "P-hUV9yhqgY", start:23 },
  {title: "Old School - Frank the Tank", videoId: "rCY6xAsmaes", start:38 },
  {title: "Big Trouble in Little China - Six Demon Bag", videoId: "RR7q-qf3VSQ", start:2 },
  {title: "Road House - Bar Fight", videoId: "4WsstoMZu0o", start:76 },
  {title: "Cat Woman - One-on-One", videoId: "o02MxS2ugEU", start:22 },
  {title: "Point Break - Fuck You Up", videoId: "aMukX7yVSTM", start:43 },
  {title: "Always Sunny - Pepe Silvia", videoId: "ghrdSTC66MA", start:0 },
  {title: "Too Many Cooks", videoId: "QrGrOK8oZG8", start:0 },
  {title: "Always Sunny - Wade Boggs", videoId: "7HCYEoLKFgw", start:0 },
  {title: "Office Space - TPS Reports", videoId: "jsLUidiYm0w", start:0 },
  {title: "Office Space - Fax Machine", videoId: "N9wsjroVlu8", start:1 },
  {title: "Superbad - Fake ID", videoId: "BBYyflqgV8A", start:58 },
  {title: "Happy Gilmore - The Price Is Wrong, Bitch", videoId: "8QJiAK-s5a0", start:90 },
  {title: "The Big Lebowski - Over the Line", videoId: "YedqV4Gl_us", start:61 },
  {title: "Monty Python and the Holy Grail - Knight Running", videoId: "XslcgQJMZaY", start:0 },
  {title: "Waynes World - Sponsors", videoId: "KjB6r-HDDI0", start:9 },
  {title: "Super Troopers - Meow", videoId: "1rlSjdnAKY4", start:32 },
  {title: "Starship Troopers - I'm Doing My Part", videoId: "EKHme9MvMx0", start:0 },
  {title: "Snatch - Pikey Caravan", videoId: "tGDO-9hfaiI", start:29 }
];

let endingVideos = [
  {title: "Rocky - Steps Sequence", videoId: "_YYmfM2TfUA", start:103 },
  {title: "Thelma & Louise", videoId: "66CP-pq7Cx0", start:172 }
];

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

videoPlaylist.push(endingVideos[0], endingVideos[1]);

console.dir(videoPlaylist);


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
        staticFx.play();
        staticFx.classList.remove("hidden");
				clearInterval(x);
        player.next();
        // Remove this
				countdownTimer();
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
