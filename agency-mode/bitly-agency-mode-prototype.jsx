import { useState, useEffect } from "react";

// --- Mock Data ---
const clients = [
  { id: "all", name: "All Clients", icon: "grid", color: "#EE6123" },
  { id: "acme", name: "Acme Corp", icon: "A", color: "#4C6EF5" },
  { id: "globex", name: "Globex Industries", icon: "G", color: "#12B886" },
  { id: "initech", name: "Initech", icon: "I", color: "#F59F00" },
  { id: "waystar", name: "Waystar Royco", icon: "W", color: "#E64980" },
];

const clientMetrics = {
  acme: { clicks: 48720, links: 312, qrScans: 8430, topChannel: "Email", weekTrend: +12.4, campaigns: 24 },
  globex: { clicks: 31200, links: 187, qrScans: 4210, topChannel: "Social", weekTrend: -3.1, campaigns: 16 },
  initech: { clicks: 22100, links: 95, qrScans: 2890, topChannel: "Paid Search", weekTrend: +8.7, campaigns: 11 },
  waystar: { clicks: 67400, links: 421, qrScans: 12100, topChannel: "Social", weekTrend: +22.1, campaigns: 38 },
};

const recentLinks = {
  acme: [
    { title: "acme_spring24_email_hero-cta", url: "bit.ly/acme-spring", clicks: 3420, created: "Mar 18" },
    { title: "acme_spring24_social_ig-story", url: "bit.ly/acme-ig", clicks: 1890, created: "Mar 17" },
    { title: "acme_q1report_email_download", url: "bit.ly/acme-q1", clicks: 2150, created: "Mar 15" },
  ],
  globex: [
    { title: "globex_rebrand_social_announcement", url: "bit.ly/glbx-new", clicks: 5100, created: "Mar 19" },
    { title: "globex_webinar_email_reg-link", url: "bit.ly/glbx-web", clicks: 1340, created: "Mar 16" },
  ],
  initech: [
    { title: "initech_hiring_linkedin_careers", url: "bit.ly/ini-jobs", clicks: 890, created: "Mar 20" },
    { title: "initech_product_email_launch", url: "bit.ly/ini-launch", clicks: 2670, created: "Mar 14" },
  ],
  waystar: [
    { title: "waystar_q1pr_social_tw-thread", url: "bit.ly/ws-q1pr", clicks: 8900, created: "Mar 20" },
    { title: "waystar_investor_email_deck", url: "bit.ly/ws-deck", clicks: 4200, created: "Mar 18" },
    { title: "waystar_event_social_rsvp", url: "bit.ly/ws-event", clicks: 6100, created: "Mar 17" },
  ],
};

const namingTemplates = [
  { id: 1, name: "Standard Campaign", pattern: "{client}_{campaign}_{channel}_{asset}", example: "acme_spring24_email_hero-cta", isDefault: true },
  { id: 2, name: "Social Media", pattern: "{client}_{campaign}_{platform}_{format}", example: "globex_rebrand_instagram_story", isDefault: false },
  { id: 3, name: "Event Tracking", pattern: "{client}_{event}_{type}_{variant}", example: "waystar_summit24_reg_earlybird", isDefault: false },
];

// --- Sparkline Component ---
const Sparkline = ({ data, color, width = 80, height = 28 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// --- Cross-Client Dashboard ---
const CrossClientDashboard = ({ onSelectClient }) => {
  const totalClicks = Object.values(clientMetrics).reduce((s, m) => s + m.clicks, 0);
  const totalLinks = Object.values(clientMetrics).reduce((s, m) => s + m.links, 0);
  const totalScans = Object.values(clientMetrics).reduce((s, m) => s + m.qrScans, 0);
  const totalCampaigns = Object.values(clientMetrics).reduce((s, m) => s + m.campaigns, 0);

  const sparkData = {
    acme: [3200, 3800, 4100, 3900, 4500, 5200, 4800],
    globex: [2800, 2600, 3100, 2900, 2700, 3000, 2800],
    initech: [1500, 1800, 2000, 1900, 2200, 2400, 2100],
    waystar: [5000, 5800, 6200, 7100, 7800, 8400, 9200],
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#091E42", margin: 0 }}>Agency Overview</h1>
        <p style={{ fontSize: 14, color: "#6B778C", margin: "4px 0 0" }}>Performance across all client workspaces — Last 30 days</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: "↗", color: "#EE6123" },
          { label: "Active Links", value: totalLinks.toLocaleString(), icon: "🔗", color: "#4C6EF5" },
          { label: "QR Scans", value: totalScans.toLocaleString(), icon: "⊞", color: "#12B886" },
          { label: "Campaigns", value: totalCampaigns.toLocaleString(), icon: "◎", color: "#F59F00" },
        ].map((card) => (
          <div key={card.label} style={{ background: "#fff", borderRadius: 10, padding: "20px 22px", border: "1px solid #EBECF0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#6B778C", fontWeight: 500 }}>{card.label}</span>
              <span style={{ fontSize: 18 }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#091E42" }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Client table */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #EBECF0", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #EBECF0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#091E42", margin: 0 }}>Client Performance</h2>
          <select style={{ fontSize: 13, padding: "6px 12px", borderRadius: 6, border: "1px solid #DFE1E6", color: "#6B778C", background: "#fff" }}>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FAFBFC" }}>
              {["Client", "Clicks", "Links", "QR Scans", "Top Channel", "7d Trend", ""].map((h) => (
                <th key={h} style={{ padding: "10px 22px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B778C", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.filter((c) => c.id !== "all").map((client) => {
              const m = clientMetrics[client.id];
              return (
                <tr key={client.id} style={{ borderTop: "1px solid #EBECF0", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F5F7")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => onSelectClient(client.id)}>
                  <td style={{ padding: "14px 22px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: client.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{client.icon}</div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#091E42" }}>{client.name}</span>
                  </td>
                  <td style={{ padding: "14px 22px", fontSize: 14, fontWeight: 600, color: "#091E42" }}>{m.clicks.toLocaleString()}</td>
                  <td style={{ padding: "14px 22px", fontSize: 14, color: "#42526E" }}>{m.links}</td>
                  <td style={{ padding: "14px 22px", fontSize: 14, color: "#42526E" }}>{m.qrScans.toLocaleString()}</td>
                  <td style={{ padding: "14px 22px", fontSize: 14, color: "#42526E" }}>{m.topChannel}</td>
                  <td style={{ padding: "14px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Sparkline data={sparkData[client.id]} color={m.weekTrend >= 0 ? "#12B886" : "#E64980"} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: m.weekTrend >= 0 ? "#12B886" : "#E64980" }}>
                        {m.weekTrend >= 0 ? "+" : ""}{m.weekTrend}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 22px" }}>
                    <span style={{ fontSize: 12, color: "#6B778C", padding: "4px 10px", borderRadius: 4, border: "1px solid #DFE1E6" }}>View →</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Single Client View ---
const ClientView = ({ clientId }) => {
  const client = clients.find((c) => c.id === clientId);
  const m = clientMetrics[clientId];
  const links = recentLinks[clientId] || [];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: client.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>{client.icon}</div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#091E42", margin: 0 }}>{client.name}</h1>
          <p style={{ fontSize: 13, color: "#6B778C", margin: "2px 0 0" }}>{m.campaigns} active campaigns · {m.links} links</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Clicks", value: m.clicks.toLocaleString(), trend: m.weekTrend },
          { label: "QR Code Scans", value: m.qrScans.toLocaleString(), trend: null },
          { label: "Top Channel", value: m.topChannel, trend: null },
        ].map((card) => (
          <div key={card.label} style={{ background: "#fff", borderRadius: 10, padding: "20px 22px", border: "1px solid #EBECF0" }}>
            <span style={{ fontSize: 13, color: "#6B778C", fontWeight: 500 }}>{card.label}</span>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#091E42", marginTop: 6 }}>{card.value}</div>
            {card.trend !== null && (
              <span style={{ fontSize: 13, fontWeight: 600, color: card.trend >= 0 ? "#12B886" : "#E64980" }}>
                {card.trend >= 0 ? "↑" : "↓"} {Math.abs(card.trend)}% vs last week
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Recent links */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #EBECF0", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #EBECF0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#091E42", margin: 0 }}>Recent Links</h2>
          <button style={{ fontSize: 13, padding: "7px 16px", borderRadius: 8, border: "none", background: "#EE6123", color: "#fff", fontWeight: 600, cursor: "pointer" }}>+ Create Link</button>
        </div>
        {links.map((link, i) => (
          <div key={i} style={{ padding: "14px 22px", borderTop: i > 0 ? "1px solid #EBECF0" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#091E42", fontFamily: "monospace" }}>{link.title}</div>
              <div style={{ fontSize: 12, color: "#EE6123", marginTop: 2 }}>{link.url}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#091E42" }}>{link.clicks.toLocaleString()} clicks</div>
              <div style={{ fontSize: 12, color: "#6B778C" }}>{link.created}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Naming Conventions View ---
const NamingConventions = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [previewValues, setPreviewValues] = useState({ client: "acme", campaign: "summer24", channel: "email", asset: "hero-cta" });
  const [showNewModal, setShowNewModal] = useState(false);

  const currentTemplate = namingTemplates.find((t) => t.id === selectedTemplate);
  const fields = currentTemplate.pattern.match(/\{(\w+)\}/g).map((f) => f.replace(/[{}]/g, ""));
  const preview = fields.map((f) => previewValues[f] || `{${f}}`).join("_");

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#091E42", margin: 0 }}>Naming Conventions</h1>
        <p style={{ fontSize: 14, color: "#6B778C", margin: "4px 0 0" }}>Standardize link naming across your agency with saved templates</p>
      </div>

      {/* Template cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {namingTemplates.map((t) => (
          <div key={t.id} onClick={() => setSelectedTemplate(t.id)}
            style={{
              background: selectedTemplate === t.id ? "#FFF4EE" : "#fff",
              borderRadius: 10,
              padding: "18px 20px",
              border: selectedTemplate === t.id ? "2px solid #EE6123" : "1px solid #EBECF0",
              cursor: "pointer",
              transition: "all 0.15s",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#091E42" }}>{t.name}</span>
              {t.isDefault && <span style={{ fontSize: 10, fontWeight: 700, color: "#EE6123", background: "#FFF4EE", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Default</span>}
            </div>
            <div style={{ fontSize: 12, fontFamily: "monospace", color: "#6B778C", background: "#F4F5F7", padding: "6px 10px", borderRadius: 6 }}>{t.pattern}</div>
            <div style={{ fontSize: 11, color: "#6B778C", marginTop: 8 }}>e.g. {t.example}</div>
          </div>
        ))}
      </div>

      {/* Live preview builder */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #EBECF0", padding: "22px", marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#091E42", margin: "0 0 18px" }}>Live Preview</h2>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${fields.length}, 1fr)`, gap: 12, marginBottom: 20 }}>
          {fields.map((field) => (
            <div key={field}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#6B778C", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>{field}</label>
              <input
                type="text"
                value={previewValues[field] || ""}
                onChange={(e) => setPreviewValues({ ...previewValues, [field]: e.target.value })}
                placeholder={field}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #DFE1E6", fontSize: 14, color: "#091E42", fontFamily: "monospace", boxSizing: "border-box", outline: "none" }}
                onFocus={(e) => (e.target.style.borderColor = "#EE6123")}
                onBlur={(e) => (e.target.style.borderColor = "#DFE1E6")}
              />
            </div>
          ))}
        </div>

        <div style={{ background: "#FAFBFC", borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6B778C", textTransform: "uppercase", letterSpacing: "0.5px" }}>Generated name</span>
            <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "monospace", color: "#091E42", marginTop: 4 }}>{preview}</div>
          </div>
          <button style={{ fontSize: 13, padding: "8px 20px", borderRadius: 8, border: "none", background: "#EE6123", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Use this name →</button>
        </div>
      </div>

      {/* Settings row */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #EBECF0", padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#091E42" }}>Auto-apply naming convention</div>
            <div style={{ fontSize: 13, color: "#6B778C", marginTop: 2 }}>Prompt team members to use the default template when creating new links</div>
          </div>
          <div onClick={() => {}} style={{
            width: 44, height: 24, borderRadius: 12, background: "#EE6123", cursor: "pointer", position: "relative", transition: "background 0.2s",
          }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 2, left: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.15)", transition: "left 0.2s" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Painted Door Modal ---
const PaintedDoorModal = ({ feature, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(9,30,66,0.54)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
    <div style={{ background: "#fff", borderRadius: 14, padding: "36px 40px", maxWidth: 420, width: "100%", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: "#FFF4EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 28 }}>🧪</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#091E42", margin: "0 0 8px" }}>You found something new!</h2>
      <p style={{ fontSize: 14, color: "#6B778C", lineHeight: 1.6, margin: "0 0 24px" }}>
        <strong>{feature}</strong> is a concept we're exploring for agencies. This feature isn't available yet, but your interest helps us prioritize what to build next.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #DFE1E6", background: "#fff", fontSize: 14, fontWeight: 600, color: "#42526E", cursor: "pointer" }}>Maybe later</button>
        <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#EE6123", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>I'm interested!</button>
      </div>
    </div>
  </div>
);

// --- Main App ---
export default function BitlyAgencyMode() {
  const [activeClient, setActiveClient] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [paintedDoor, setPaintedDoor] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSelectClient = (id) => {
    setActiveClient(id);
    setActiveTab("dashboard");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "links", label: "Links", icon: "🔗" },
    { id: "naming", label: "Naming Conventions", icon: "✎", isNew: true },
    { id: "qr", label: "QR Codes", icon: "⊞" },
    { id: "campaigns", label: "Campaigns", icon: "◎" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: "#F4F5F7" }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: "#091E42", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "20px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#EE6123" />
              <path d="M7 12h10M12 7v10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>Bitly</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#EE6123", background: "rgba(238,97,35,0.15)", padding: "2px 8px", borderRadius: 4, marginLeft: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Agency</span>
          </div>
        </div>

        {/* Client Switcher */}
        <div style={{ padding: "16px 14px 8px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", padding: "0 8px", marginBottom: 10 }}>Workspaces</div>
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => handleSelectClient(client.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 2,
                background: activeClient === client.id ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (activeClient !== client.id) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { if (activeClient !== client.id) e.currentTarget.style.background = "transparent"; }}
            >
              {client.id === "all" ? (
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(238,97,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14 }}>⊞</span>
                </div>
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: 7, background: client.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{client.icon}</div>
              )}
              <span style={{ fontSize: 13, fontWeight: activeClient === client.id ? 600 : 400, color: activeClient === client.id ? "#fff" : "rgba(255,255,255,0.7)" }}>{client.name}</span>
              {client.id !== "all" && (
                <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{clientMetrics[client.id].links}</span>
              )}
            </div>
          ))}
          <div
            onClick={() => setPaintedDoor("Add Client Workspace")}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "pointer", marginTop: 4, border: "1px dashed rgba(255,255,255,0.15)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
          >
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>+ Add client workspace</span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", padding: "0 8px", marginBottom: 10 }}>Navigate</div>
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.id === "qr" || item.id === "campaigns") {
                  setPaintedDoor(item.label);
                } else {
                  setActiveTab(item.id);
                }
              }}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 2,
                background: activeTab === item.id ? "rgba(238,97,35,0.15)" : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (activeTab !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { if (activeTab !== item.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: activeTab === item.id ? 600 : 400, color: activeTab === item.id ? "#EE6123" : "rgba(255,255,255,0.7)" }}>{item.label}</span>
              {item.isNew && <span style={{ fontSize: 9, fontWeight: 700, color: "#12B886", background: "rgba(18,184,134,0.15)", padding: "1px 6px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.5px", marginLeft: "auto" }}>New</span>}
            </div>
          ))}
        </div>

        {/* Bottom user */}
        <div style={{ marginTop: "auto", padding: "16px 22px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#4C6EF5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>BK</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Ben K.</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Agency Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 36px" }}>
        {/* Breadcrumb / context bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B778C" }}>
            <span>Agency</span>
            <span style={{ color: "#DFE1E6" }}>/</span>
            <span style={{ color: "#091E42", fontWeight: 600 }}>{activeClient === "all" ? "All Clients" : clients.find((c) => c.id === activeClient)?.name}</span>
            {activeTab !== "dashboard" && (
              <>
                <span style={{ color: "#DFE1E6" }}>/</span>
                <span style={{ color: "#091E42", fontWeight: 600 }}>{navItems.find((n) => n.id === activeTab)?.label}</span>
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setPaintedDoor("Export Report")}
              style={{ fontSize: 13, padding: "8px 16px", borderRadius: 8, border: "1px solid #DFE1E6", background: "#fff", fontWeight: 500, color: "#42526E", cursor: "pointer" }}>
              Export Report
            </button>
            <button style={{ fontSize: 13, padding: "8px 16px", borderRadius: 8, border: "none", background: "#EE6123", fontWeight: 600, color: "#fff", cursor: "pointer" }}>
              + Create Link
            </button>
          </div>
        </div>

        {/* View Router */}
        {activeTab === "naming" ? (
          <NamingConventions />
        ) : activeTab === "links" && activeClient !== "all" ? (
          <ClientView clientId={activeClient} />
        ) : activeTab === "dashboard" && activeClient !== "all" ? (
          <ClientView clientId={activeClient} />
        ) : (
          <CrossClientDashboard onSelectClient={handleSelectClient} />
        )}
      </div>

      {/* Painted Door Modal */}
      {paintedDoor && <PaintedDoorModal feature={paintedDoor} onClose={() => setPaintedDoor(null)} />}
    </div>
  );
}
