/**
 * Shared between the server route and the browser: marks the end-of-stream
 * status message (an ASCII "record separator", which never appears in replies).
 */
export const STATUS_MARK = "\u001e";
