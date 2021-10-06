const video = document.getElementById('video');
const play = document.getElementById('play');
const pause = document.getElementById('pause');
const stop = document.getElementById('stop');
const progress = document.getElementById('progress');
const timestamp = document.getElementById('timestamp');

// Functions
const toggleVideoStatus = function () {
  if (video.paused) {
    playVideo();
  } else {
    pauseVideo();
  }
};

const playVideo = function () {
  video.play();
  pause.classList.remove('hidden');
  play.classList.add('hidden');
};

const pauseVideo = function () {
  video.pause();
  pause.classList.add('hidden');
  play.classList.remove('hidden');
};

const stopVideo = function () {
  video.currentTime = 0;
  pauseVideo();
};

const updateProgress = function () {
  progress.value = (video.currentTime / video.duration) * 100;
  let mins = Math.floor(video.currentTime / 60);
  let secs = Math.floor(video.currentTime % 60);

  mins < 10 ? (mins = '0' + String(mins)) : mins;
  secs < 10 ? (secs = '0' + String(secs)) : secs;

  timestamp.innerText = `${mins}:${secs}`;
};

const setVideoProgress = function () {
  video.currentTime = (parseInt(progress.value) * video.duration) / 100;
};

// Event listeners
[video, play, pause].forEach(event =>
  event.addEventListener('click', toggleVideoStatus)
);

stop.addEventListener('click', stopVideo);

video.addEventListener('timeupdate', updateProgress);
progress.addEventListener('change', setVideoProgress);
