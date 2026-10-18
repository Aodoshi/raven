import { VideoPlayer, Video, VideoSkin } from "@videojs/react/video";
import "@videojs/react/video/skin.css";
import { sendMediaControl } from "@/features/player/api/playerSocket";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/shared/socket/socket";
import { useRoomStore } from "@/entities/room/model/roomStore";
import { $api } from "@/shared/api/axios";

interface User {
  userId: number;
  name: string;
}

export const Player = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomOwnerId = useRoomStore((state) => state.roomState?.ownerId);
  const [me, setMe] = useState<User>();

  const isOwner = me?.userId === roomOwnerId;

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await $api.get("/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
      console.log("RECEIVED:", action, currentTime);

      if (!videoRef.current) return;

      videoRef.current.currentTime = currentTime;

      if (action === "play") {
        videoRef.current.play();
      }

      if (action === "pause") {
        videoRef.current.pause();
      }
    };

    socket.on("media-state-update", handleMediaStateUpdate);

    return () => {
      socket.off("media-state-update", handleMediaStateUpdate);
    };
  }, []);

  return (
    <VideoPlayer>
      <VideoSkin>
        <Video
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
        />
      </VideoSkin>
    </VideoPlayer>
  );
};
