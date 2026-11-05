import { VideoPlayer, Video, VideoSkin } from "@videojs/react/video";
import "@videojs/react/video/skin.css";
import { sendMediaControl } from "@/features/player/api/playerSocket";
import { useEffect, useMemo, useRef, useState } from "react";
import { socket } from "@/shared/socket/socket";
import { useRoomStore } from "@/entities/room/model/roomStore";
import { $api } from "@/shared/api/axios";
import { changeVideoUrl } from "@/entities/room/api/roomSocket";
import { Button } from "@/shared/ui/button";
import YouTube from "react-youtube";
import type { YouTubeEvent, YouTubePlayer } from "react-youtube";

interface User {
  userId: number;
  username: string;
}

const YT_PLAYING = 1;
const YT_PAUSED = 2;

const getYoutubeId = (rawUrl: string): string | null => {
  try {
    const url = new URL(rawUrl);
    if (url.hostname === "youtu.be") return url.pathname.slice(1) || null;
    if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      const match = url.pathname.match(/^\/(embed|shorts)\/([\w-]+)/);
      return match ? match[2] : null;
    }
  } catch {}
  return null;
};

export const Player = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytRef = useRef<YouTubePlayer | null>(null);
  const lastTimeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const roomOwnerId = useRoomStore((state) => state.roomState?.ownerId);
  const videoUrl = useRoomStore((state) => state.videoUrl);
  const [me, setMe] = useState<User>();
  const [joined, setJoined] = useState(false);
  const [link, setLink] = useState<string>("");
  const [linkError, setLinkError] = useState<string>("");

  const isOwner = me?.userId === roomOwnerId;
  const locked = !isOwner && joined;
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;

  const ytOpts = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      playerVars: {
        controls: isOwner ? 1 : 0,
        disablekb: isOwner ? 0 : 1,
        rel: 0,
        playsinline: 1,
      },
    }),
    [isOwner],
  );

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await $api.get("/me");
        setMe(response.data);
      } catch (error) {
        console.error("Не удалось загрузить профиль", error);
      }
    };

    fetchMe();
  }, []);

  useEffect(() => {
    if (!youtubeId) ytRef.current = null;
  }, [youtubeId]);

  useEffect(() => {
    const handleMediaStateUpdate = ({
      action,
      currentTime,
    }: {
      action: "play" | "pause" | "seek";
      currentTime: number;
    }) => {
      const yt = ytRef.current;
      if (yt) {
        const diff = Math.abs(yt.getCurrentTime() - currentTime);

        if (action !== "play" || diff > 0.5) {
          yt.seekTo(currentTime, true);
        }
        if (action === "play") yt.playVideo();
        if (action === "pause") yt.pauseVideo();
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      const diff = Math.abs(video.currentTime - currentTime);

      if (action !== "play" || diff > 0.5) {
        video.currentTime = currentTime;
      }
      if (action === "play") {
        video.play().catch((error) => console.warn("браузер запретил", error));
      }
      if (action === "pause") {
        video.pause();
      }
    };

    socket.on("media-state-update", handleMediaStateUpdate);

    return () => {
      socket.off("media-state-update", handleMediaStateUpdate);
    };
  }, []);

  useEffect(() => {
    if (!isOwner || !youtubeId) return;

    const timer = setInterval(() => {
      const yt = ytRef.current;
      if (!yt) return;

      const actual = yt.getCurrentTime();
      const playing = yt.getPlayerState() === YT_PLAYING;
      const last = lastTimeRef.current;

      const expected = playing ? last + 0.5 : last;

      if (Math.abs(actual - expected) > 1) {
        sendMediaControl("seek", actual);
      }

      lastTimeRef.current = actual;
    }, 500);

    return () => clearInterval(timer);
  }, [isOwner, youtubeId]);

  const handleYtReady = (e: YouTubeEvent) => {
    ytRef.current = e.target;
  };

  const handleYtStateChange = (e: YouTubeEvent<number>) => {
    if (!isOwner) return;

    const time = e.target.getCurrentTime();
    lastTimeRef.current = time;

    if (e.data === YT_PLAYING) sendMediaControl("play", time);
    if (e.data === YT_PAUSED) sendMediaControl("pause", time);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen().catch((error) =>
        console.warn("Не удалось включить полный экран", error),
      );
    }
  };

  const handleJoin = () => {
    setJoined(true);

    const { isPlaying, currentTime } = useRoomStore.getState().roomState ?? {};
    const time = currentTime ?? 0;

    const yt = ytRef.current;
    if (yt) {
      yt.playVideo();
      yt.seekTo(time, true);
      if (!isPlaying) yt.pauseVideo();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    video
      .play()
      .then(() => {
        if (!isPlaying) video.pause();
      })
      .catch((error) => console.warn("Не удалось разблокировать", error));
  };

  const video = (
    <Video
      key={videoUrl}
      className="rounded-2xl"
      ref={videoRef}
      src={videoUrl}
      playsInline
      onPlay={() => {
        if (!isOwner) return;
        sendMediaControl("play", videoRef.current?.currentTime || 0);
      }}
      onPause={() => {
        if (!isOwner) return;
        sendMediaControl("pause", videoRef.current?.currentTime || 0);
      }}
      onSeeked={() => {
        if (!isOwner) return;
        sendMediaControl("seek", videoRef.current?.currentTime || 0);
      }}
    />
  );

  const handleChangeVideoUrl = () => {
    try {
      const url = new URL(link.trim());

      if (!url.protocol.startsWith("http") && !url.protocol.startsWith("https"))
        throw new Error("Неверный протокол");

      changeVideoUrl(url.href);
      setLink("");
      setLinkError("");
    } catch {
      setLinkError("Неверная ссылка на видео");
    }
  };

  if (!me) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden group shadow-2xl bg-black/40 border border-white/10 backdrop-blur-xl"
    >
      <div className="w-full rounded-2xl ">
        {youtubeId ? (
          <div className="aspect-video w-full">
            <YouTube
              videoId={youtubeId}
              opts={ytOpts}
              onReady={handleYtReady}
              onStateChange={handleYtStateChange}
              className="w-full h-full"
              iframeClassName="w-full h-full"
            />
          </div>
        ) : (
          <VideoPlayer>
            {isOwner ? <VideoSkin>{video}</VideoSkin> : video}
          </VideoPlayer>
        )}

        {isOwner && (
          <div>
            <input
              placeholder="Вставьте ссылку на видео"
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="mt-4 px-4 py-2 bg-black/50 text-white placeholder:text-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Button onClick={handleChangeVideoUrl}>Сменить</Button>
            {linkError && <p>{linkError}</p>}
          </div>
        )}
      </div>

      {locked && youtubeId && <div className="absolute inset-0 z-[5]" />}

      {me && !isOwner && !joined && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm p-6 text-center">
          <button
            onClick={handleJoin}
            className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Подключиться к просмотру
          </button>
          <p className="mt-3 text-xs text-white/40 tracking-wide">
            требуется для синхронизации
          </p>
        </div>
      )}

      {locked && (
        <button
          onClick={toggleFullscreen}
          className="absolute right-4 bottom-4 z-10 flex items-center justify-center w-10 h-10 text-white/80 hover:text-white bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl border border-white/10 transition-all duration-200 cursor-pointer shadow-lg"
          title="На весь экран"
        >
          ⛶
        </button>
      )}
    </div>
  );
};
