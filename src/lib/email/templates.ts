const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawverse.io";

function layout(content: string, unsubscribeUrl?: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090f;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090f;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#111118;border-radius:12px;border:1px solid rgba(255,255,255,0.07);">
  <tr><td style="padding:32px 32px 16px;">
    <a href="${SITE_URL}" style="text-decoration:none;font-size:24px;font-weight:700;color:#8b5cf6;">ClawVerse</a>
    <span style="color:#64748b;font-size:14px;margin-left:8px;">Every Claw. One Universe.</span>
  </td></tr>
  <tr><td style="padding:0 32px 32px;">
    ${content}
  </td></tr>
  <tr><td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);">
    <p style="color:#64748b;font-size:12px;margin:0;">
      &copy; ${new Date().getFullYear()} ClawVerse.io
      ${unsubscribeUrl ? ` &middot; <a href="${unsubscribeUrl}" style="color:#64748b;">Unsubscribe</a>` : ""}
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// --- Submission emails ---

export function submissionConfirmation(name: string, type: string): { subject: string; html: string } {
  const typeLabel = type === "security_report" ? "Security Report" : type.charAt(0).toUpperCase() + type.slice(1);
  return {
    subject: `[ClawVerse] Your ${typeLabel} submission received`,
    html: layout(`
      <h2 style="color:#e2e8f0;font-size:20px;margin:0 0 16px;">Submission Received</h2>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Thank you for submitting <strong style="color:#e2e8f0;">${name}</strong> as a ${typeLabel}.
      </p>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Our team will review your submission shortly. You'll receive an email once it's been reviewed.
      </p>
      <a href="${SITE_URL}/submit" style="display:inline-block;background:#8b5cf6;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View Submissions</a>
    `),
  };
}

export function submissionApproved(name: string, type: string): { subject: string; html: string } {
  const typeLabel = type === "security_report" ? "Security Report" : type.charAt(0).toUpperCase() + type.slice(1);
  const viewUrl = type === "skill" ? `${SITE_URL}/skills` : type === "project" ? `${SITE_URL}/projects` : type === "deploy" ? `${SITE_URL}/deploy` : `${SITE_URL}/pulse/security`;
  return {
    subject: `[ClawVerse] Your ${typeLabel} "${name}" has been approved`,
    html: layout(`
      <h2 style="color:#e2e8f0;font-size:20px;margin:0 0 16px;">Submission Approved</h2>
      <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:8px;padding:16px;margin-bottom:16px;">
        <p style="color:#22c55e;font-size:15px;margin:0;">Your ${typeLabel} <strong>"${name}"</strong> has been approved and is now live on ClawVerse.</p>
      </div>
      <a href="${viewUrl}" style="display:inline-block;background:#8b5cf6;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View on ClawVerse</a>
    `),
  };
}

export function submissionRejected(name: string, type: string, reason?: string): { subject: string; html: string } {
  const typeLabel = type === "security_report" ? "Security Report" : type.charAt(0).toUpperCase() + type.slice(1);
  return {
    subject: `[ClawVerse] Update on your ${typeLabel} "${name}"`,
    html: layout(`
      <h2 style="color:#e2e8f0;font-size:20px;margin:0 0 16px;">Submission Update</h2>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 16px;">
        After review, your ${typeLabel} <strong style="color:#e2e8f0;">"${name}"</strong> was not approved at this time.
      </p>
      ${reason ? `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:16px;margin-bottom:16px;"><p style="color:#94a3b8;font-size:14px;margin:0;"><strong style="color:#e2e8f0;">Reason:</strong> ${reason}</p></div>` : ""}
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Feel free to resubmit with updated information.
      </p>
      <a href="${SITE_URL}/submit" style="display:inline-block;background:#8b5cf6;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Submit Again</a>
    `),
  };
}

// --- Security alert ---

export function securityAlert(skillName: string, severity: string, description: string): { subject: string; html: string } {
  const severityColors: Record<string, string> = {
    critical: "#991b1b",
    high: "#ef4444",
    medium: "#f97316",
    low: "#eab308",
  };
  const color = severityColors[severity.toLowerCase()] || "#f97316";

  return {
    subject: `[ClawVerse Security] ${severity.toUpperCase()} alert: ${skillName}`,
    html: layout(`
      <h2 style="color:#ef4444;font-size:20px;margin:0 0 16px;">Security Alert</h2>
      <div style="background:rgba(239,68,68,0.1);border:1px solid ${color};border-radius:8px;padding:16px;margin-bottom:16px;">
        <p style="color:#e2e8f0;font-size:15px;margin:0 0 8px;">
          <span style="background:${color};color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700;">${severity.toUpperCase()}</span>
          &nbsp; ${skillName}
        </p>
        <p style="color:#94a3b8;font-size:14px;margin:0;">${description}</p>
      </div>
      <a href="${SITE_URL}/pulse/security" style="display:inline-block;background:#ef4444;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Review in Admin</a>
    `),
  };
}

// --- Weekly newsletter ---

interface NewsletterPick {
  name: string;
  description: string;
  url?: string;
}

interface NewsletterAlert {
  title: string;
  severity: string;
}

export function weeklyNewsletter(
  picks: NewsletterPick[],
  alerts: NewsletterAlert[],
  newSkills: NewsletterPick[],
  unsubscribeUrl: string
): { subject: string; html: string } {
  const picksHtml = picks.length
    ? picks
        .map(
          (p) => `<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
          <p style="color:#e2e8f0;font-size:15px;font-weight:600;margin:0;">${p.url ? `<a href="${p.url}" style="color:#a78bfa;text-decoration:none;">${p.name}</a>` : p.name}</p>
          <p style="color:#94a3b8;font-size:13px;margin:4px 0 0;">${p.description}</p>
        </td></tr>`
        )
        .join("")
    : '<tr><td style="padding:8px 0;color:#64748b;font-size:14px;">No picks this week.</td></tr>';

  const alertsHtml = alerts.length
    ? alerts
        .map(
          (a) => `<li style="color:#94a3b8;font-size:14px;margin-bottom:4px;">
          <span style="color:#ef4444;font-weight:600;">[${a.severity.toUpperCase()}]</span> ${a.title}
        </li>`
        )
        .join("")
    : '<li style="color:#64748b;font-size:14px;">No security alerts this week.</li>';

  const skillsHtml = newSkills.length
    ? newSkills
        .map(
          (s) =>
            `<li style="color:#94a3b8;font-size:14px;margin-bottom:4px;"><strong style="color:#e2e8f0;">${s.name}</strong> &mdash; ${s.description}</li>`
        )
        .join("")
    : '<li style="color:#64748b;font-size:14px;">No new skills this week.</li>';

  return {
    subject: `[ClawVerse Weekly] Top Picks, ${alerts.length} Alert${alerts.length !== 1 ? "s" : ""}, ${newSkills.length} New Skill${newSkills.length !== 1 ? "s" : ""}`,
    html: layout(
      `
      <h2 style="color:#e2e8f0;font-size:20px;margin:0 0 24px;">Weekly Digest</h2>

      <h3 style="color:#a78bfa;font-size:16px;margin:0 0 12px;">Weekly Picks</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${picksHtml}</table>

      <h3 style="color:#ef4444;font-size:16px;margin:0 0 12px;">Security Alerts</h3>
      <ul style="padding-left:20px;margin:0 0 24px;">${alertsHtml}</ul>

      <h3 style="color:#38bdf8;font-size:16px;margin:0 0 12px;">New Skills</h3>
      <ul style="padding-left:20px;margin:0 0 24px;">${skillsHtml}</ul>

      <a href="${SITE_URL}/pulse" style="display:inline-block;background:#8b5cf6;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View All on ClawVerse</a>
    `,
      unsubscribeUrl
    ),
  };
}
