import type { BotNode } from "../types/bot.js";
import { vacancies } from "../services/vacancies.js";
import { unitVacancies } from "../services/unitVacancies.js";

export const botTree: Record<string, BotNode> = {
  all_vacancies: {
    id: "all_vacancies",
    text: "Доступні вакансії:",
    buttons: vacancies
      .map((v) => ({
        label: v.title,
        goTo: `vacancy_${v.id}`,
      }))
      .concat([{ label: "🏠 Повернутись у головне меню", goTo: "start" }]),
  },

  vacancies_units: {
    id: "vacancies_units",
    text: "Вакансії підрозділів:",
    buttons: unitVacancies
      .map((v) => ({
        label: v.title,
        goTo: `unit_vacancy_${v.id}`,
      }))
      .concat([{ label: "⬅️ Назад", goTo: "civilian_vacancies" }]),
  },

  // start, main screen
  start: {
    id: "start",
    text: "Ви у головному меню, оберіть потрібний вам розділ ⬇️",
    buttons: [
      { label: "🔈Про СБС", goTo: "about" },
      { label: "📑Доєднатись", goTo: "join" },
    ],
  },

  join: {
    id: "join",
    text:
      "УВАГА - на жаль, ми не розглядаємо підрозділи ДПСУ, Національної гвардії, СБУ, МВС для подальшої співпраці, " +
      "якщо Ви служите у вашому підрозділі менше ніж 8 місяців, ми також не зможемо розглянути Вашу анкету.",
    buttons: [
      { label: "🪖 Військовий", goTo: "join_military" },
      { label: "👤 Цивільний", goTo: "civilian_education" },
      { label: "⬅️ Назад", goTo: "start" },
    ],
  },

  // military
  join_military: {
    id: "join_military",
    text: "Оберіть, з чим Вам потрібна допомога",
    buttons: [
      { label: "СЗЧ", goTo: "awol" },
      { label: "Переведення", goTo: "transfer" },
      { label: "⬅️ Назад", goTo: "join" },
    ],
  },

  military_form_status: {
    id: "military_form_status",
    text: "Чи перебуваєте Ви зараз у зоні бойових дій?",
    buttons: [
      { label: "Так", goTo: "military_form_discipline" },
      { label: "Ні", goTo: "military_form_discipline" },
      { label: "⬅️ Назад", goTo: "start" },
    ],
  },
  military_form_discipline: {
    id: "military_form_discipline",
    text: "Чи маєте Ви діючі дисциплінарні стягнення?",
    buttons: [
      { label: "Так", goTo: "military_form_ready" },
      { label: "Ні", goTo: "military_form_ready" },
      { label: "⬅️ Назад", goTo: "military_form_status" },
    ],
  },

  military_form_ready: {
    id: "military_form_ready",
    text: "Коли Ви готові до контакту або переведення?",
    buttons: [
      { label: "Негайно", goTo: "military_form_done" },
      { label: "Протягом місяця", goTo: "military_form_done" },
      { label: "Пізніше", goTo: "military_form_done" },
      { label: "⬅️ Назад", goTo: "military_form_discipline" },
    ],
  },
  military_form_done: {
    id: "military_form_done",
    text:
      "✅ Анкету військовослужбовця прийнято.\n\n" +
      "Вашу заявку передано до рекрутингового центру.\n" +
      "З Вами звʼяжуться для подальших дій.",
    buttons: [{ label: "🏠 Повернутись у головне меню", goTo: "start" }],
  },

  // awol - сзч
  awol: {
    id: "awol",
    text: "Вкажіть, чи є це першим випадком СЗЧ?",
    buttons: [
      { label: "Перший раз", goTo: "health" },
      { label: "Не перший раз", goTo: "health" },
      { label: "⬅️ Назад", goTo: "join_military" },
    ],
  },

  health: {
    id: "health",
    text: "Яке рішення військово-лікарської комісії (ВЛК) Вам встановлено?",
    buttons: [
      { label: "Придатний", goTo: "rank" },
      { label: "Обмежено придатний", goTo: "rank" },
      { label: "⬅️ Назад", goTo: "join_military" },
    ],
  },

  rank: {
    id: "rank",
    text: "Ваше військове звання",
    buttons: [
      { label: "Солдат/Сержант", goTo: "contact_rc" },
      { label: "Офіцер", goTo: "contact_rc" },
      { label: "⬅️ Назад", goTo: "health" },
    ],
  },

  act_awol: {
    id: "act_awol",
    text: "Дякуємо.\nВаш запит прийнято, з Вами звʼяжуться для подальших дій.",
    buttons: [{ label: "🏠 Повернутись у головне меню", goTo: "start" }],
  },

  // mil. transfer - перевод
  transfer: {
    id: "transfer",
    text: "Місце проходження служби",
    buttons: [
      { label: "Служу в бойовій частині", goTo: "health_transfer" },
      { label: "Служу в тиловій частині", goTo: "health_transfer" },
      { label: "⬅️ Назад", goTo: "join_military" },
    ],
  },

  health_transfer: {
    id: "health_transfer",
    text: "Яке рішення військово-лікарської комісії (ВЛК) Вам встановлено?",
    buttons: [
      { label: "Придатний", goTo: "rank_transfer" },
      { label: "Обмежено придатний", goTo: "rank_transfer" },
      { label: "⬅️ Назад", goTo: "transfer" },
    ],
  },

  rank_transfer: {
    id: "rank_transfer",
    text: "Ваше військове звання",
    buttons: [
      { label: "Солдат/Сержант", goTo: "transfer_vacancies" },
      { label: "Офіцер", goTo: "transfer_vacancies" },
      { label: "⬅️ Назад", goTo: "health_transfer" },
    ],
  },

  transfer_vacancies: {
    id: "transfer_vacancies",
    text: "Оберіть вакансії:",
    buttons: [
      { label: "Вакансії підрозділів", goTo: "vacancies_units" },
      { label: "Усі вакансії", goTo: "all_vacancies" },
      { label: "⬅️ Назад", goTo: "rank_transfer" },
      { label: "🏠 Повернутись у головне меню", goTo: "start" },
    ],
  },

  // civilian
  civilian_education: {
    id: "civilian_education",
    text: "Оберіть рівень військової підготовки",
    buttons: [
      { label: "Без військової кафедри", goTo: "civilian_vacancies" },
      { label: "Після військової кафедри", goTo: "civilian_vacancies" },
      { label: "⬅️ Назад", goTo: "join" },
    ],
  },

  civilian_vacancies: {
    id: "civilian_vacancies",
    text: "Оберіть вакансії:",
    buttons: [
      { label: "Вакансії підрозділів", goTo: "vacancies_units" },
      { label: "Усі вакансії", goTo: "all_vacancies" },
      { label: "🏠 Повернутись у головне меню", goTo: "start" },
    ],
  },

  civilian_form_age: {
    id: "civilian_form_age",
    text: "Ваш вік?",
    buttons: [
      { label: "18–24", goTo: "civilian_form_experience" },
      { label: "25–35", goTo: "civilian_form_experience" },
      { label: "36+", goTo: "civilian_form_experience" },
      { label: "⬅️ Назад", goTo: "civilian_vacancies" },
    ],
  },

  civilian_form_experience: {
    id: "civilian_form_experience",
    text: "Чи маєте корисні навички або досвід?",
    buttons: [
      { label: "Технічні / IT", goTo: "civilian_form_ready" },
      { label: "Медицина", goTo: "civilian_form_ready" },
      { label: "Логістика / транспорт", goTo: "civilian_form_ready" },
      { label: "Без досвіду", goTo: "civilian_form_ready" },
      { label: "⬅️ Назад", goTo: "civilian_form_age" },
    ],
  },

  civilian_form_ready: {
    id: "civilian_form_ready",
    text: "Чи готові Ви проходити підготовку та службу?",
    buttons: [
      { label: "Так", goTo: "civilian_form_done" },
      { label: "Потрібна консультація", goTo: "civilian_form_done" },
      { label: "⬅️ Назад", goTo: "civilian_form_experience" },
    ],
  },

  civilian_form_done: {
    id: "civilian_form_done",
    text: "Дякуємо!\nАнкету прийнято. Найближчим часом з Вами звʼяжеться представник РЦ.",
    buttons: [{ label: "🏠 Повернутись у головне меню", goTo: "start" }],
  },

  contact_rc: {
    id: "contact_rc",
    text: "Залиште заявку, і представник рекрутингового центру звʼяжеться з Вами.",
    buttons: [
      { label: "📞 Очікую дзвінка", goTo: "contact_rc_done" },
      { label: "💬 Очікую повідомлення", goTo: "contact_rc_done" },
      { label: "🏠 Повернутись у головне меню", goTo: "start" },
    ],
  },

  contact_rc_done: {
    id: "contact_rc_done",
    text: "Дякуємо!\nВашу заявку передано до рекрутингового центру.",
    buttons: [{ label: "🏠 Повернутись у головне меню", goTo: "start" }],
  },

  //about
  about: {
    id: "about",
    text: "Про СБС",
    buttons: [
      { label: "🪖 Підрозділи", goTo: "units" },
      { label: "📋 Умови служби", goTo: "service_conditions" },
      { label: "📰 Контракт 18-24", goTo: "contract" },
      { label: "Інші поширенні питання", goTo: "questions" },
      { label: "⬅️ Назад", goTo: "start" },
    ],
  },

  questions: {
    id: "questions",
    text: "Вкажіть, що Вас саме цікавить?",
    buttons: [
      { label: "Що зі мною буде після заявки?", goTo: "contact_rc" },
      { label: "Куди я потраплю після зарахування?", goTo: "contact_rc" },
      { label: "⬅️ Назад", goTo: "about" },
    ],
  },

  contract: {
    id: "contract",
    text: "Контракт 18-24",
    buttons: [
      { label: "⚔️ Посади", goTo: "all_vacancies" },
      { label: "🛡 Підрозділи", goTo: "units" },
      { label: "📋 Умови контракту", goTo: "terms_contract" },
      { label: "⬅️ Назад", goTo: "about" },
    ],
  },

  terms_contract: {
    id: "terms_contract",
    text: "Перейдіть будь-ласка за посиланням, для ознайомлення.",
    buttons: [
      {
        label: "📋 Умови контракту 18-24",
        url: "https://18-24.army.gov.ua/assets/%D0%9A%D0%BE%D0%BD%D1%82%D1%80%D0%B0%D0%BA%D1%82_18-24.pdf",
      },
      { label: "⬅️ Назад", goTo: "contract" },
    ],
  },

  service_conditions: {
    id: "service_conditions",
    text: `
<b>Умови проходження військової служби</b>

• Мобілізація та контракт  
• Грошове забезпечення  
• Соціальні гарантії  
• Військові звання  
• Медична комісія (ВЛК)  
• Побут та забезпечення

ℹ️ Детальні умови залежать від підрозділу та посади
`,
    buttons: [
      { label: "📑 Контракт 18–24", goTo: "terms_contract" },
      { label: "📑Залишити заявку для уточнення", goTo: "contact_rc" },
      { label: "⬅️ Назад", goTo: "about" },
    ],
  },

  units: {
    id: "units",
    text: "Оберіть дію:",
    image: "assets/army.jpg",
    buttons: [
      { label: "📋 Переглянути підрозділи", goTo: "units_list" },
      { label: "⬅️ Назад", goTo: "about" },
    ],
  },

  units_details: {
    id: "units_details",
    text: `
<b>Про підрозділи СБС</b>

• напрямки
• особливості служби
• підготовку
• традиції

ℹ️ Деталі залежать від конкретного підрозділу
`,
    buttons: [
      { label: "📑Залишити заявку для уточнення", goTo: "contact_rc" },
      { label: "⬅️ Назад", goTo: "units" },
    ],
  },
};
