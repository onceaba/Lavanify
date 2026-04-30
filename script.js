const songs = [
    { title: "Blondie", file: "music/blondie.mp3", cover: "images/blondie.jpg" },
    { title: "Cascade", file: "music/cascade.mp3", cover: "images/cascade.jpg" },
    { title: "Ending Credits", file: "music/endcre.mp3", cover: "images/endcre.jpg" },
    { title: "Female Energy Part 2", file: "music/female energy.mp3", cover: "images/female energy.jpg" },
    { title: "For Gurk", file: "music/for gurk.mp3", cover: "images/for gurk.jpg" },
    { title: "I Love You Bae", file: "music/ilyb.mp3", cover: "images/ilyb.jpg" },
    { title: "I'm Not Angry Anymore", file: "music/im not angry anymore.mp3", cover: "images/im not angry anymore.jpg" },
    { title: "Like I Do", file: "music/like i do.mp3", cover: "images/like i do.jpg" },
    { title: "My Own Summer", file: "music/my own summer.mp3", cover: "images/my own summer.jpg" },
    { title: "Sailor Song", file: "music/sailor song.mp3", cover: "images/sailor song.jpg" },
    { title: "Weird Fishes", file: "music/weird fishes.mp3", cover: "images/weird fishes.jpg" },
    { title: "Weird Science", file: "music/weird science.mp3", cover: "images/weird science.jpg" },
    { title: "When You Sleep", file: "music/whenyousleep.mp3", cover: "images/whenyousleep.jpg" },
    { title: "Wicked Game", file: "music/wicked game.mp3", cover: "images/wicked game.jpg" }
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const mainDisplay = document.getElementById("mainDisplay");
const waveContainer = document.getElementById("waveContainer");
let currentSongIndex = 0;
let audioContext, analyser, dataArray, source;

// Bar oluşturma
for (let i = 0; i < 20; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    waveContainer.appendChild(bar);
}

function setupAudio() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    draw();
}

function draw() {
    requestAnimationFrame(draw);
    if (!audio.paused) {
        analyser.getByteFrequencyData(dataArray);
        const bars = document.querySelectorAll(".bar");
        bars.forEach((bar, i) => {
            let height = (dataArray[i] / 255) * 70;
            bar.style.height = (height + 5) + "px";
        });
    }
}

function closeModal() {
    const modal = document.getElementById("welcomeModal");
    modal.style.opacity = "0";
    setTimeout(() => modal.style.display = "none", 500);
}

function loadSong(index) {
    const song = songs[index];
    document.getElementById("title").innerText = song.title;
    document.getElementById("cover").src = song.cover;
    document.getElementById("main-cover").src = song.cover;
    audio.src = song.file;
    renderSongs();
}

function renderSongs() {
    const list = document.getElementById("songList");
    list.innerHTML = "";
    songs.forEach((song, i) => {
        const div = document.createElement("div");
        div.className = `song ${i === currentSongIndex ? 'active' : ''}`;
        div.innerHTML = `<img src="${song.cover}"><span>${song.title}</span>`;
        div.onclick = () => { currentSongIndex = i; loadSong(i); playSong(); };
        list.appendChild(div);
    });
}

function playSong() {
    setupAudio();
    if(audioContext.state === 'suspended') audioContext.resume();
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    mainDisplay.classList.add("playing");
}

function togglePlay() {
    if (audio.paused) playSong();
    else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        mainDisplay.classList.remove("playing");
    }
}

function nextSong() { currentSongIndex = (currentSongIndex + 1) % songs.length; loadSong(currentSongIndex); playSong(); }
function prevSong() { currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; loadSong(currentSongIndex); playSong(); }

audio.ontimeupdate = () => {
    const prog = document.getElementById("progress");
    if(audio.duration) {
        prog.value = (audio.currentTime / audio.duration) * 100;
        document.getElementById("currentTime").innerText = formatTime(audio.currentTime);
    }
};

audio.onloadedmetadata = () => document.getElementById("duration").innerText = formatTime(audio.duration);
document.getElementById("progress").oninput = (e) => audio.currentTime = (e.target.value / 100) * audio.duration;
document.getElementById("volume").oninput = (e) => audio.volume = e.target.value;
audio.onended = nextSong;

function formatTime(s) {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

loadSong(currentSongIndex);