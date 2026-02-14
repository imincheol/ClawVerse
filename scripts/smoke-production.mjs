#!/usr/bin/env node

const siteUrl = (process.env.SITE_URL || "https://www.clawverse.io").replace(/\/$/, "");
const expectedCommit = process.env.EXPECT_COMMIT || "";
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 10 * 60 * 1000);
const intervalMs = Number(process.env.SMOKE_INTERVAL_MS || 10 * 1000);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(path) {
  const res = await fetch(`${siteUrl}${path}`, {
    headers: { "cache-control": "no-cache" },
  });
  return { res, text: await res.text() };
}

async function waitForHealthyHome() {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const { res, text } = await fetchText("/");
      const okStatus = res.status === 200;
      const hasCommit = !expectedCommit || text.includes(expectedCommit);
      if (okStatus && hasCommit) return;
      console.log(
        `waiting for deployment... status=${res.status} commit=${
          hasCommit ? "ok" : "missing"
        }`
      );
    } catch (error) {
      console.log(`waiting for deployment... request error: ${String(error)}`);
    }
    await sleep(intervalMs);
  }
  throw new Error("Timed out waiting for healthy production deployment");
}

async function assertJsonEndpoint(path, validator) {
  const { res, text } = await fetchText(path);
  if (res.status !== 200) {
    throw new Error(`${path} returned ${res.status}`);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`${path} did not return JSON`);
  }
  validator(data);
}

await waitForHealthyHome();

await assertJsonEndpoint("/api/projects?limit=5", (data) => {
  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    throw new Error("projects API returned empty data");
  }
});

await assertJsonEndpoint("/api/skills?limit=5", (data) => {
  if (!Array.isArray(data.skills) || data.skills.length === 0) {
    throw new Error("skills API returned empty data");
  }
});

await assertJsonEndpoint("/api/pulse?limit=5", (data) => {
  if (!Array.isArray(data.items)) {
    throw new Error("pulse API returned invalid payload");
  }
});

console.log("Production smoke checks passed.");
