export interface DeployOption {
  id: number;
  slug: string;
  name: string;
  desc: string;
  level: number;
  cost: string;
  setup: string;
  security: string;
  scalability: string;
  bestFor: string;
  url: string;
}

export const DEPLOY_OPTIONS: DeployOption[] = [
  { id: 1, slug: "simpleclaw", name: "SimpleClaw", desc: "Easiest one-click deploy. Ideal for non-developers.", level: 1, cost: "Paid", setup: "1 min", security: "Medium", scalability: "Low", bestFor: "Complete beginners", url: "simpleclaw.com" },
  { id: 2, slug: "easyclaw", name: "EasyClaw", desc: "One-click + multi-channel dashboard.", level: 1, cost: "Paid", setup: "1 min", security: "Medium", scalability: "Medium", bestFor: "Beginners + multi-channel", url: "simpleclaw.org" },
  { id: 3, slug: "clawnest", name: "ClawNest", desc: "Managed hosting. Sweden servers. Backup/GUI included.", level: 1, cost: "Paid", setup: "5 min", security: "High", scalability: "Medium", bestFor: "Security-conscious beginners", url: "clawnest.ai" },
  { id: 4, slug: "clawstack", name: "ClawStack", desc: "WhatsApp/Telegram/WebChat integrated deploy.", level: 2, cost: "Paid", setup: "Minutes", security: "Medium", scalability: "Medium", bestFor: "Quick multi-platform start", url: "clawstack.app" },
  { id: 5, slug: "digitalocean", name: "DigitalOcean", desc: "Official partner. Security-enhanced 1-Click image.", level: 2, cost: "$12/mo+", setup: "10 min", security: "High", scalability: "High", bestFor: "Production", url: "digitalocean.com" },
  { id: 6, slug: "kuberns", name: "Kuberns", desc: "GitHub-linked one-click. Auto-restart/health checks.", level: 2, cost: "Paid", setup: "Minutes", security: "Medium", scalability: "High", bestFor: "Developer-friendly", url: "kuberns.com" },
  { id: 7, slug: "moltworker", name: "Moltworker", desc: "Cloudflare Workers. Edge security + browser automation.", level: 3, cost: "$5/mo+", setup: "30 min", security: "High", scalability: "High", bestFor: "Cloudflare users", url: "github.com/cloudflare/moltworker" },
  { id: 8, slug: "nanoclaw", name: "NanoClaw", desc: "Lightweight security-focused. Apple/Docker container isolation.", level: 3, cost: "Free", setup: "30 min", security: "Very High", scalability: "Low", bestFor: "Maximum security", url: "github.com/qwibitai/nanoclaw" },
  { id: 9, slug: "docker", name: "Docker", desc: "Build your own Docker container setup.", level: 4, cost: "Free+", setup: "1hr+", security: "Varies", scalability: "High", bestFor: "Full customization", url: "docker.com" },
  { id: 10, slug: "local-install", name: "Local Install", desc: "Direct Mac/Linux/Windows(WSL) installation.", level: 4, cost: "Free", setup: "1-3hr", security: "Low", scalability: "N/A", bestFor: "Full control", url: "openclaw.ai" },
];
