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

  const avatarSrc = `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}${me?.avatarUrl}`;

  return (
    <div className="px-5 py-12 text-[#f2f3f5]">
      <div className="container">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#949ba4]">
            Account settings
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Моя учётная запись
          </h1>
          <p className="mt-2 text-sm text-[#b5bac1]">
            Управляйте информацией своего аккаунта.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg bg-[#2b2d31]">
          <div className="flex flex-wrap items-center justify-between gap-5 p-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[28px] bg-[#404249]">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Аватар профиля"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#b5bac1]">
                    {me?.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold">
                  {me?.username ?? "Пользователь"}
                </h2>
                <p className="mt-1 text-sm text-[#b5bac1]">
                  Фото профиля и публичное имя
                </p>
              </div>
            </div>

            {!isEditing && (
              <Button
                onClick={startEditing}
                className="rounded-md bg-[#5865f2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4752c4]"
              >
                Редактировать
              </Button>
            )}

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
                  className="rounded-md bg-[#4e5058] px-4 py-2 text-sm text-white hover:bg-[#5d6069]"
                >
                  {uploading ? "Загрузка..." : "Изменить фото"}
                </Button>
              </>
            )}
          </div>

          <div className="border-t border-[#3f4148] p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase text-[#b5bac1]">
                Имя пользователя
              </h3>
              <p className="mt-1 text-xs text-[#949ba4]">
                Ваш уникальный никнейм в системе.
              </p>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center rounded-md bg-[#1e1f22] px-4 focus-within:ring-1 focus-within:ring-[#5865f2]">
                  <span className="text-[#949ba4]">@</span>
                  <input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveUsername()}
                    maxLength={30}
                    autoFocus
                    placeholder="Введите никнейм"
                    className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-[#6d7078]"
                  />
                </div>

                <p className="text-right text-xs text-[#949ba4]">
                  {newUsername.length}/30
                </p>

                {error && (
                  <p
                    role="alert"
                    className="rounded-md bg-[#da373c]/10 px-4 py-3 text-sm text-[#fa777c]"
                  >
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={saving}
                    onClick={saveUsername}
                    className="rounded-md bg-[#5865f2] px-5 py-2.5 text-sm text-white hover:bg-[#4752c4]"
                  >
                    {saving ? "Сохранение..." : "Сохранить изменения"}
                  </Button>

                  <Button
                    onClick={cancelEditing}
                    className="rounded-md bg-[#4e5058] px-5 py-2.5 text-sm text-white hover:bg-[#5d6069]"
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-md bg-[#1e1f22] px-4 py-3">
                <span className="truncate text-sm font-medium">
                  @{me?.username}
                </span>
                <span className="text-xs text-[#949ba4]">Username</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-sm font-bold uppercase text-[#b5bac1]">
            Действия с аккаунтом
          </h2>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#da373c]/30 bg-[#2b2d31] p-5">
            <div>
              <h3 className="text-sm font-semibold">Завершить сеанс</h3>
              <p className="mt-1 text-xs text-[#949ba4]">
                Выйти из аккаунта на этом устройстве.
              </p>
            </div>

            <Button
              onClick={() => {
                localStorage.removeItem("token");
                alert("Вы вышли с аккаунта");
                window.location.href = "/";
              }}
              className="rounded-md bg-[#da373c] px-4 py-2.5 text-sm text-white transition hover:bg-[#a1282d]"
            >
              Выйти из аккаунта
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#6d7078]">
          Настройки пользователя
        </p>
      </div>
    </div>
  );
};
