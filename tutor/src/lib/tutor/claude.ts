import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { EFFORT, MAX_OUTPUT_TOKENS, MODELS, USE_SERVER_FALLBACKS, type ModelRole } from "@/config/ai";
import type { ChatErrorCode } from "@/lib/i18n/dictionaries";
import type { ChatMessage } from "@/lib/validation";
import { CORE_RULES } from "./prompt";

/** True when no Claude key is configured: the site runs on sample replies. */
export function isDemoMode(): boolean {
  return !process.env.ANTHROPIC_API_KEY?.trim();
}

let client: Anthropic | undefined;
function getClient(): Anthropic {
  // The key stays on the server; it is never sent to the browser.
  client ??= new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    // Always the official API (ignores any ANTHROPIC_BASE_URL set for other tools).
    baseURL: "https://api.anthropic.com",
    maxRetries: 2, // automatic retry on overload / network errors
    timeout: 90_000,
  });
  return client;
}

/** Which model handles this request. Quick questions go to the cheaper, faster model. */
export function pickModel(mode: string): ModelRole {
  return mode === "quick" ? "quick" : "tutor";
}

export type TutorUsage = {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
};

export type TutorStreamResult = { usage?: TutorUsage; refused: boolean };

/**
 * Streams the tutor's reply. Calls onText for each piece of text and resolves
 * with token usage when done. Throws on API errors (see toChatError).
 */
export async function streamTutorReply(opts: {
  role: ModelRole;
  sessionContext: string;
  messages: ChatMessage[];
  onText: (text: string) => void;
  signal?: AbortSignal;
}): Promise<TutorStreamResult> {
  const model = MODELS[opts.role];
  const useFallbacks = USE_SERVER_FALLBACKS && opts.role === "tutor";

  const stream = getClient().beta.messages.stream(
    {
      model,
      max_tokens: MAX_OUTPUT_TOKENS[opts.role],
      output_config: { effort: EFFORT[opts.role] },
      ...(useFallbacks ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
      system: [
        // Fixed rules first, marked for caching (same bytes on every request).
        { type: "text", text: CORE_RULES, cache_control: { type: "ephemeral" } },
        // Per-student context after the cached part.
        { type: "text", text: opts.sessionContext },
      ],
      messages: opts.messages.map((m) => ({ role: m.role, content: m.content })),
    },
    { signal: opts.signal },
  );

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      opts.onText(event.delta.text);
    }
  }

  const final = await stream.finalMessage();
  const u = final.usage;
  return {
    refused: final.stop_reason === "refusal",
    usage: {
      model: final.model,
      inputTokens: u.input_tokens,
      outputTokens: u.output_tokens,
      cacheReadTokens: u.cache_read_input_tokens ?? 0,
      cacheWriteTokens: u.cache_creation_input_tokens ?? 0,
    },
  };
}

/** Turns an API error into a friendly message code for the student. */
export function toChatError(err: unknown): ChatErrorCode {
  if (err instanceof Anthropic.APIConnectionError) return "network";
  if (err instanceof Anthropic.RateLimitError || err instanceof Anthropic.InternalServerError) return "busy";
  return "generic";
}
