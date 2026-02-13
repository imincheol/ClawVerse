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

let cachedKeyPromise: Promise<CryptoKey> | null = null;

async function getHmacKey(secret: string): Promise<CryptoKey> {
  if (!cachedKeyPromise) {
    const data = new TextEncoder().encode(secret);
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

function pruneReplayCache(nowSec: number) {
  for (const [key, expiry] of replayCache) {
    if (expiry <= nowSec) replayCache.delete(key);
  }
}

export function resetCronReplayCacheForTest() {
  replayCache.clear();
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
  expectedPath: string
): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;

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
    const actualSigBytes = base64UrlToBytes(signature);
    const expectedSigBytes = base64UrlToBytes(expectedSig);
    const ok = await crypto.subtle.verify("HMAC", key, actualSigBytes.buffer as ArrayBuffer, data);

    if (!ok) return false;

    // Guard against equivalent but malformed encodings.
    if (expectedSigBytes.length !== actualSigBytes.length) return false;
  } catch {
    return false;
  }

  replayCache.set(replayKey, nowSec + WINDOW_SECONDS);
  return true;
}
