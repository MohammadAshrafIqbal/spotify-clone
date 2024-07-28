import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [rectrack, setRecTrack] = useState([]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const recommendedSong = async () => {
    if (localStorage.getItem("type")) {
      setRecTrack(
        songsData.filter((res) => res.type == localStorage.getItem("type"))
      );
    }
  };
  const play = () => {
    localStorage.setItem("type", track.type);
    audioRef.current.play();
    audioRef.current.volume = 0.1;
    setPlayStatus(true);
    recommendedSong();
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const previous = async () => {
    if (track.id > 0) {
      localStorage.setItem("type", track.type);
      await setTrack(songsData[track.id - 1]);
      await audioRef.current.play();
      setPlayStatus(true);
      recommendedSong();
    }
  };

  const next = async () => {
    if (track.id < songsData.length - 1) {
      localStorage.setItem("type", track.type);
      await setTrack(songsData[track.id + 1]);
      await audioRef.current.play();
      setPlayStatus(true);

      recommendedSong();
    }
  };

  const playWithId = async (id) => {
    console.log(songsData[id]);
    localStorage.setItem("type", songsData[id].type);
    await setTrack(songsData[id]);
    await audioRef.current.play();
    setPlayStatus(true);
    recommendedSong();
  };

  const seekSong = async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = (e) => {
        seekBar.current.style.width =
          Math.floor(
            (audioRef.current.currentTime * 100) / audioRef.current.duration
          ) + "%";
        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      };
    }, 1000);
  }, [audioRef]);
  const contextValue = {
    recommendedSong,
    audioRef,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    next,
    previous,
    play,
    pause,
    playWithId,
    seekBar,
    seekBg,
    seekSong,
    time,
    rectrack,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
