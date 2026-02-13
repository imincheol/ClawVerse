// OWASP MCP Top 10 (2025) — mapped to ClawVerse security system
// Reference: https://owasp.org/www-project-mcp-top-10/

export interface OwaspCategory {
  id: string;
  rank: number;
  title: string;
  desc: string;
  risk: "critical" | "high" | "medium";
  relatedPermissions: string[];
  mitigations: string[];
}

export const OWASP_MCP_TOP10: OwaspCategory[] = [
  {
    id: "mcp01",
    rank: 1,
    title: "Tool Poisoning",
    desc: "Malicious tools hide harmful instructions in descriptions invisible to users but read by LLMs, enabling data exfiltration and unauthorized actions.",
    risk: "critical",
    relatedPermissions: ["shell", "network", "file"],
    mitigations: [
      "Review tool descriptions for hidden instructions",
      "Use tools with Verified security rating only",
      "Monitor outbound network calls from agents",
    ],
  },
  {
    id: "mcp02",
    rank: 2,
    title: "Rug Pull",
    desc: "Initially safe tools are updated to include malicious functionality after gaining user trust and installs.",
    risk: "critical",
    relatedPermissions: ["shell", "network", "file"],
    mitigations: [
      "Pin tool versions and review updates before upgrading",
      "Check ClawVerse health indicators for suspicious changes",
      "Enable VirusTotal continuous monitoring",
    ],
  },
  {
    id: "mcp03",
    rank: 3,
    title: "Transitive Access Abuse",
    desc: "A compromised tool leverages permissions granted to other trusted tools in the same agent session.",
    risk: "critical",
    relatedPermissions: ["shell", "file", "api-key"],
    mitigations: [
      "Apply principle of least privilege per tool",
      "Isolate high-risk tools in separate sessions",
      "Audit permission chains across tool stacks",
    ],
  },
  {
    id: "mcp04",
    rank: 4,
    title: "Tool Argument Injection",
    desc: "Attackers manipulate tool inputs through crafted prompts, causing tools to execute unintended operations.",
    risk: "high",
    relatedPermissions: ["shell", "file"],
    mitigations: [
      "Validate and sanitize all tool arguments",
      "Use parameterized queries for database tools",
      "Limit shell command scope",
    ],
  },
  {
    id: "mcp05",
    rank: 5,
    title: "Privilege Escalation via Tool Chaining",
    desc: "Attackers chain multiple low-privilege tools together to achieve actions that no single tool should allow.",
    risk: "high",
    relatedPermissions: ["shell", "network", "file"],
    mitigations: [
      "Monitor cross-tool action sequences",
      "Set rate limits on sensitive operations",
      "Review tool combinations in your stack",
    ],
  },
  {
    id: "mcp06",
    rank: 6,
    title: "Excessive Permission Scope",
    desc: "Tools request more permissions than necessary for their stated functionality, expanding the attack surface.",
    risk: "high",
    relatedPermissions: ["shell", "file", "network", "api-key"],
    mitigations: [
      "Compare permissions to functionality (use ClawVerse risk indicators)",
      "Prefer tools with minimal permission sets",
      "Reject tools requesting shell + network + file together",
    ],
  },
  {
    id: "mcp07",
    rank: 7,
    title: "Insecure Credential Storage",
    desc: "API keys and tokens stored in plaintext config files or environment variables accessible to all tools.",
    risk: "high",
    relatedPermissions: ["api-key", "file"],
    mitigations: [
      "Use encrypted credential stores",
      "Rotate API keys regularly",
      "Limit file system access for tools requiring API keys",
    ],
  },
  {
    id: "mcp08",
    rank: 8,
    title: "Insufficient Sandboxing",
    desc: "Tools execute with host-level access instead of being isolated in containers or sandboxed environments.",
    risk: "medium",
    relatedPermissions: ["shell", "file"],
    mitigations: [
      "Run tools in containerized environments",
      "Use NanoClaw or Docker-based deploy options",
      "Enable filesystem access controls",
    ],
  },
  {
    id: "mcp09",
    rank: 9,
    title: "Lack of Tool Integrity Verification",
    desc: "No cryptographic verification that a tool has not been tampered with between installation and execution.",
    risk: "medium",
    relatedPermissions: ["network"],
    mitigations: [
      "Use tools from Verified sources on ClawVerse",
      "Check VirusTotal scan status before installing",
      "Verify tool checksums when available",
    ],
  },
  {
    id: "mcp10",
    rank: 10,
    title: "Logging and Monitoring Gaps",
    desc: "Insufficient logging of tool actions makes it impossible to detect or investigate security incidents.",
    risk: "medium",
    relatedPermissions: ["shell", "network"],
    mitigations: [
      "Enable agent activity logging",
      "Monitor for unusual outbound connections",
      "Set up alerts for sensitive file access",
    ],
  },
];

export const OWASP_RISK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  high: { label: "High", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  medium: { label: "Medium", color: "#eab308", bg: "rgba(234,179,8,0.1)" },
};

// Permission risk descriptions — used by PermissionTooltip
export const PERMISSION_RISK_INFO: Record<string, {
  label: string;
  risk: "critical" | "high" | "medium" | "low";
  desc: string;
  examples: string[];
  owaspRefs: string[];
}> = {
  shell: {
    label: "Shell Access",
    risk: "critical",
    desc: "Can execute arbitrary system commands on your machine. A compromised tool with shell access can install malware, modify system files, or exfiltrate data.",
    examples: [
      "Execute system commands (rm, curl, wget)",
      "Install or remove software",
      "Access other processes and services",
    ],
    owaspRefs: ["mcp01", "mcp04", "mcp08"],
  },
  file: {
    label: "File System",
    risk: "high",
    desc: "Can read and write files on your system. Malicious tools can steal SSH keys, credentials, browser data, or modify configuration files.",
    examples: [
      "Read ~/.ssh/*, ~/.aws/credentials",
      "Access browser cookies and passwords",
      "Modify config files or inject code",
    ],
    owaspRefs: ["mcp03", "mcp07"],
  },
  network: {
    label: "Network Access",
    risk: "high",
    desc: "Can make outbound network requests. A compromised tool can exfiltrate stolen data, download additional payloads, or communicate with command-and-control servers.",
    examples: [
      "Send data to external servers",
      "Download malicious payloads",
      "Establish reverse shells",
    ],
    owaspRefs: ["mcp01", "mcp05", "mcp09"],
  },
  "api-key": {
    label: "API Key Access",
    risk: "medium",
    desc: "Requires API keys or tokens to function. If the tool is compromised, your API keys could be exfiltrated and used for unauthorized access or billing abuse.",
    examples: [
      "Access your API quotas and billing",
      "Impersonate your identity to services",
      "Leak keys to third parties",
    ],
    owaspRefs: ["mcp07"],
  },
};

export const PERMISSION_RISK_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

// Aggregate threat stats for the security intelligence center
export const THREAT_STATS = {
  totalMaliciousDiscovered: 400,
  mcpExploitProbability: 92,
  mcpVulnerabilityRate: 7.2,
  toolPoisoningRate: 5.5,
  enterpriseWithAdvancedSecurity: 6,
  criticalCveCount: 12,
  lastUpdated: "2026-02-13",
};
