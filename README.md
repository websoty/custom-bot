# Технічна документація бота (MVP)

## 1. Загальна інформація
**Мета:** Телеграм-бот для навігації по вакансіях та підрозділах, автоматичної реєстрації користувачів, збору базової аналітики та тегування користувачів.  

**Статус:** MVP, без інтегрованого бекенду та розсилок.  

**Основні фічі:**
- Навігація по дереву сценаріїв (текст + кнопки + медіа)
- Автоматична реєстрація користувачів
- Підтримка UTM-міток (`utm_source`, `utm_campaign`)
- Теги користувачів за поведінкою
- Статистика відвідувань нод (MVP)
- Підтримка фото та GIF

---

## 2. Архітектура

### 2.1. Структура даних
- **Користувачі**
```ts
type User = {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  utmSource?: string;
  utmCampaign?: string;
  tags: Set<string>;
  createdAt: Date;
};

Ролі користувачів

const userRole = new Map<number, "civilian" | "military">();

Поточна сторінка пагінації

const userPage = new Map<number, { all: number; units: number }>();

Відвідування нод

type NodeVisit = {
  nodeId: string;
  count: number;
  firstVisitedAt: Date;
  lastVisitedAt: Date;
};
const visits = new Map<number, Map<string, NodeVisit>>();

Дерево сценаріїв

type BotNode = {
  id: string;
  text?: string;
  buttons?: BotButton[];
  url?: string;
  image?: string;
};

type BotButton = {
  label: string;
  goTo?: string;
  url?: string;
};

2.2. Навігація

Всі ноди зберігаються у botTree як ключі + BotNode.

Кожна кнопка:

Перехід до іншої ноди (goTo)

Або зовнішнє посилання (url)

Підтримується повернення назад і перехід між гілками.

Для вакансій і підрозділів реалізована пагінація з 10 елементів на сторінку.

2.3. Вакансії та пагінація

Тип вакансії:

type VacancyLike = {
  id: string;
  title: string;
  url?: string;
};

Функція makeVacanciesKeyboard генерує клавіатуру для поточної сторінки.

Функція renderVacancyList відображає список вакансій з кнопками "Назад", "Попередня", "Наступна" та головне меню.

2.4. Взаємодія з користувачем

При /start автоматично створюється користувач і зберігаються UTM-мітки.

Користувачам автоматично присвоюються теги за відвідування нод, наприклад:

visited_about

visited_units

visited_contract

Підготовлена логіка для ручного додавання і видалення тегів.

2.5. Статистика

Ведеться MVP-статистика відвідувань нод:

Скільки разів користувач відкрив ноду

Дата першого та останнього візиту

Можна отримати як для одного користувача, так і загально для всіх.

2.6. Медіа

Підтримуються:

Фото (image у BotNode)

GIF

Шляхи до ресурсів обробляються функцією resolveAssetPath.

3. Команди

/start	Автоматична реєстрація користувача, стартове меню
/about	Перехід до ноди "Про СБС"
/join	Перехід до ноди "Доєднатись"
/vacancies	Перехід до списку всіх вакансій
/units	Перехід до ноди "Підрозділи"
/help	Перехід до ноди "Контакт РЦ"

4. Логіка кнопок

callback_query обробляється функцією handleAction.

Підтримуються:

Переходи по дереву нод

Пагінація

Головне меню

Кнопки з URL відкривають зовнішнє посилання, не відправляють callback.

5. Модульність та майбутнє розширення

Всі дані користувача і статистика зберігаються в пам’яті (Map) — можна замінити на базу без змін логіки.

Дерево нод (botTree) можна оновлювати без перезапуску бота (якщо підключити зберігання у JSON/DB).

Логіка тегів та статистики дозволяє підключати аналітику і розсилки у майбутньому.

6. Збереження медіа

Шлях до локальних ресурсів обробляється так:

import path from "path";

export function resolveAssetPath(relativePath: string) {
  return path.resolve(process.cwd(), relativePath);
}

7. Запуск бота
import "dotenv/config";
import { Telegraf } from "telegraf";
import { handleStart, handleAction } from "./engine/engine.js";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(handleStart);
bot.on("callback_query", handleAction);

bot.launch();
console.log("Bot started")