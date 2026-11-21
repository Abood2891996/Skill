/**
 * إعدادات الذكاء الاصطناعي — المكان الوحيد لأسماء الموديلات والحدود.
 * AI settings — the single place for model names, limits and prices.
 *
 * To change a model, edit it here only. Prices are USD per 1M tokens
 * (checked against the Claude docs on 2026-11-21) and are used for cost
 * estimates in reports.
 */

export const MODELS = {
  /** Teaching, explaining, homework guidance, exam prep. */
  tutor: "claude-sonnet-5-5",
  /** Quick questions and helper tasks (classification, summaries). */
  quick: "claude-haiku-5-5",
} as const;

export type ModelRole = keyof typeof MODELS;

export const MODEL_PRICES_USD_PER_MTOK: Record<string, { input: number; output: number; cacheRead: number }> = {
  "claude-sonnet-5-5": { input: 2, output: 10, cacheRead: 0.1 },
  // Haiku cache-read price not confirmed yet; 10% of input is the usual ratio.
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheRead: 0.01 },
};

/** How hard the model thinks before answering. Lower = faster and cheaper. */
export const EFFORT: Record<ModelRole, "low" | "medium" | "high"> = {
  tutor: "medium",
  quick: "low",
};

/** Upper bound on one reply (thinking + answer). Keeps cost per message predictable. */
export const MAX_OUTPUT_TOKENS: Record<ModelRole, number> = {
  tutor: 8000,
  quick: 3000,
};

/**
 * If the main model declines a request for safety reasons, the API can retry
 * on another model automatically. "default" lets Anthropic pick.
 * Only supported on the tutor model (not Haiku).
 */
export const USE_SERVER_FALLBACKS = true;

export const LIMITS = {
  /** Longest message a student can send (characters). */
  maxStudentMessageChars: 2000,
  /** Longest previous tutor reply accepted back from the browser (characters). */
  maxAssistantMessageChars: 12000,
  /** Only the most recent messages are sent to the model, to cap cost. */
  maxHistoryMessages: 20,
  /** Guests (no account): messages per day. Can be changed with GUEST_DAILY_MESSAGE_LIMIT. */
  guestDailyMessages: Number(process.env.GUEST_DAILY_MESSAGE_LIMIT ?? 5) || 5,
  /** Short-burst protection: messages per minute from one visitor. */
  perMinute: 8,
} as const;
