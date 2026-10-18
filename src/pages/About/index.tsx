const features = [
  {
    number: "01",
    title: "Один экран",
    text: "Запускай, ставь на паузу и перематывай. Видео синхронно у всех участников комнаты.",
  },
  {
    number: "02",
    title: "Своя комната",
    text: "Открытая — для всех. Закрытая — только для тех, кому ты отправил пароль.",
  },
  {
    number: "03",
    title: "Общий чат",
    text: "Обсуждай происходящее прямо во время просмотра. История сообщений остаётся в комнате.",
  },
  {
    number: "04",
    title: "Без пауз на настройку",
    text: "Меняй ссылку на видео в любой момент — она сразу появится у всей компании.",
  },
];

const steps = [
  "Войди или создай аккаунт",
  "Создай комнату или присоединись к открытой",
  "Добавь ссылку на видео",
  "Позови друзей и включай",
];

const stack = [
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "Socket.IO",
  "SQLite",
];

export const About = () => {
  return (
    <main className="container max-w-4xl flex flex-col gap-16 px-5 pb-32 pt-12 sm:px-8 sm:pt-20 text-zinc-200 selection:bg-white selection:text-black">
      {/* Шапка / Заголовок */}
      <section className="flex flex-col gap-4 border-b border-white/10 pb-12">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
          Совместный просмотр // Пет-проект
        </span>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
          RAVEN
        </h1>
        <p className="text-xl font-medium text-zinc-400 sm:text-2xl mt-2">
          Смотрите вместе. Даже на расстоянии.
        </p>
        <p className="text-sm leading-relaxed text-zinc-400 max-w-2xl sm:text-base font-light mt-1">
          Одна комната. Одно видео. Один момент — для всех. Собирай друзей,
          запускай просмотр и оставайся на связи, где бы вы ни были. Никаких
          отдельных отсчётов и ручной синхронизации.
        </p>
      </section>

      {/* Возможности */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
          01. Возможности платформы
        </h2>
        <ul className="flex flex-col gap-6">
          {features.map((item) => (
            <li
              key={item.number}
              className="group cursor-default flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-b border-white/5 pb-6"
            >
              <span className="text-xs font-mono text-zinc-600 group-hover:text-white transition-colors">
                {item.number}
              </span>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white uppercase tracking-wide mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Как начать */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
          02. Как начать просмотр
        </h2>
        <ol className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className="group cursor-default flex items-center gap-4 text-sm sm:text-base"
            >
              <span className="font-mono text-xs text-zinc-600 group-hover:text-white transition-colors">
                0{index + 1}.
              </span>
              <span className="text-zinc-300 font-medium">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Технологический стек */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
          03. Стек технологий
        </h2>
        <div className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="cursor-default text-xs font-mono text-zinc-300 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded hover:border-white/30 hover:text-white transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* О проекте */}
      <section className="flex flex-col gap-3 border-t border-white/10 pt-10">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider">
          Не кинотеатр, а ваша компания
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 font-light max-w-2xl">
          RAVEN создан для ламповых посиделок с друзьями за просмотром видео в
          реальном времени. Если есть идеи по улучшению или баг — пиши, всегда
          рад обратной связи.
        </p>
      </section>
    </main>
  );
};
