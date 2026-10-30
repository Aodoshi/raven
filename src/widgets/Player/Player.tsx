import { VideoPlayer, Video, VideoSkin } from "@videojs/react/video";
import "@videojs/react/video/skin.css";
import { sendMediaControl } from "@/features/player/api/playerSocket";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/shared/socket/socket";
import { useRoomStore } from "@/entities/room/model/roomStore";
import { $api } from "@/shared/api/axios";

interface User {
  userId: number;
  username: string;
}

export const Player = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomOwnerId = useRoomStore((state) => state.roomState?.ownerId);
  const [me, setMe] = useState<User>();
  const [joined, setJoined] = useState(false);
  const isOwner = me?.userId === roomOwnerId;

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
    const handleMediaStateUpdate = ({
      action,
      currentTime,
    }: {
      action: "play" | "pause" | "seek";
      currentTime: number;
    }) => {
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

  const containerRef = useRef<HTMLDivElement>(null);

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

  const locked = !isOwner && joined;

  const handleJoin = () => {
    setJoined(true);

    const video = videoRef.current;
    if (!video) return;
    video
      .play()
      .then(() => video.pause())
      .catch((error) => console.warn("Не удалось разблокировать", error));
  };

  const video = (
    <Video
      className="rounded-2xl"
      ref={videoRef}
      src="https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/highest.mp4"
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

  if (!me) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden group shadow-2xl bg-black/40 border border-white/10 backdrop-blur-xl"
    >
      <div className="w-full">
        <VideoPlayer>
          {isOwner ? <VideoSkin>{video}</VideoSkin> : video}
        </VideoPlayer>
      </div>

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
