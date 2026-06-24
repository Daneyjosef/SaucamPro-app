import { Router } from "express";
import { verifySupabaseJWT } from "../middleware/auth.js";
import { getUserClient } from "../lib/supabase.js";

const router = Router();
router.use(verifySupabaseJWT);

// Helper: scoped Supabase client that impersonates the requesting user
// so RLS policies apply automatically.
function db(req) {
  const token = req.headers.authorization.slice(7);
  return getUserClient(req.token).auth.setSession
    ? getUserClient(req.token) // RLS is enforced by the policy using auth.uid()
    : getUserClient(req.token);
}

// ─────────────────────────────────────────────────────────────
// GET /api/portfolio
// Returns all holdings for the authenticated user.
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const { data, error } = await getUserClient(req.token)
    .from("portfolios")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ portfolio: data });
});

// ─────────────────────────────────────────────────────────────
// POST /api/portfolio
// Add a new holding.
// Body: { coin_id, coin_symbol, amount, avg_buy_price }
// ─────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { coin_id, coin_symbol, amount, avg_buy_price } = req.body;

  if (!coin_id || !coin_symbol || amount == null) {
    return res.status(400).json({ error: "coin_id, coin_symbol, and amount are required" });
  }
  if (Number(amount) <= 0) {
    return res.status(400).json({ error: "amount must be greater than 0" });
  }

  const { data, error } = await getUserClient(req.token)
    .from("portfolios")
    .insert({
      user_id: req.user.id,
      coin_id: coin_id.toLowerCase(),
      coin_symbol: coin_symbol.toUpperCase(),
      amount: Number(amount),
      avg_buy_price: Number(avg_buy_price) || 0,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ─────────────────────────────────────────────────────────────
// PUT /api/portfolio/:id
// Update a holding (amount and/or avg_buy_price).
// Body: { amount?, avg_buy_price? }
// ─────────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  const { amount, avg_buy_price } = req.body;
  const updates = {};
  if (amount != null) updates.amount = Number(amount);
  if (avg_buy_price != null) updates.avg_buy_price = Number(avg_buy_price);

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: "Provide at least one field to update" });
  }

  const { data, error } = await getUserClient(req.token)
    .from("portfolios")
    .update(updates)
    .eq("id", req.params.id)
    .eq("user_id", req.user.id) // prevents touching another user's rows
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Holding not found" });
  res.json(data);
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/portfolio/:id
// Remove a holding.
// ─────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  const { error, count } = await getUserClient(req.token)
    .from("portfolios")
    .delete({ count: "exact" })
    .eq("id", req.params.id)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: "Holding not found" });
  res.json({ success: true });
});

export default router;
