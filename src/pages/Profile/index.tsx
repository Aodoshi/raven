import { $api } from "@/shared/api/axios";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";

interface User {
  id: number;
  username: string;
}

export const Profile = () => {
  const [me, setMe] = useState<User>();
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="container">
      <h2 className="text-[48px] mt-10 mb-5">Ваш профиль:</h2>

      <div className="w-20 h-20 bg-gray-300 rounded-full mb-10"></div>

      <div className="mb-20">
        <p>Ваш ник</p>
        <h3 className="text-[24px]">@{me?.username}</h3>
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
