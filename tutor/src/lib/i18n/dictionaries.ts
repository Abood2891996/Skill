/**
 * نصوص الواجهة بالعربي والإنجليزي.
 * All interface text in both languages. Add a key to both objects.
 */

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ar";

export function isLocale(v: unknown): v is Locale {
  return v === "ar" || v === "en";
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

const ar = {
  siteName: "سَنَد",
  siteTagline: "مدرّسك الخاص بالذكاء الاصطناعي",
  nav: { learn: "ابدأ التعلّم", home: "الرئيسية" },
  toggles: {
    language: "English",
    languageLabel: "Switch to English",
    themeToDark: "الوضع الليلي",
    themeToLight: "الوضع الفاتح",
  },
  home: {
    title: "اسأل عن درسك، وافهمه على مهلك.",
    lead: "سَنَد مدرّس خصوصي بالذكاء الاصطناعي لطلاب الكويت، من الصف الأول إلى الجامعة. يشرح لك خطوة بخطوة، ويسألك ليتأكد أنك فهمت، ويساعدك تحل واجبك بنفسك.",
    cta: "ابدأ الدرس",
    demoCaption: "مثال من محادثة مع المدرّس — الصف الرابع، اللغة العربية",
    demoQuestion: "شنو الفرق بين الفاعل والمفعول به؟",
    demoAnswer:
      "سؤال ممتاز! خذ هذه الجملة: **أكلَ الولدُ التفاحةَ**.\n\n| الكلمة | من قام بالفعل؟ | من وقع عليه الفعل؟ |\n|---|---|---|\n| الولدُ | ✔ هو **الفاعل** | |\n| التفاحةَ | | ✔ هي **المفعول به** |\n\nالفاعل مرفوع غالباً بالضمة، والمفعول به منصوب غالباً بالفتحة.\n\nجرّب أنت: في جملة «كتبَ الطالبُ الدرسَ»، من الفاعل؟",
    stepsTitle: "كيف تبدأ",
    steps: [
      { title: "اختر صفك", body: "من الأول إلى الثاني عشر، أو جامعي." },
      { title: "اختر المادة", body: "نبدأ الآن باللغة العربية واللغة الإنجليزية." },
      { title: "اسأل المدرّس", body: "اكتب سؤالك بالعربي أو بالإنجليزي، حتى باللهجة." },
    ],
    traitsTitle: "طريقة المدرّس",
    traits: [
      { title: "يرد بلغة سؤالك", body: "تسأل بالعربي يشرح بالعربي، وتسأل بالإنجليزي يشرح بالإنجليزي." },
      { title: "يساعدك تحل بنفسك", body: "في الواجبات يعطيك تلميحات بالتدريج بدل الجواب الجاهز." },
      { title: "يتكيّف مع عمرك", body: "أمثلة بسيطة من الحياة للصغار، وشرح أعمق للكبار." },
      { title: "صريح إذا ما كان متأكد", body: "يقول لك «مو متأكد» بدل ما يخترع جواب." },
    ],
    noticeTitle: "قبل أن تبدأ",
    notice: "المدرّس ذكاء اصطناعي وقد يخطئ أحياناً. راجع المعلومات المهمة مع معلمك أو كتابك المدرسي.",
  },
  picker: {
    title: "ماذا تدرس اليوم؟",
    gradeQ: "صفّك",
    subjectQ: "المادة",
    courseQ: "اسم المقرر (اختياري)",
    coursePlaceholder: "مثلاً: English for Academic Purposes",
    start: "ابدأ مع المدرّس",
    chooseFirst: "اختر الصف والمادة أولاً",
  },
  chat: {
    change: "تغيير",
    newChat: "محادثة جديدة",
    placeholder: "اكتب سؤالك هنا…",
    send: "إرسال",
    stop: "إيقاف",
    thinking: "المدرّس يكتب…",
    modeLabel: "نوع المساعدة",
    modes: {
      lesson: "شرح درس",
      quick: "سؤال سريع",
      homework: "حل واجب",
      review: "مراجعة واختبار",
      exam: "تحضير لامتحان",
    },
    quick: {
      simpler: "اشرح أبسط",
      example: "أعطني مثال",
      quizMe: "اختبرني",
      notClear: "ما فهمت",
    },
    welcome: (grade: string, subject: string) =>
      `أهلاً! أنا مدرّسك في **${subject}** لـ**${grade}**. اسألني عن أي درس، أو اكتب «اشرح لي» واسم الدرس.`,
    disclaimer: "المدرّس ذكاء اصطناعي وقد يخطئ. راجع المعلومات المهمة.",
    demoBadge: "وضع تجريبي: الردود نموذجية لأن مفتاح Claude غير مضاف بعد.",
    remaining: (n: number) => `باقي لك ${n} رسائل اليوم`,
    errors: {
      rate_limited: "وصلت للحد اليومي من الرسائل. ارجع بكرة، أو سجّل حساباً عندما يتوفر التسجيل.",
      too_fast: "أرسلت رسائل كثيرة بسرعة. انتظر دقيقة ثم أرسل مرة ثانية.",
      too_long: "رسالتك طويلة جداً. اختصرها قليلاً وأرسلها مرة ثانية.",
      busy: "المدرّس مشغول الآن. انتظر لحظات ثم أرسل سؤالك مرة ثانية.",
      network: "انقطع الاتصال. تأكد من الإنترنت ثم أرسل مرة ثانية.",
      refused: "لا أستطيع المساعدة في هذا الطلب. خلّنا نرجع للدرس، شنو سؤالك فيه؟",
      generic: "صار خطأ غير متوقع. أرسل سؤالك مرة ثانية.",
    },
  },
  footer: {
    note: "سَنَد — مدرّس بالذكاء الاصطناعي. قد يخطئ، فراجع المعلومات المهمة.",
  },
};

export type Dictionary = typeof ar;

const en: Dictionary = {
  siteName: "Sanad",
  siteTagline: "Your AI private tutor",
  nav: { learn: "Start learning", home: "Home" },
  toggles: {
    language: "العربية",
    languageLabel: "التبديل إلى العربية",
    themeToDark: "Dark mode",
    themeToLight: "Light mode",
  },
  home: {
    title: "Ask about your lesson, and understand it at your own pace.",
    lead: "Sanad is an AI private tutor for students in Kuwait, from grade 1 to university. It explains step by step, checks that you understood, and helps you solve your homework yourself.",
    cta: "Start a lesson",
    demoCaption: "Example from a tutor chat — Grade 7, English",
    demoQuestion: "When do I use \"since\" and when \"for\"?",
    demoAnswer:
      "Good question! Both go with the present perfect.\n\n| Word | Use it with | Example |\n|---|---|---|\n| **for** | a length of time | I have lived here **for** two years. |\n| **since** | a starting point | I have lived here **since** 2024. |\n\n(**for** = لمدة، **since** = منذ)\n\nYour turn: \"She has studied ___ 8 o'clock.\" Which word fits?",
    stepsTitle: "How to start",
    steps: [
      { title: "Choose your grade", body: "Grade 1 to 12, or university." },
      { title: "Choose a subject", body: "Arabic and English are available now." },
      { title: "Ask the tutor", body: "Write in Arabic or English — dialect is fine too." },
    ],
    traitsTitle: "How the tutor works",
    traits: [
      { title: "Answers in your language", body: "Ask in Arabic and it explains in Arabic; ask in English and it explains in English." },
      { title: "Helps you solve it yourself", body: "For homework it gives step-by-step hints instead of a ready answer." },
      { title: "Adapts to your age", body: "Everyday examples for younger students, deeper explanations for older ones." },
      { title: "Honest when unsure", body: "It tells you when it isn't sure instead of making an answer up." },
    ],
    noticeTitle: "Before you start",
    notice: "The tutor is an AI and can make mistakes. Check important information with your teacher or school book.",
  },
  picker: {
    title: "What are you studying today?",
    gradeQ: "Your grade",
    subjectQ: "Subject",
    courseQ: "Course name (optional)",
    coursePlaceholder: "e.g. English for Academic Purposes",
    start: "Start with the tutor",
    chooseFirst: "Choose a grade and subject first",
  },
  chat: {
    change: "Change",
    newChat: "New chat",
    placeholder: "Type your question…",
    send: "Send",
    stop: "Stop",
    thinking: "The tutor is writing…",
    modeLabel: "Kind of help",
    modes: {
      lesson: "Explain a lesson",
      quick: "Quick question",
      homework: "Homework help",
      review: "Review & quiz",
      exam: "Exam prep",
    },
    quick: {
      simpler: "Explain simpler",
      example: "Give an example",
      quizMe: "Quiz me",
      notClear: "I didn't get it",
    },
    welcome: (grade: string, subject: string) =>
      `Hi! I'm your **${subject}** tutor for **${grade}**. Ask me about any lesson, or write "explain" and the lesson name.`,
    disclaimer: "The tutor is an AI and can make mistakes. Check important information.",
    demoBadge: "Demo mode: replies are samples because the Claude key isn't added yet.",
    remaining: (n: number) => `${n} messages left today`,
    errors: {
      rate_limited: "You've reached today's message limit. Come back tomorrow, or create an account once sign-up opens.",
      too_fast: "That was a lot of messages quickly. Wait a minute, then send again.",
      too_long: "Your message is too long. Shorten it and send again.",
      busy: "The tutor is busy right now. Wait a moment, then send your question again.",
      network: "The connection dropped. Check your internet, then send again.",
      refused: "I can't help with that request. Let's get back to the lesson — what's your question?",
      generic: "Something unexpected went wrong. Send your question again.",
    },
  },
  footer: {
    note: "Sanad — an AI tutor. It can make mistakes, so check important information.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { ar, en };

export type ChatErrorCode = keyof Dictionary["chat"]["errors"];
