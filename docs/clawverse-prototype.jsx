import { useState, useEffect, useRef } from "react";

// ─── Data ───
const SKILLS = [
  { id: 1, name: "browser-automation", desc: "Automate web browsing, form filling, and data scraping", source: "ClawHub", installs: 12840, rating: 4.7, reviews: 234, security: "verified", category: "browser", permissions: ["network", "shell"], platform: ["OpenClaw", "Claude Code"] },
  { id: 2, name: "google-calendar", desc: "Manage Google Calendar events, reminders, and scheduling", source: "ClawHub", installs: 9520, rating: 4.8, reviews: 189, security: "verified", category: "productivity", permissions: ["api-key"], platform: ["OpenClaw"] },
  { id: 3, name: "fal-text-to-image", desc: "Generate, remix, and edit images using fal.ai's models", source: "ClawHub", installs: 7300, rating: 4.5, reviews: 156, security: "verified", category: "media", permissions: ["api-key", "network"], platform: ["OpenClaw", "Codex"] },
  { id: 4, name: "ffmpeg-video-editor", desc: "Generate FFmpeg commands from natural language descriptions", source: "ClawHub", installs: 5100, rating: 4.3, reviews: 98, security: "reviewed", category: "media", permissions: ["shell", "file"], platform: ["OpenClaw"] },
  { id: 5, name: "figma", desc: "Professional Figma design analysis and asset export", source: "ClawHub", installs: 4200, rating: 4.6, reviews: 87, security: "reviewed", category: "design", permissions: ["api-key", "network"], platform: ["OpenClaw", "Claude Code"] },
  { id: 6, name: "swarm-orchestrator", desc: "Multi-agent coordination with permission-controlled task delegation", source: "GitHub", installs: 3800, rating: 4.4, reviews: 72, security: "reviewed", category: "agent", permissions: ["shell", "network"], platform: ["OpenClaw"] },
  { id: 7, name: "mailchannels", desc: "Send email via MailChannels API and ingest signed webhooks", source: "ClawHub", installs: 3200, rating: 4.1, reviews: 45, security: "reviewed", category: "communication", permissions: ["api-key"], platform: ["OpenClaw"] },
  { id: 8, name: "elevenlabs-tts", desc: "Text-to-speech with ElevenLabs voices and cloning", source: "ClawHub", installs: 2900, rating: 4.5, reviews: 61, security: "verified", category: "media", permissions: ["api-key", "network"], platform: ["OpenClaw", "Claude Code"] },
  { id: 9, name: "obsidian-vault", desc: "Read, write, and search your Obsidian vault", source: "GitHub", installs: 2100, rating: 4.2, reviews: 38, security: "reviewed", category: "productivity", permissions: ["file"], platform: ["OpenClaw"] },
  { id: 10, name: "crypto-wallet-sync", desc: "Sync and monitor cryptocurrency wallet balances", source: "GitHub", installs: 1500, rating: 3.2, reviews: 22, security: "flagged", category: "finance", permissions: ["api-key", "network", "file"], platform: ["OpenClaw"] },
  { id: 11, name: "claude-proxy-free", desc: "Free Claude API proxy with unlimited requests", source: "GitHub", installs: 890, rating: 1.8, reviews: 15, security: "blocked", category: "utility", permissions: ["network", "shell", "file"], platform: ["OpenClaw"] },
  { id: 12, name: "smart-home-bridge", desc: "Control HomeKit, Hue, and smart home devices via chat", source: "ClawHub", installs: 1800, rating: 4.0, reviews: 29, security: "unreviewed", category: "iot", permissions: ["network"], platform: ["OpenClaw"] },
  { id: 13, name: "gamma-presentations", desc: "Generate AI-powered presentations using Gamma.app", source: "ClawHub", installs: 6100, rating: 4.6, reviews: 130, security: "verified", category: "productivity", permissions: ["api-key", "network"], platform: ["OpenClaw", "Codex"] },
  { id: 14, name: "joko-moltbook", desc: "Interact with Moltbook social network for AI agents", source: "ClawHub", installs: 4400, rating: 4.3, reviews: 91, security: "reviewed", category: "social", permissions: ["network", "api-key"], platform: ["OpenClaw"] },
  { id: 15, name: "imagemagick", desc: "Comprehensive ImageMagick operations for image manipulation", source: "ClawHub", installs: 3600, rating: 4.4, reviews: 67, security: "verified", category: "media", permissions: ["shell", "file"], platform: ["OpenClaw", "Claude Code"] },
];

const DEPLOY_OPTIONS = [
  { name: "SimpleClaw", level: 1, cost: "유료", setup: "1분", security: "중", scale: "낮음", url: "simpleclaw.com", desc: "가장 쉬운 원클릭 배포. 비개발자에게 최적", best: "완전 초보" },
  { name: "EasyClaw", level: 1, cost: "유료", setup: "1분", security: "중", scale: "중", url: "simpleclaw.org", desc: "원클릭 + 멀티채널 대시보드", best: "초보 + 멀티채널" },
  { name: "ClawNest", level: 1, cost: "유료", setup: "5분", security: "높음", scale: "중", url: "clawnest.ai", desc: "매니지드 호스팅. 스웨덴 서버. 백업/GUI 포함", best: "보안 중시 초보" },
  { name: "ClawStack", level: 2, cost: "유료", setup: "수분", security: "중", scale: "중", url: "clawstack.app", desc: "WhatsApp/Telegram/WebChat 통합 배포", best: "빠른 시작" },
  { name: "DigitalOcean", level: 2, cost: "$12/월~", setup: "10분", security: "높음", scale: "높음", url: "digitalocean.com", desc: "공식 파트너. 보안 강화 1-Click 이미지", best: "프로덕션" },
  { name: "Kuberns", level: 2, cost: "유료", setup: "수분", security: "중", scale: "높음", url: "kuberns.com", desc: "GitHub 연동 원클릭. 자동 재시작/헬스체크", best: "개발자 친화적" },
  { name: "Moltworker", level: 3, cost: "$5/월~", setup: "30분", security: "높음", scale: "높음", url: "github.com/cloudflare/moltworker", desc: "Cloudflare Workers. 에지 보안 + 브라우저 자동화", best: "Cloudflare 유저" },
  { name: "NanoClaw", level: 3, cost: "무료", setup: "30분", security: "매우 높음", scale: "낮음", url: "github.com/qwibitai/nanoclaw", desc: "경량 보안 중심. Apple/Docker 컨테이너 격리", best: "보안 최우선" },
  { name: "Docker", level: 4, cost: "무료~", setup: "1시간+", security: "설정별", scale: "높음", url: "docker.com", desc: "직접 Docker 컨테이너 구성", best: "완전한 커스텀" },
  { name: "로컬 설치", level: 4, cost: "무료", setup: "1-3시간", security: "낮음", scale: "-", url: "openclaw.ai", desc: "Mac/Linux/Windows(WSL) 직접 설치", best: "풀 컨트롤" },
];

const PROJECTS = [
  { name: "OpenClaw", desc: "핵심 AI 에이전트 프레임워크", layer: "core", stars: 182000, status: "active", official: true, url: "github.com/openclaw/openclaw" },
  { name: "ClawHub", desc: "공식 스킬 레지스트리 (5,705 스킬)", layer: "core", stars: null, status: "active", official: true, url: "clawhub.ai" },
  { name: "OnlyCrabs", desc: "SOUL.md 레지스트리 — 에이전트 페르소나 공유", layer: "core", stars: null, status: "active", official: true, url: "onlycrabs.ai" },
  { name: "Pi (Pi-Mono)", desc: "OpenClaw 내부 미니멀 에이전트 런타임", layer: "core", stars: null, status: "active", official: true, url: "openclaw.ai" },
  { name: "Moltbook", desc: "AI 에이전트 전용 소셜 네트워크 (37K+ 에이전트)", layer: "social", stars: null, status: "viral", official: false, url: "moltbook.com" },
  { name: "ClankedIn", desc: "에이전트용 LinkedIn — 에이전트 프로필 & 네트워킹", layer: "social", stars: null, status: "active", official: false, url: "clawhub.ai" },
  { name: "Claw-Swarm", desc: "멀티에이전트 스웜 오케스트레이션", layer: "collab", stars: 890, status: "active", official: false, url: "github.com/jovanSAPFIONEER/Network-AI" },
  { name: "Clawork", desc: "AI 에이전트 잡보드", layer: "collab", stars: null, status: "active", official: false, url: "clawhub.ai" },
  { name: "ClawPrint", desc: "스킬 추출 및 배포 + 에이전트 신원 확인", layer: "trust", stars: null, status: "active", official: false, url: "clawprint.xyz" },
  { name: "Crustafarian", desc: "에이전트 연속성 및 인지 건강 인프라", layer: "trust", stars: null, status: "active", official: false, url: "clawhub.ai" },
  { name: "Gibberlink", desc: "AI 에이전트 간 독자적 오디오 통신 프로토콜", layer: "experimental", stars: null, status: "research", official: false, url: "연구 프로젝트" },
  { name: "ClawGrid", desc: "1000×1000 그리드에 에이전트 호스팅", layer: "experimental", stars: null, status: "active", official: false, url: "claw-grid.com" },
  { name: "NanoBot", desc: "초경량 AI 어시스턴트 (~4,000줄)", layer: "experimental", stars: null, status: "active", official: false, url: "sourceforge" },
];

const CATEGORIES = [
  { id: "all", label: "전체", icon: "🌐" },
  { id: "browser", label: "브라우저", icon: "🌍" },
  { id: "productivity", label: "생산성", icon: "⚡" },
  { id: "media", label: "미디어", icon: "🎨" },
  { id: "design", label: "디자인", icon: "✏️" },
  { id: "communication", label: "커뮤니케이션", icon: "💬" },
  { id: "agent", label: "에이전트", icon: "🤖" },
  { id: "social", label: "소셜", icon: "👥" },
  { id: "finance", label: "금융", icon: "💰" },
  { id: "iot", label: "IoT", icon: "🏠" },
  { id: "utility", label: "유틸리티", icon: "🔧" },
];

const SECURITY_LEVELS = {
  verified: { label: "검증됨", color: "#22c55e", icon: "🟢", bg: "rgba(34,197,94,0.1)" },
  reviewed: { label: "리뷰됨", color: "#eab308", icon: "🟡", bg: "rgba(234,179,8,0.1)" },
  unreviewed: { label: "미검토", color: "#f97316", icon: "🟠", bg: "rgba(249,115,22,0.1)" },
  flagged: { label: "경고", color: "#ef4444", icon: "🔴", bg: "rgba(239,68,68,0.1)" },
  blocked: { label: "차단", color: "#991b1b", icon: "⛔", bg: "rgba(153,27,27,0.15)" },
};

const LAYERS = {
  core: { label: "코어", color: "#c084fc", icon: "🦞" },
  social: { label: "소셜", color: "#38bdf8", icon: "🤝" },
  collab: { label: "협업", color: "#34d399", icon: "🔄" },
  trust: { label: "신뢰", color: "#fbbf24", icon: "🔐" },
  experimental: { label: "실험", color: "#f472b6", icon: "🧪" },
};

// ─── Components ───

function SecurityBadge({ level }) {
  const s = SECURITY_LEVELS[level];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.color}30`, whiteSpace: "nowrap" }}>
      {s.icon} {s.label}
    </span>
  );
}

function PermBadge({ perm }) {
  const map = { "api-key": "🔑 API Key", shell: "⚙️ Shell", file: "📁 파일", network: "🌐 네트워크" };
  return <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 6, background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>{map[perm] || perm}</span>;
}

function StarCount({ count }) {
  if (!count) return null;
  const fmt = count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K` : count;
  return <span style={{ fontSize: 12, color: "#fbbf24" }}>⭐ {fmt}</span>;
}

function SkillCard({ skill, onClick }) {
  const sec = SECURITY_LEVELS[skill.security];
  return (
    <div onClick={onClick} style={{ background: skill.security === "blocked" ? "rgba(153,27,27,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${skill.security === "blocked" ? "rgba(153,27,27,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = sec.color + "60"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = skill.security === "blocked" ? "rgba(153,27,27,0.3)" : "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <code style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>{skill.name}</code>
        <SecurityBadge level={skill.security} />
      </div>
      <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 12px", lineHeight: 1.5 }}>{skill.desc}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {skill.permissions.map(p => <PermBadge key={p} perm={p} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#64748b" }}>
        <span>📦 {skill.installs.toLocaleString()} installs</span>
        <span>⭐ {skill.rating} ({skill.reviews})</span>
        <span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.05)", fontSize: 11 }}>{skill.source}</span>
      </div>
      {skill.security === "blocked" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(153,27,27,0.05) 10px, rgba(153,27,27,0.05) 20px)", pointerEvents: "none" }} />
      )}
    </div>
  );
}

function DeployCard({ opt }) {
  const levelStars = "⭐".repeat(opt.level);
  const secColor = opt.security === "매우 높음" ? "#22c55e" : opt.security === "높음" ? "#4ade80" : opt.security === "중" ? "#eab308" : "#f97316";
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>{opt.name}</span>
        <span style={{ fontSize: 12, color: "#8b5cf6" }}>{levelStars}</span>
      </div>
      <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 12px", lineHeight: 1.4 }}>{opt.desc}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", fontSize: 12 }}>
        <span style={{ color: "#64748b" }}>💰 비용: <span style={{ color: "#e2e8f0" }}>{opt.cost}</span></span>
        <span style={{ color: "#64748b" }}>⏱️ 셋업: <span style={{ color: "#e2e8f0" }}>{opt.setup}</span></span>
        <span style={{ color: "#64748b" }}>🔐 보안: <span style={{ color: secColor }}>{opt.security}</span></span>
        <span style={{ color: "#64748b" }}>📈 확장: <span style={{ color: "#e2e8f0" }}>{opt.scale}</span></span>
      </div>
      <div style={{ marginTop: 10, padding: "6px 10px", background: "rgba(139,92,246,0.08)", borderRadius: 8, fontSize: 12, color: "#a78bfa" }}>
        👤 Best for: {opt.best}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const layer = LAYERS[project.layer];
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = layer.color + "50"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{project.name}</span>
        <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 20, color: layer.color, background: layer.color + "18", border: `1px solid ${layer.color}30` }}>{layer.icon} {layer.label}</span>
      </div>
      <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 10px", lineHeight: 1.4 }}>{project.desc}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#64748b" }}>
        <span>{project.official ? "🏛️ 공식" : "🌱 커뮤니티"}</span>
        <StarCount count={project.stars} />
        <span style={{ color: project.status === "viral" ? "#f472b6" : project.status === "research" ? "#a78bfa" : "#4ade80", fontSize: 11, textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }}>{project.status}</span>
      </div>
    </div>
  );
}

function SubmitModal({ onClose }) {
  const [type, setType] = useState("skill");
  const [formData, setFormData] = useState({ name: "", url: "", desc: "", category: "", reason: "" });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#0f0f17", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, padding: "40px", maxWidth: 400, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🦞</div>
          <h3 style={{ color: "#e2e8f0", margin: "0 0 8px", fontFamily: "'Space Grotesk', sans-serif" }}>제출 완료!</h3>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 20px" }}>검토 후 ClawVerse에 등록됩니다. 감사합니다!</p>
          <button onClick={onClose} style={{ padding: "10px 32px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #8b5cf6, #6366f1)", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>닫기</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0f0f17", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 20, padding: "32px", maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ color: "#e2e8f0", margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 20 }}>🦞 프로젝트 제보 / 추가 요청</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: 22, cursor: "pointer", padding: "4px 8px" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { v: "skill", l: "⚡ 스킬 제보" },
            { v: "project", l: "📦 프로젝트 제보" },
            { v: "deploy", l: "🚀 배포 서비스 제보" },
            { v: "report", l: "🚨 보안 신고" },
          ].map(t => (
            <button key={t.v} onClick={() => setType(t.v)} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${type === t.v ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`, background: type === t.v ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)", color: type === t.v ? "#a78bfa" : "#94a3b8", fontSize: 12, cursor: "pointer", fontWeight: type === t.v ? 600 : 400, transition: "all 0.15s" }}>{t.l}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ fontSize: 13, color: "#94a3b8" }}>
            {type === "report" ? "대상 스킬/프로젝트 이름" : "이름"} *
            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={type === "report" ? "예: crypto-wallet-sync" : "예: my-awesome-skill"} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: 14, marginTop: 6, outline: "none", boxSizing: "border-box" }} />
          </label>

          <label style={{ fontSize: 13, color: "#94a3b8" }}>
            URL (GitHub / 웹사이트) {type !== "report" && "*"}
            <input value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="https://github.com/..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: 14, marginTop: 6, outline: "none", boxSizing: "border-box" }} />
          </label>

          <label style={{ fontSize: 13, color: "#94a3b8" }}>
            {type === "report" ? "신고 사유 *" : "설명"}
            <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} placeholder={type === "report" ? "어떤 보안 문제가 있나요? (API 키 탈취, 악성 코드 등)" : "간단한 설명을 작성해주세요"} rows={3} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: 14, marginTop: 6, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
          </label>

          {type !== "report" && (
            <label style={{ fontSize: 13, color: "#94a3b8" }}>
              카테고리
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "#0f0f17", color: "#e2e8f0", fontSize: 14, marginTop: 6, outline: "none" }}>
                <option value="">선택...</option>
                {type === "project" ? Object.entries(LAYERS).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>) : CATEGORIES.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </label>
          )}

          {type === "report" && (
            <label style={{ fontSize: 13, color: "#94a3b8" }}>
              심각도
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "#0f0f17", color: "#e2e8f0", fontSize: 14, marginTop: 6, outline: "none" }}>
                <option value="">선택...</option>
                <option value="low">🟡 낮음 — 의심스러운 동작</option>
                <option value="medium">🟠 보통 — 불필요한 권한 요구</option>
                <option value="high">🔴 높음 — API키/비밀번호 탈취 의심</option>
                <option value="critical">⛔ 심각 — 확인된 악성 코드</option>
              </select>
            </label>
          )}
        </div>

        <button onClick={() => setSubmitted(true)} style={{ width: "100%", marginTop: 20, padding: "12px", borderRadius: 12, border: "none", background: type === "report" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #8b5cf6, #6366f1)", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 15, transition: "opacity 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {type === "report" ? "🚨 보안 신고 제출" : "🦞 제보하기"}
        </button>
      </div>
    </div>
  );
}

function SkillDetailModal({ skill, onClose }) {
  if (!skill) return null;
  const sec = SECURITY_LEVELS[skill.security];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0f0f17", border: `1px solid ${sec.color}30`, borderRadius: 20, padding: "32px", maxWidth: 520, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <code style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>{skill.name}</code>
            <div style={{ marginTop: 8 }}><SecurityBadge level={skill.security} /></div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>{skill.desc}</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>인스톨 수</div>
            <div style={{ fontSize: 18, color: "#e2e8f0", fontWeight: 700 }}>{skill.installs.toLocaleString()}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>평점 / 리뷰</div>
            <div style={{ fontSize: 18, color: "#fbbf24", fontWeight: 700 }}>⭐ {skill.rating} <span style={{ fontSize: 13, color: "#94a3b8" }}>({skill.reviews})</span></div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>요구 권한</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{skill.permissions.map(p => <PermBadge key={p} perm={p} />)}</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>호환 플랫폼</div>
          <div style={{ display: "flex", gap: 6 }}>{skill.platform.map(p => <span key={p} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>{p}</span>)}</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>출처</div>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>{skill.source}</span>
        </div>

        {skill.security === "blocked" && (
          <div style={{ background: "rgba(153,27,27,0.15)", border: "1px solid rgba(153,27,27,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "#fca5a5" }}>⛔ 이 스킬은 악성 코드가 확인되어 차단되었습니다. 설치하지 마세요.</span>
          </div>
        )}
        {skill.security === "flagged" && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "#fca5a5" }}>🔴 커뮤니티 보안 경고가 접수된 스킬입니다. 주의하세요.</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ───
export default function ClawVerse() {
  const [page, setPage] = useState("skills");
  const [search, setSearch] = useState("");
  const [secFilter, setSecFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [deployFilter, setDeployFilter] = useState("all");
  const [projectLayer, setProjectLayer] = useState("all");

  const filteredSkills = SKILLS.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.desc.toLowerCase().includes(search.toLowerCase())) return false;
    if (secFilter !== "all" && s.security !== secFilter) return false;
    if (catFilter !== "all" && s.category !== catFilter) return false;
    return true;
  }).sort((a, b) => b.installs - a.installs);

  const filteredDeploy = DEPLOY_OPTIONS.filter(d => {
    if (deployFilter === "all") return true;
    return d.level === parseInt(deployFilter);
  });

  const filteredProjects = PROJECTS.filter(p => projectLayer === "all" || p.layer === projectLayer);

  const stats = {
    total: SKILLS.length,
    verified: SKILLS.filter(s => s.security === "verified").length,
    flagged: SKILLS.filter(s => s.security === "flagged" || s.security === "blocked").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090f", color: "#e2e8f0", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 3px; }
        input:focus, textarea:focus, select:focus { border-color: rgba(139,92,246,0.5) !important; }
      `}</style>

      {/* ─── Header ─── */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", position: "sticky", top: 0, background: "rgba(9,9,15,0.92)", backdropFilter: "blur(16px)", zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🦞</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, background: "linear-gradient(135deg, #c084fc, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ClawVerse</span>
            <span style={{ fontSize: 11, color: "#64748b", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", marginLeft: 4 }}>.io</span>
          </div>

          <nav style={{ display: "flex", gap: 4 }}>
            {[
              { id: "skills", label: "⚡ Skills", count: "5,705" },
              { id: "deploy", label: "🚀 Deploy" },
              { id: "projects", label: "📦 Projects", count: String(PROJECTS.length) },
              { id: "pulse", label: "📡 Pulse" },
            ].map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: page === n.id ? "rgba(139,92,246,0.15)" : "transparent", color: page === n.id ? "#a78bfa" : "#94a3b8", fontSize: 13, cursor: "pointer", fontWeight: page === n.id ? 600 : 400, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
                {n.label}
                {n.count && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 10, background: page === n.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.06)", color: page === n.id ? "#c084fc" : "#64748b" }}>{n.count}</span>}
              </button>
            ))}
          </nav>

          <button onClick={() => setShowSubmit(true)} style={{ padding: "7px 16px", borderRadius: 10, border: "1px solid rgba(249,115,22,0.4)", background: "rgba(249,115,22,0.1)", color: "#fb923c", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,115,22,0.1)"; }}
          >
            + 제보하기
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 80px" }}>

        {/* ═══ SKILLS HUB ═══ */}
        {page === "skills" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
                Skills Hub
              </h1>
              <p style={{ color: "#94a3b8", fontSize: 14 }}>ClawHub + GitHub + 커뮤니티 — 모든 소스의 스킬을 한곳에서. 보안 검증 포함.</p>
            </div>

            {/* Security Alert Banner */}
            <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>🛡️</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: "#fca5a5", fontWeight: 600 }}>보안 알림: </span>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>최근 400+ 악성 스킬이 ClawHub/GitHub에서 발견됨 (API 키, SSH 키, 크립토 지갑 탈취). ClawVerse 보안 등급을 확인하세요.</span>
              </div>
              <span style={{ fontSize: 12, color: "#64748b" }}>🟢 {stats.verified} verified · 🔴 {stats.flagged} flagged</span>
            </div>

            {/* Search + Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14 }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="스킬 검색... (이름, 설명)" style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#e2e8f0", fontSize: 14, outline: "none" }} />
              </div>
              <select value={secFilter} onChange={e => setSecFilter(e.target.value)} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "#09090f", color: "#e2e8f0", fontSize: 13, outline: "none", cursor: "pointer" }}>
                <option value="all">🛡️ 보안: 전체</option>
                <option value="verified">🟢 검증됨</option>
                <option value="reviewed">🟡 리뷰됨</option>
                <option value="unreviewed">🟠 미검토</option>
                <option value="flagged">🔴 경고</option>
                <option value="blocked">⛔ 차단</option>
              </select>
            </div>

            {/* Category Pills */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setCatFilter(c.id)} style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${catFilter === c.id ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`, background: catFilter === c.id ? "rgba(139,92,246,0.12)" : "transparent", color: catFilter === c.id ? "#a78bfa" : "#94a3b8", fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>{c.icon} {c.label}</button>
              ))}
            </div>

            {/* Results */}
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>{filteredSkills.length}개 스킬 표시</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340, 1fr))", gap: 14 }}>
              {filteredSkills.map(s => <SkillCard key={s.id} skill={s} onClick={() => setSelectedSkill(s)} />)}
            </div>

            {filteredSkills.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 14 }}>검색 결과가 없습니다</p>
                <button onClick={() => setShowSubmit(true)} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 10, border: "1px solid rgba(249,115,22,0.4)", background: "rgba(249,115,22,0.1)", color: "#fb923c", fontSize: 13, cursor: "pointer" }}>찾는 스킬 제보하기 →</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ DEPLOY HUB ═══ */}
        {page === "deploy" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Deploy Hub</h1>
              <p style={{ color: "#94a3b8", fontSize: 14 }}>10+ 배포 옵션을 중립적으로 비교. 나에게 맞는 방법을 찾아보세요.</p>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {[
                { v: "all", l: "전체" },
                { v: "1", l: "⭐ 초보 (원클릭)" },
                { v: "2", l: "⭐⭐ 중급" },
                { v: "3", l: "⭐⭐⭐ 숙련" },
                { v: "4", l: "⭐⭐⭐⭐ 전문가" },
              ].map(f => (
                <button key={f.v} onClick={() => setDeployFilter(f.v)} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${deployFilter === f.v ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`, background: deployFilter === f.v ? "rgba(139,92,246,0.12)" : "transparent", color: deployFilter === f.v ? "#a78bfa" : "#94a3b8", fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>{f.l}</button>
              ))}
            </div>

            {/* Quick Recommendation */}
            <div style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(249,115,22,0.05))", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 14, padding: "18px 22px", marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#c084fc", marginBottom: 8 }}>💡 빠른 추천</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, fontSize: 13 }}>
                <div><span style={{ color: "#64748b" }}>처음이라면?</span><br /><span style={{ color: "#e2e8f0", fontWeight: 600 }}>SimpleClaw</span> — 1분 배포</div>
                <div><span style={{ color: "#64748b" }}>프로덕션용?</span><br /><span style={{ color: "#e2e8f0", fontWeight: 600 }}>DigitalOcean</span> — 공식 파트너</div>
                <div><span style={{ color: "#64748b" }}>보안 최우선?</span><br /><span style={{ color: "#e2e8f0", fontWeight: 600 }}>NanoClaw</span> — 컨테이너 격리</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
              {filteredDeploy.map(d => <DeployCard key={d.name} opt={d} />)}
            </div>

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button onClick={() => setShowSubmit(true)} style={{ padding: "8px 20px", borderRadius: 10, border: "1px solid rgba(249,115,22,0.4)", background: "rgba(249,115,22,0.1)", color: "#fb923c", fontSize: 13, cursor: "pointer" }}>새 배포 서비스 제보하기 →</button>
            </div>
          </div>
        )}

        {/* ═══ PROJECTS ═══ */}
        {page === "projects" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Project Directory</h1>
              <p style={{ color: "#94a3b8", fontSize: 14 }}>OpenClaw 생태계 전체 지도. 코어부터 실험적 프로젝트까지.</p>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              <button onClick={() => setProjectLayer("all")} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${projectLayer === "all" ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`, background: projectLayer === "all" ? "rgba(139,92,246,0.12)" : "transparent", color: projectLayer === "all" ? "#a78bfa" : "#94a3b8", fontSize: 12, cursor: "pointer" }}>전체 ({PROJECTS.length})</button>
              {Object.entries(LAYERS).map(([k, v]) => {
                const cnt = PROJECTS.filter(p => p.layer === k).length;
                return (
                  <button key={k} onClick={() => setProjectLayer(k)} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${projectLayer === k ? v.color + "60" : "rgba(255,255,255,0.08)"}`, background: projectLayer === k ? v.color + "18" : "transparent", color: projectLayer === k ? v.color : "#94a3b8", fontSize: 12, cursor: "pointer" }}>{v.icon} {v.label} ({cnt})</button>
                );
              })}
            </div>

            {/* Ecosystem Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "GitHub Stars", value: "182K+", icon: "⭐" },
                { label: "ClawHub 스킬", value: "5,705", icon: "⚡" },
                { label: "Moltbook 에이전트", value: "37K+", icon: "🤖" },
                { label: "배포 옵션", value: "10+", icon: "🚀" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#e2e8f0" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
              {filteredProjects.map(p => <ProjectCard key={p.name} project={p} />)}
            </div>

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button onClick={() => setShowSubmit(true)} style={{ padding: "8px 20px", borderRadius: 10, border: "1px solid rgba(249,115,22,0.4)", background: "rgba(249,115,22,0.1)", color: "#fb923c", fontSize: 13, cursor: "pointer" }}>새 프로젝트 제보하기 →</button>
            </div>
          </div>
        )}

        {/* ═══ PULSE ═══ */}
        {page === "pulse" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Pulse</h1>
              <p style={{ color: "#94a3b8", fontSize: 14 }}>OpenClaw 생태계 뉴스, 트렌드, 보안 속보.</p>
            </div>

            {/* Security Alert */}
            <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 14, padding: "18px 22px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ padding: "3px 10px", borderRadius: 6, background: "rgba(239,68,68,0.15)", color: "#ef4444", fontSize: 11, fontWeight: 700 }}>🚨 SECURITY</span>
                <span style={{ fontSize: 12, color: "#64748b" }}>2026.02.07</span>
              </div>
              <h3 style={{ fontSize: 15, color: "#fca5a5", marginBottom: 6 }}>400+ 악성 스킬 ClawHub/GitHub에서 발견</h3>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>API 키, SSH 자격증명, 브라우저 비밀번호, 크립토 지갑 탈취 목적의 스킬들이 유용한 도구로 위장. VirusTotal 파트너십 통한 스캐닝 시작됨.</p>
            </div>

            {/* News Items */}
            {[
              { tag: "RELEASE", color: "#8b5cf6", date: "2026.02.09", title: "OpenClaw 2026.2.3 릴리즈", desc: "보안 강화, 샌드박스 파일 핸들링, 프롬프트 보호, 워크플로 안정성 개선" },
              { tag: "EVENT", color: "#f97316", date: "2026.02.04", title: "ClawCon 2026 — SF에서 첫 커뮤니티 밋업 개최", desc: "프론티어 타워에서 OpenClaw 개발자 커뮤니티 첫 Show & Tell 행사" },
              { tag: "TRENDING", color: "#22c55e", date: "2026.02.02", title: "Moltbook 37K+ 에이전트 돌파", desc: "AI 에이전트 전용 소셜 네트워크가 바이럴. 에이전트끼리 암호화 채널 논의 중" },
              { tag: "NEW", color: "#38bdf8", date: "2026.02.01", title: "Cloudflare Moltworker 공식 출시", desc: "Cloudflare Workers에서 OpenClaw 실행. 에지 보안 + 브라우저 자동화 지원" },
              { tag: "PARTNER", color: "#fbbf24", date: "2026.01.30", title: "DigitalOcean 1-Click Deploy 공식 파트너십", desc: "$12/월부터 보안 강화 이미지로 프로덕션 배포" },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 22px", marginBottom: 12, transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = item.color + "40"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ padding: "3px 10px", borderRadius: 6, background: item.color + "18", color: item.color, fontSize: 11, fontWeight: 700 }}>{item.tag}</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{item.date}</span>
                </div>
                <h3 style={{ fontSize: 15, color: "#e2e8f0", marginBottom: 4 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px", textAlign: "center" }}>
        <span style={{ fontSize: 12, color: "#475569" }}>🦞 ClawVerse.io — Every Claw. One Universe. · Built for the OpenClaw ecosystem</span>
      </footer>

      {/* Modals */}
      {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} />}
      {selectedSkill && <SkillDetailModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />}
    </div>
  );
}
