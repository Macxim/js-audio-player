var audio = document.getElementById("song");
var song = document.getElementById("currentSong");
var songCover = document.getElementById('currentSongCover');
var songList = document.getElementById("songList");
var songTime = document.getElementById("currentSongTotalTime");
var playBtn = document.getElementById('play-button');
var pauseBtn = document.getElementById('pause-button');
var songTimeRange = document.getElementById("songTimeRange");
var randomSong = false;
var repeatSong = false;
var currentSong = 0;

var songs = [
  [
    "http://www.thesoundarchive.com/starwars/star-wars-theme-song.mp3",
    "John Williams",
    "http://storage.macx.im/codepen/starwars-theme.jpg"
  ],
  [
    "http://www.thesoundarchive.com/starwars/imperial_march.mp3",
    "Darth Vader",
    "http://storage.macx.im/codepen/starwars-imperial-march.jpg"
  ],
  [
    "http://www.thesoundarchive.com/starwars/star-wars-cantina-song.mp3",
    "Figrin D'an and the Modal Nodes",
    "http://storage.macx.im/codepen/starwars-cantina.jpg"
  ],
  [
    "http://www.thesoundarchive.com/starwars/Star-Wars-Duel-of-the-Fates.mp3",
    "Qui-Gon Jinn feat. Obi-Wan Kenobi",
    "http://storage.macx.im/codepen/starwars-duel-fates.jpg"
  ],
  [
    "http://www.thesoundarchive.com/starwars/rebel-theme.mp3",
    "The Alliance Fleet",
    "http://storage.macx.im/codepen/starwars-rebel.png"
  ]
];

for (i in songs) {
  songList.innerHTML += '<li class="song-list__item" data-index="' + i[0] + '">' + cleanSongTitle(songs[i][0]) + '</li>';
}


songList.addEventListener('click', function(e){
  if(e.target && e.target.nodeName == "LI") {
    playSong(e.target.dataset.index);
  }
});


function switchPlayPause(){
  document.getElementsByClassName('btn--play')[1].classList.toggle('is-visible');
}

function play() {
  if ( (!audio.src && randomSong == true) || (audio.src && randomSong == true) ){
    shuffleSongs();
  }
  else if (audio.src) {
    audio.play();
  }
  else{
    audio.src = songs[currentSong][0];
  }
  audio.play();

  var songIndexinArr = findIndexInNestedArray(audio.src, songs);

  song.textContent = cleanSongTitle(audio.src);
  document.getElementById('currentSongAuthor').textContent = songs[songIndexinArr][1];
  document.getElementById('currentSongCover').setAttribute('src', songs[songIndexinArr][2]);

  convertDuration(song.duration);
  switchPlayPause();
}

function playSong(s) {
  currentSong = s;
  audio.src = songs[currentSong][0];
  play();
}

function pause() {
  audio.pause();
}

function stop() {
  audio.pause();
  audio.currentTime = 0;
}

function forward() {
  audio.currentTime += 10;
}

function backward() {
  audio.currentTime -= 10;
}

function stepForward() {
  currentSong++;
  if (currentSong == songs.length) {
    currentSong = 0;
  }
  audio.src = songs[currentSong][0];
  play();
}

function stepBackward() {
  --currentSong;
  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }
  audio.src = songs[currentSong][0];
  play();
}

function toggleRandom() {
  randomSong = !randomSong;
  return randomSong;
}

function toggleRepeat() {
  audio.loop = !audio.loop;
  return audio.loop;
}

function shuffleSongs() {
  if (randomSong == true){
    audio.src = songs[Math.floor(Math.random() * songs.length)][0];
  }
}

function cleanSongTitle(url) {
  var title = decodeURIComponent(url);
  var position = url.lastIndexOf('/');
  title = title.substring(position + 1).replace(/.mp3/, "").replace(/\_|-/g, " ");
  return title.split(' ').map(i => i[0].toUpperCase() + i.substr(1).toLowerCase()).join(' ');
}

function convertDuration(duration) {
  var minutes = Math.floor(duration / 60);
  var seconds = Math.floor(duration % 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}

function changeVolume(amount) {
  audio.volume = amount;
}

function changeSongProgress(value) {
  audio.currentTime = value;
}

function applyActiveClass(el){
  el.classList.toggle('is-active');
}

function findIndexInNestedArray(str, arr){
  for(var i=0;i<arr.length;i++){
    for(var j=0;j<arr[i].length;j++){
      if(arr[i][j] === str){
        var idx = [i][j]
        return idx;
      }
    }
  }
  return false;
}

document.getElementById('stop-button').addEventListener('click', function(){
  stop();
});

document.getElementById('backward-button').addEventListener('click', function(){
  backward();
});

document.getElementById('stepBackward-button').addEventListener('click', function(){
  stepBackward();
});

document.getElementById('forward-button').addEventListener('click', function(){
  forward();
});

document.getElementById('stepForward-button').addEventListener('click', function(){
  stepForward();
});

document.getElementById('volumeLevel').addEventListener('change', function(){
  changeVolume(this.value);
})

document.getElementById('songTimeRange').addEventListener('change', function(){
  changeSongProgress(this.value);
})

document.getElementById('more-controls').addEventListener('click', function(){
  applyActiveClass(this);
  document.getElementsByClassName('button-bar--secondary')[0].classList.toggle('is-visible');
});

document.getElementById('random-song').addEventListener('click', function(){
  applyActiveClass(this);
  toggleRandom();
});

document.getElementById('repeat-song').addEventListener('click', function(){
  applyActiveClass(this);
  toggleRepeat();
});

playBtn.addEventListener('click', function(){
  var triggerClick = 0;
  play();

  if(triggerClick == 0){ // first click
    var hiddenButtons = document.querySelectorAll('.button-bar--primary > button');
    for (var i=0; i<hiddenButtons.length; i++){
      hiddenButtons[i].classList.add('is-shown');
    }
    setTimeout(function(){
      document.getElementById('songdata').classList.add('is-visible');
    }, 3000);
  }
  triggerClick++;
});

pauseBtn.addEventListener('click', function(){
  pause();
  switchPlayPause();
});

audio.addEventListener("ended", function() {
  this.currentTime = 0;
  stepForward();
});

audio.addEventListener("timeupdate", function() {
  document.getElementById("currentSongCurrentTime").innerHTML = convertDuration(audio.currentTime) + " / ";

  songTimeRange.min = audio.startTime;
  songTimeRange.max = audio.duration;
  songTimeRange.value = audio.currentTime;
});

audio.addEventListener("loadedmetadata", function() {
  songTime.innerHTML = convertDuration(audio.duration);
});
