import { Router } from "express";
import { verifySupabaseJWT } from "../middleware/auth.js";
import { anonClient } from "../lib/supabase.js";

const router = Router();
router.use(verifySupabaseJWT);

// ─────────────────────────────────────────────────────────────
// GET /api/watchlist
// Returns the authenticated user's watchlist.
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const { data, error } = await anonClient
    .from("watchlists")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ watchlist: data });
});

// ─────────────────────────────────────────────────────────────
// POST /api/watchlist
// Add a coin to the watchlist.
// Body: { coin_id, coin_symbol }
// ─────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { coin_id, coin_symbol } = req.body;

  if (!coin_id || !coin_symbol) {
    return res.status(400).json({ error: "coin_id and coin_symbol are required" });
  }

  const { data, error } = await anonClient
    .from("watchlists")
    .insert({
      user_id: req.user.id,
      coin_id: coin_id.toLowerCase(),
      coin_symbol: coin_symbol.toUpperCase(),
    })
    .select()
    .single();

  if (error) {
    // Unique constraint violation — coin already in watchlist
    if (error.code === "23505") {
      return res.status(409).json({ error: "Coin already in watchlist" });
    }
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/watchlist/:coinId
// Remove a coin from the watchlist by coin_id (e.g. "bitcoin").
// ─────────────────────────────────────────────────────────────
router.delete("/:coinId", async (req, res) => {
  const { error, count } = await anonClient
    .from("watchlists")
    .delete({ count: "exact" })
    .eq("user_id", req.user.id)
    .eq("coin_id", req.params.coinId.toLowerCase());

  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: "Coin not found in watchlist" });
  res.json({ success: true });
});

export default router;
