import { Router } from "express";
import { verifySupabaseJWT } from "../middleware/auth.js";
import { anonClient } from "../lib/supabase.js";

const router = Router();
router.use(verifySupabaseJWT);

const VALID_DIRECTIONS = new Set(["above", "below"]);

// ─────────────────────────────────────────────────────────────
// GET /api/alerts
// Returns all price alerts for the authenticated user.
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const { data, error } = await anonClient
    .from("price_alerts")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ alerts: data });
});

// ─────────────────────────────────────────────────────────────
// POST /api/alerts
// Create a new price alert.
// Body: { coin_id, coin_symbol, target_price, direction }
// direction: "above" | "below"
// ─────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { coin_id, coin_symbol, target_price, direction } = req.body;

  if (!coin_id || !coin_symbol || target_price == null || !direction) {
    return res.status(400).json({
      error: "coin_id, coin_symbol, target_price, and direction are required",
    });
  }
  if (!VALID_DIRECTIONS.has(direction)) {
    return res.status(400).json({ error: "direction must be 'above' or 'below'" });
  }
  if (Number(target_price) <= 0) {
    return res.status(400).json({ error: "target_price must be greater than 0" });
  }

  const { data, error } = await anonClient
    .from("price_alerts")
    .insert({
      user_id: req.user.id,
      coin_id: coin_id.toLowerCase(),
      coin_symbol: coin_symbol.toUpperCase(),
      target_price: Number(target_price),
      direction,
      triggered: false,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/alerts/:id
// Delete a price alert by its UUID.
// ─────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  const { error, count } = await anonClient
    .from("price_alerts")
    .delete({ count: "exact" })
    .eq("id", req.params.id)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: "Alert not found" });
  res.json({ success: true });
});

export default router;
