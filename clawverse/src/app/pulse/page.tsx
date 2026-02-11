import { PULSE_ITEMS, PULSE_TAG_CONFIG } from "@/data/pulse";

export default function PulsePage() {
  return (
    <div>
      <div className="mb-7">
        <h1
          className="mb-1.5 text-[28px] font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Pulse
        </h1>
        <p className="text-sm text-text-secondary">
          OpenClaw ecosystem news, trends, and security alerts.
        </p>
      </div>

      {/* Security Alert (highlighted) */}
      {PULSE_ITEMS.filter((item) => item.tag === "security").map((item) => {
        const tagConfig = PULSE_TAG_CONFIG[item.tag];
        return (
          <div
            key={item.id}
            className="mb-4 rounded-[14px] border border-sec-red/15 bg-sec-red/[0.06] px-5 py-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="rounded-md px-2.5 py-0.5 text-[11px] font-bold"
                style={{
                  background: tagConfig.color + "18",
                  color: tagConfig.color,
                }}
              >
                {tagConfig.label}
              </span>
              <span className="text-xs text-text-muted">{item.date}</span>
            </div>
            <h3 className="mb-1 text-[15px] font-semibold text-[#fca5a5]">
              {item.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-text-secondary">
              {item.desc}
            </p>
          </div>
        );
      })}

      {/* Other News Items */}
      {PULSE_ITEMS.filter((item) => item.tag !== "security").map((item) => {
        const tagConfig = PULSE_TAG_CONFIG[item.tag];
        return (
          <div
            key={item.id}
            className="mb-3 rounded-[14px] border border-border bg-card px-5 py-4 transition-colors duration-200 hover:border-white/10"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="rounded-md px-2.5 py-0.5 text-[11px] font-bold"
                style={{
                  background: tagConfig.color + "18",
                  color: tagConfig.color,
                }}
              >
                {tagConfig.label}
              </span>
              <span className="text-xs text-text-muted">{item.date}</span>
            </div>
            <h3 className="mb-1 text-[15px] text-text-primary">
              {item.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-text-secondary">
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
