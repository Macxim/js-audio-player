(function (){

  const audio = document.getElementById("song");
  const song = document.getElementById("currentSong");
  const songCover = document.getElementById("currentSongCover");
  const songTime = document.getElementById("currentSongTotalTime");
  const songTimeRange = document.getElementById("songTimeRange");
  let randomSong = false;
  let repeatSong = false;
  let currentSong = 0;

  let songs = [
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

  for (let [index, value] of songs.entries()) {
    document.getElementById("song-list").innerHTML += `<li class="song-list__item" data-index="${index}">${cleanSongTitle(value[0])}</li>`;
  }

  function switchPlayPause() {
    document.getElementsByClassName("btn--play")[1].classList.toggle("is-visible");
  }

  function play() {
    if ((!audio.src && randomSong == true) || (audio.src && randomSong == true)) {
      shuffleSongs();
    } else if (audio.src) {
      audio.play();
    } else {
      audio.src = songs[currentSong][0];
    }
    audio.play();

    let songIndexinArr = findIndexInNestedArray(audio.src, songs);

    song.textContent = cleanSongTitle(audio.src);
    document.getElementById("currentSongAuthor").textContent = songs[songIndexinArr][1];
    document.getElementById("currentSongCover").setAttribute("src", songs[songIndexinArr][2]);

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
    if (randomSong == true) {
      audio.src = songs[Math.floor(Math.random() * songs.length)][0];
    }
  }

  function cleanSongTitle(url) {
    let title = decodeURIComponent(url);
    let position = url.lastIndexOf("/");
    title = title.substring(position + 1).replace(/.mp3/, "").replace(/\_|-/g, " ");
    return title.split(" ").map(i => i[0].toUpperCase() + i.substr(1).toLowerCase()).join(" ");
  }

  function convertDuration(duration) {
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }

  function changeVolume(amount) {
    audio.volume = amount;
  }

  function changeSongProgress(value) {
    audio.currentTime = value;
  }

  function applyActiveClass(el) {
    el.classList.toggle("is-active");
  }

  function findIndexInNestedArray(str, arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === str) {
          return [i][j];
        }
      }
    }
    return false;
  }


  const clickHandlers = {

    "stop-button" : stop,

    "backward-button" : backward,

    "stepBackward-button" : stepBackward,

    "forward-button" : forward,

    "stepForward-button" : stepForward,

    "more-controls" :  (e) => {
      applyActiveClass(e.currentTarget);
      document.getElementsByClassName("button-bar--secondary")[0].classList.toggle("is-visible");
    },

    "random-song" : (e) => {
      applyActiveClass(e.currentTarget);
      toggleRandom();
    },

    "repeat-song" : (e) => {
      applyActiveClass(e.currentTarget);
      toggleRepeat();
    },

    "song-list" : (e) => {
      if (e.target && e.target.nodeName == "LI") {
        playSong(e.target.dataset.index);
      }
    },

    "play-button" : () => {
      let triggerClick = 0;
      play();

      if (triggerClick == 0) { // first click
        const hiddenButtons = document.querySelectorAll(".button-bar--primary > button");
        for (let i = 0; i < hiddenButtons.length; i++) {
          hiddenButtons[i].classList.add("is-shown");
        }
        setTimeout(() => {
          document.getElementById("songdata").classList.add("is-visible");
        }, 3000);
      }
      triggerClick++;
    },

    "pause-button" : () => {
      pause();
      switchPlayPause();
    }

  }

  Object.keys(clickHandlers).forEach(function(key) {
    document.getElementById(key).addEventListener("click", clickHandlers[key]);
  });

  document.getElementById("volumeLevel").addEventListener("change", (e) => {
    changeVolume(e.currentTarget.value);
  })

  document.getElementById("songTimeRange").addEventListener("change", (e) => {
    changeSongProgress(e.currentTarget.value);
  })

  audio.addEventListener("ended", () => {
    this.currentTime = 0;
    stepForward();
  });

  audio.addEventListener("timeupdate", () => {
    document.getElementById("currentSongCurrentTime").innerHTML = convertDuration(audio.currentTime) + " / ";

    songTimeRange.min = audio.startTime;
    songTimeRange.max = audio.duration;
    songTimeRange.value = audio.currentTime;
  });

  audio.addEventListener("loadedmetadata", () => {
    songTime.innerHTML = convertDuration(audio.duration);
  });

})();
