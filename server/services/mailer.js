import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("[Mailer] SMTP credentials not configured — alert emails disabled");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

/**
 * Send a price-alert notification email.
 *
 * @param {object} opts
 * @param {string} opts.to            Recipient email address
 * @param {string} opts.coinId        e.g. "bitcoin"
 * @param {string} opts.coinSymbol    e.g. "BTC"
 * @param {number} opts.targetPrice   The price set by the user
 * @param {number} opts.currentPrice  The price that triggered the alert
 * @param {"above"|"below"} opts.direction
 */
export async function sendAlertEmail({ to, coinId, coinSymbol, targetPrice, currentPrice, direction }) {
  const mail = getTransporter();
  if (!mail) return;

  const symbol   = (coinSymbol || coinId).toUpperCase();
  const dirLabel = direction === "above" ? "risen above" : "fallen below";
  const subject  = `[SaucamPro] ${symbol} has ${dirLabel} $${targetPrice.toLocaleString()}`;

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;padding:32px;background:#0A0B0D;color:#fff;border-radius:12px;border:1px solid #1E2330">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
        <div style="width:36px;height:36px;background:#0052FF;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;color:#fff">₿</div>
        <span style="font-size:18px;font-weight:700">SaucamPro</span>
      </div>

      <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Price Alert Triggered 🔔</h1>
      <p style="color:#8A919E;margin:0 0 24px;font-size:14px">Your alert for <strong style="color:#fff">${symbol}</strong> has been triggered.</p>

      <div style="background:#131722;border:1px solid #1E2330;border-radius:12px;padding:20px;margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="color:#8A919E;font-size:13px">Coin</span>
          <span style="font-weight:600">${symbol}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="color:#8A919E;font-size:13px">Your target</span>
          <span style="font-weight:600">$${Number(targetPrice).toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="color:#8A919E;font-size:13px">Direction</span>
          <span style="font-weight:600;color:${direction === "above" ? "#05B169" : "#F6465D"}">${direction === "above" ? "↑ Above" : "↓ Below"}</span>
        </div>
        <div style="border-top:1px solid #1E2330;padding-top:12px;margin-top:4px;display:flex;justify-content:space-between">
          <span style="color:#8A919E;font-size:13px">Current price</span>
          <span style="font-size:20px;font-weight:800;color:#0052FF">$${Number(currentPrice).toLocaleString()}</span>
        </div>
      </div>

      <p style="color:#8A919E;font-size:12px;margin:0">
        You're receiving this because you set a price alert on SaucamPro.
        Log in to manage your alerts.
      </p>
    </div>
  `;

  await mail.sendMail({
    from: process.env.EMAIL_FROM || `"SaucamPro" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`[Mailer] Alert email sent → ${to} (${symbol} ${direction} $${targetPrice})`);
}
