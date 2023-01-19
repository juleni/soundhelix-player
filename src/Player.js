import { useEffect, useRef, useState } from "react";
import "./Player.css";

function Player(url) {
  let songs = [];
  for (let i = 1; i < 18; i++) {
    songs.push({
      name: "Song #" + i,
      artist: "SoundHelix",
      img: "/assets/soundhelix.jpg",
      audio:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-" + i + ".mp3",
    });
  }
  /*
  const songs = [
    {
      name: "Song #1", // "Rat In The River",
      artist: "SoundHelix",
      img: "/assets/soundhelix.jpg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      name: "Song #2", // "Giants And Companions",
      artist: "SoundHelix",
      img: "/assets/soundhelix.jpg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      name: "Song #3", // "Ashamed Of Light",
      artist: "SoundHelix",
      img: "/assets/soundhelix.jpg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    {
      name: "Song #4", // "Doubting The Forest",
      artist: "SoundHelix",
      img: "/assets/soundhelix.jpg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    },
    {
      name: "Song #5", // "Criminals Of The Lake",
      artist: "SoundHelix",
      img: "/assets/soundhelix.jpg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    },
  ];*/

  const progressDetailsRef = useRef();
  const progressBarRef = useRef();
  const repeatBtnRef = useRef();
  const shuffleBtnRef = useRef();

  const [songIndex, setSongIndex] = useState(0);
  const [songName, setSongName] = useState();
  const [artistName, setArtistName] = useState();
  const [imageName, setImageName] = useState();
  const [audioURL, setAudioURL] = useState(songs[songIndex].audio);
  const [songDuration, setSongDuration] = useState(0);
  const [songCurrentTime, setSongCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const audioObject = new Audio(audioURL);
  const [audio, setAudio] = useState(audioObject);

  audioObject.addEventListener("timeupdate", (e) => {
    // Get current song time
    const currentTime = audioObject.currentTime; // e.path[0].currentTime;
    // Get total song time
    const totalTime = audioObject.duration; // e.path[0].duration;
    let barWidth = (currentTime / totalTime) * 100;
    progressBarRef.current.style.width = barWidth + "%";

    progressDetailsRef.current.addEventListener("click", (e) => {
      // Get width of progress bar
      let progressTotalWidth = progressDetailsRef.current.clientWidth;
      // Get actual clicked offset X of progress bar
      let clickedOffsetX = e.offsetX;
      // Get total music duration
      let musicDuration = audioObject.duration;

      // Set current music position
      let currentTime = (clickedOffsetX / progressTotalWidth) * musicDuration;
      audioObject.currentTime =
        (clickedOffsetX / progressTotalWidth) * musicDuration;
      setSongCurrentTime(currentTime);
    });

    // Timer logic (set times after audio is loaded)
    audioObject.addEventListener("loadeddata", () => {
      let musicDuration = audioObject.duration;
      setSongDuration(musicDuration);
      progressBarRef.current.style.width = "0%";
    });

    // Update current playing time
    setSongCurrentTime(currentTime);

    // Repeat button logic
    repeatBtnRef.current.addEventListener("click", () => {
      //setSongCurrentTime(0);
      audioObject.currentTime = 0;
    });
  });

  // audio.addEventListener("ended", () => {
  //   nextSong();
  // });

  function toggle() {
    setPlaying(!playing);
  }

  function setSong() {
    setSongName(songs[songIndex].name);
    setArtistName(songs[songIndex].artist);
    setImageName(songs[songIndex].img);
    setAudioURL(songs[songIndex].audio);
    audioObject.src = songs[songIndex].audio;
    setAudio(audioObject);
    progressBarRef.current.style.width = "0%";
  }

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    setSong();
  }, [songIndex]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  function prevSong() {
    if (playing) toggle();

    if (songIndex > 0) {
      setSongIndex(songIndex - 1);
    } else {
      setSongIndex(songs.length - 1);
    }
  }

  function nextSong() {
    if (playing) toggle();
    if (songIndex < songs.length - 1) {
      setSongIndex(songIndex + 1);
    } else {
      setSongIndex(0);
    }
  }

  function shuffleSong() {
    if (playing) toggle();
    const randomIndex = Math.floor(Math.random() * songs.length);
    setSongIndex(randomIndex);
    console.log("Random song index: " + randomIndex);
  }

  // Format time format to min:sec (seconds as 2 digits long)
  function formatMusicTime(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    let outputTime = minutes + ":";
    if (seconds < 10) outputTime += "0";
    outputTime += seconds;
    return outputTime;
  }

  return (
    <div className="content">
      <div className="top-bar">
        <span className="material-symbols-outlined">expand_more</span>
        <span>SoundHelix Player</span>
        <span className="material-symbols-outlined">more_horiz</span>
      </div>
      <div className="image-wrapper">
        <div className="music-image">
          <img src={imageName} alt="" />
        </div>
      </div>
      <div className="music-titles">
        <p className="name">{songName}</p>
        <p className="artist">{artistName}</p>
      </div>
      <div
        className="progress-details"
        ref={progressDetailsRef}
        alt="Go to position"
        title="Set position"
      >
        <div className="progress-bar" ref={progressBarRef}>
          <span title="Current position"></span>
        </div>
        <div className="time">
          <span className="current">{formatMusicTime(songCurrentTime)}</span>
          <span className="final">{formatMusicTime(songDuration)}</span>
        </div>
      </div>
      <div className="control-btn">
        <span
          className="material-symbols-outlined"
          id="repeat"
          ref={repeatBtnRef}
          alt="Repeat song"
          title="Repeat"
        >
          repeat
        </span>
        <span
          onClick={prevSong}
          className="material-symbols-outlined"
          id="prev"
          alt="Previous song"
          title="Previous"
        >
          skip_previous
        </span>
        <div className="play-pause">
          <span
            onClick={toggle}
            className="material-symbols-outlined"
            alt="Play song"
            title="Play"
          >
            {!playing ? "play_arrow" : "pause"}
          </span>
        </div>
        <span
          onClick={nextSong}
          className="material-symbols-outlined"
          id="next"
          alt="Next song"
          title="Next"
        >
          skip_next
        </span>
        <span
          className="material-symbols-outlined"
          id="shuffle"
          ref={shuffleBtnRef}
          onClick={shuffleSong}
          alt="Shuffle"
          title="Shuffle"
        >
          shuffle
        </span>
      </div>
      <audio></audio>
    </div>
  );
}

export default Player;
