import {
  getCsrfCookieName,
  getCsrfHeaderName,
} from "./csrf-token";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  for (const raw of document.cookie.split(";")) {
    const value = raw.trim();
    if (value.startsWith(prefix)) {
      return decodeURIComponent(value.slice(prefix.length));
    }
  }
  return null;
}

export { getCsrfCookieName, getCsrfHeaderName };

export function getCsrfToken(): string | null {
  return readCookie(getCsrfCookieName());
}

export function withCsrfHeaders(headers: HeadersInit = {}): Headers {
  const nextHeaders = new Headers(headers);
  const token = getCsrfToken();
  if (token) {
    nextHeaders.set(getCsrfHeaderName(), token);
  }
  return nextHeaders;
}
