import { NextRequest } from "next/server";

const WINDOW_SECONDS = 5 * 60;
const replayCache = new Map<string, number>();

function getSecret(): string | null {
  return process.env.CRON_HMAC_SECRET || process.env.CRON_SECRET || null;
}

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

const keyCache = new Map<string, Promise<CryptoKey>>();

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const existing = keyCache.get(secret);
  if (existing) return existing;

  const data = new TextEncoder().encode(secret);
  const keyPromise = crypto.subtle.importKey(
      "raw",
      data,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
  );
  keyCache.set(secret, keyPromise);
  return keyPromise;
}

function pruneReplayCache(nowSec: number) {
  for (const [key, expiry] of replayCache) {
    if (expiry <= nowSec) replayCache.delete(key);
  }
}

export function resetCronReplayCacheForTest() {
  replayCache.clear();
  keyCache.clear();
}

export async function createCronSignature(
  method: string,
  path: string,
  timestamp: string,
  secret: string
): Promise<string> {
  const key = await getHmacKey(secret);
  const payload = `${timestamp}.${method.toUpperCase()}.${path}`;
  const data = new TextEncoder().encode(payload);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function verifyCronRequest(
  request: NextRequest,
  expectedPath: string,
  options: { secrets?: Array<string | null | undefined> } = {}
): Promise<boolean> {
  const candidates = options.secrets && options.secrets.length > 0
    ? options.secrets
    : [getSecret()];
  const secretList = candidates
    .filter((secret): secret is string => Boolean(secret))
    .filter((secret, index, self) => self.indexOf(secret) === index);
  if (secretList.length === 0) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) return false;

  const timestamp = request.headers.get("x-cron-timestamp");
  const signature = request.headers.get("x-cron-signature");
  if (!timestamp || !signature) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;

  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - ts) > WINDOW_SECONDS) return false;

  pruneReplayCache(nowSec);

  const replayKey = `${expectedPath}:${timestamp}:${signature}`;
  if (replayCache.has(replayKey)) return false;

  const actualSigBytes = base64UrlToBytes(signature);
  for (const secret of secretList) {
    if (token.length !== secret.length) continue;

    try {
      const expectedSig = await createCronSignature(
        request.method,
        expectedPath,
        timestamp,
        secret
      );
  
      const key = await getHmacKey(secret);
      const payload = `${timestamp}.${request.method.toUpperCase()}.${expectedPath}`;
      const data = new TextEncoder().encode(payload);
      const expectedSigBytes = base64UrlToBytes(expectedSig);
      const ok = await crypto.subtle.verify(
        "HMAC",
        key,
        actualSigBytes as BufferSource,
        data
      );

      if (!ok) continue;

      // Guard against equivalent but malformed encodings.
      if (expectedSigBytes.length !== actualSigBytes.length) continue;

      replayCache.set(replayKey, nowSec + WINDOW_SECONDS);
      return true;
    } catch {
      continue;
    }
  }

  return false;
}
