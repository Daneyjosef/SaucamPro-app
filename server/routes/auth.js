import { Router } from "express";
import { verifySupabaseJWT } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/auth/me
 * Returns the authenticated user's profile.
 * Supabase handles all actual sign-in / sign-up on the client side;
 * this endpoint is a convenience check / session probe.
 */
router.get("/me", verifySupabaseJWT, (req, res) => {
  const { id, email, user_metadata, created_at } = req.user;
  res.json({
    user: {
      id,
      email,
      name: user_metadata?.full_name ?? null,
      created_at,
    },
  });
});

export default router;
