import type { Message } from "@/types/message";

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    dialogId: "dlg-1001",
    role: "user",
    author: "Акме Мобайл",
    content:
      "Сбои вебхуков начались около 09:12 UTC. Наш дашборд инцидентов указывает на ваш EU-кластер.",
    createdAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-2",
    dialogId: "dlg-1001",
    role: "agent",
    author: "Дарья · Дежурная",
    content:
      "Спасибо за сигнал. Видим повышенные 5xx на платежном edge. Переводим в канал инцидента и подключаем команду оплат.",
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-3",
    dialogId: "dlg-1001",
    role: "agent",
    author: "Дарья · Дежурная",
    content:
      "Как временное решение — можете ли повторить неудавшиеся события с экспоненциальной задержкой? Мы проверим идемпотентность платформы.",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-4",
    dialogId: "dlg-1001",
    role: "user",
    author: "Акме Мобайл",
    content:
      "Подтверждаем, ретраи помогают. Но новые сбои всё ещё есть — когда ориентировочно полное восстановление?",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-5",
    dialogId: "dlg-1002",
    role: "user",
    author: "Нордик Банк",
    content:
      "Мониторинг зафиксировал нарушение СУО по API карт. Нужен письменный разбор в течение 24 часов.",
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-6",
    dialogId: "dlg-1003",
    role: "user",
    author: "ПиксельРайд",
    content:
      "Пользователи на Android сообщают, что загрузка чеков тихо падает на версии 5.2.1. На iOS всё ок.",
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-7",
    dialogId: "dlg-1003",
    role: "agent",
    author: "Илья · Поддержка",
    content:
      "Понял, воспроизводим у себя. В течение 30 минут дадим обновление: фикс или обходное решение.",
    createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
  },
];
