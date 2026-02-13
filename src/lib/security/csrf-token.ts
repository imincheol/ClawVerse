const CSRF_COOKIE_NAME = "cv_csrf";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_SESSION_COOKIE_NAME = "cv_sid";
const CSRF_TTL_SECONDS = 60 * 60 * 8;

type CsrfPayload = {
  sid: string;
  iat: number;
  exp: number;
  nonce: string;
};

function toBase64Url(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input: string): string {
  const base = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base + "=".repeat((4 - (base.length % 4 || 4)) % 4);
  return atob(padded);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return toBase64Url(binary);
}

function base64UrlToBytes(input: string): Uint8Array {
  const binary = fromBase64Url(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function getSecret(): string {
  const secret = process.env.CSRF_SECRET || process.env.CRON_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CSRF_SECRET (or CRON_SECRET) is required in production");
    }
    return "dev-csrf-secret";
  }
  return secret;
}

let cachedKeyPromise: Promise<CryptoKey> | null = null;

async function getHmacKey(): Promise<CryptoKey> {
  if (!cachedKeyPromise) {
    const data = new TextEncoder().encode(getSecret());
    cachedKeyPromise = crypto.subtle.importKey(
      "raw",
      data,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
  }
  return cachedKeyPromise;
}

async function sign(input: string): Promise<string> {
  const key = await getHmacKey();
  const data = new TextEncoder().encode(input);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  return bytesToBase64Url(new Uint8Array(signature));
}

async function verify(input: string, signature: string): Promise<boolean> {
  try {
    const key = await getHmacKey();
    const data = new TextEncoder().encode(input);
    const sigBytes = base64UrlToBytes(signature);
    return crypto.subtle.verify("HMAC", key, sigBytes.buffer as ArrayBuffer, data);
  } catch {
    return false;
  }
}

export function getCsrfCookieName(): string {
  return CSRF_COOKIE_NAME;
}

export function getCsrfHeaderName(): string {
  return CSRF_HEADER_NAME;
}

export function getCsrfSessionCookieName(): string {
  return CSRF_SESSION_COOKIE_NAME;
}

export function getCsrfTtlSeconds(): number {
  return CSRF_TTL_SECONDS;
}

export async function createSignedCsrfToken(sessionId: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: CsrfPayload = {
    sid: sessionId,
    iat: now,
    exp: now + CSRF_TTL_SECONDS,
    nonce: crypto.randomUUID(),
  };

  const payloadRaw = JSON.stringify(payload);
  const encodedPayload = toBase64Url(payloadRaw);
  const signature = await sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export async function verifySignedCsrfToken(
  token: string,
  expectedSessionId: string
): Promise<boolean> {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const validSignature = await verify(encodedPayload, signature);
  if (!validSignature) return false;

  let payload: CsrfPayload;
  try {
    payload = JSON.parse(fromBase64Url(encodedPayload)) as CsrfPayload;
  } catch {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (!payload.sid || payload.sid !== expectedSessionId) return false;
  if (!payload.exp || payload.exp < now) return false;
  if (payload.iat > now + 30) return false;

  return true;
}
