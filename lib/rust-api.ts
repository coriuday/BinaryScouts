/** Resolve Rust gateway URLs for chat/heist proxies (local or Render). */
function rustBase(): string | undefined {
  return process.env.RUST_API_BASE_URL?.replace(/\/$/, '');
}

export function getRustChatUrl(): string {
  if (process.env.RUST_API_URL) return process.env.RUST_API_URL;
  const base = rustBase();
  if (base) return `${base}/api/chat`;
  return 'http://127.0.0.1:8081/api/chat';
}

export function getRustHeistUrl(): string {
  if (process.env.RUST_API_URL_HEIST) return process.env.RUST_API_URL_HEIST;
  const base = rustBase();
  if (base) return `${base}/api/heist`;
  return 'http://127.0.0.1:8081/api/heist';
}
