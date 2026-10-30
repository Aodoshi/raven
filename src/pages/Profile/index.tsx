import { $api } from "@/shared/api/axios";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui/button";

interface User {
  userId: number;
  username: string;
  avatarUrl: string;
}

export const Profile = () => {
  const [me, setMe] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await $api.get("/me");
        setMe(response.data);
      } catch (error) {
        console.error("Не удалось загрузить профиль", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const startEditing = () => {
    setNewUsername(me?.username ?? "");
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError("");
  };

  const saveUsername = async () => {
    const username = newUsername.trim();

    if (username.length < 3 || username.length > 30) {
      return setError("Ник от 3 до 30 символов");
    }

    if (username === me?.username) {
      return setIsEditing(false);
    }

    setSaving(true);
    setError("");

    try {
      const { data } = await $api.patch("/me", { username });

      localStorage.setItem("token", data.token);
      setMe((prev) => (prev ? { ...prev, username: data.username } : prev));
      setIsEditing(false);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Не удалось сохранить ник");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // чтобы можно было выбрать тот же файл повторно
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return setError("Нужен jpg, png или webp");
    }
    if (file.size > 2 * 1024 * 1024) {
      return setError("Максимальный размер: 2 МБ");
    }

    const form = new FormData();
    form.append("avatar", file); // имя поля "avatar" ждёт сервер

    setUploading(true);
    setError("");

    try {
      const { data } = await $api.post("/me/avatar", form);
      setMe((prev) => (prev ? { ...prev, avatarUrl: data.avatarUrl } : prev));
    } catch (e: any) {
      setError(e?.response?.data?.error || "Не удалось загрузить аватарку");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  const SERVER_URL = "http://localhost:3001";

  const avatarSrc = me?.avatarUrl ? SERVER_URL + me.avatarUrl : null;

  return (
    <div className="container">
      <div className="flex items-center">
        <h2 className="text-[48px]">Ваш профиль:</h2>
        {!isEditing && (
          <button className="underline" onClick={startEditing}>
            Редактировать профиль
          </button>
        )}
      </div>
      <div className="mb-10 flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            me?.username[0].toUpperCase()
          )}
        </div>

        {isEditing && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Загрузка..." : "Сменить фото"}
            </Button>
          </>
        )}
      </div>

      <div className="mb-20">
        <p>Ваш ник</p>

        {isEditing ? (
          <div>
            <input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveUsername()}
              maxLength={30}
              autoFocus
              className="border rounded px-3 py-2 text-[24px]"
            />
            <Button disabled={saving} onClick={saveUsername}>
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
            <Button onClick={cancelEditing}>Отмена</Button>
          </div>
        ) : (
          <h3 className="text-[24px]">@{me?.username}</h3>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <Button
        onClick={() => {
          localStorage.removeItem("token");
          alert("Вы вышли с аккаунта");
          window.location.href = "/";
        }}
      >
        Выйти с аккаунта
      </Button>
    </div>
  );
};
