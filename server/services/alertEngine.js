import cron from "node-cron";
import { adminClient } from "../lib/supabase.js";
import { getSimplePrices } from "./coinGecko.js";
import { sendAlertEmail } from "./mailer.js";

let isRunning = false;

async function checkAlerts() {
  // Guard against overlapping runs if CoinGecko is slow
  if (isRunning) return;
  isRunning = true;

  try {
    if (!adminClient) {
      console.warn("[AlertEngine] SUPABASE_SERVICE_ROLE_KEY not set — alert engine inactive");
      return;
    }

    // 1. Fetch all pending (non-triggered) alerts
    const { data: alerts, error } = await adminClient
      .from("price_alerts")
      .select("id, user_id, coin_id, coin_symbol, target_price, direction")
      .eq("triggered", false);

    if (error) {
      console.error("[AlertEngine] DB query failed:", error.message);
      return;
    }
    if (!alerts?.length) return;

    // 2. Deduplicate coin IDs and fetch spot prices in one request
    const uniqueCoins = [...new Set(alerts.map((a) => a.coin_id))];
    let prices;
    try {
      prices = await getSimplePrices(uniqueCoins, "usd");
    } catch (err) {
      console.error("[AlertEngine] CoinGecko fetch failed:", err.message);
      return;
    }

    // 3. Evaluate each alert
    const triggered = alerts.filter((alert) => {
      const coinPriceData = prices[alert.coin_id];
      if (!coinPriceData) return false;
      const currentPrice = coinPriceData.usd;
      return (
        (alert.direction === "above" && currentPrice >= Number(alert.target_price)) ||
        (alert.direction === "below" && currentPrice <= Number(alert.target_price))
      );
    });

    if (!triggered.length) return;

    console.log(`[AlertEngine] ${triggered.length} alert(s) triggered`);

    // 4. Process each triggered alert
    for (const alert of triggered) {
      const currentPrice = prices[alert.coin_id]?.usd;

      // Mark as triggered in DB
      const { error: updateErr } = await adminClient
        .from("price_alerts")
        .update({ triggered: true, triggered_at: new Date().toISOString() })
        .eq("id", alert.id);

      if (updateErr) {
        console.error(`[AlertEngine] Failed to update alert ${alert.id}:`, updateErr.message);
        continue;
      }

      // Look up the user's email via admin API
      try {
        const {
          data: { user },
          error: userErr,
        } = await adminClient.auth.admin.getUserById(alert.user_id);

        if (userErr || !user?.email) {
          console.warn(`[AlertEngine] Could not resolve email for user ${alert.user_id}`);
          continue;
        }

        await sendAlertEmail({
          to: user.email,
          coinId: alert.coin_id,
          coinSymbol: alert.coin_symbol || alert.coin_id,
          targetPrice: Number(alert.target_price),
          currentPrice,
          direction: alert.direction,
        });
      } catch (mailErr) {
        console.error(`[AlertEngine] Email failed for alert ${alert.id}:`, mailErr.message);
      }
    }
  } finally {
    isRunning = false;
  }
}

/**
 * Start the alert engine.
 * Runs checkAlerts() every minute (* * * * *).
 * Call once from index.js at startup.
 */
export function startAlertEngine() {
  // Run immediately on startup so we don't wait a full minute
  checkAlerts();

  cron.schedule("* * * * *", checkAlerts);
  console.log("[AlertEngine] Started — checking every 60 s");
}
