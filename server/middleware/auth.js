import { anonClient } from "../lib/supabase.js";

/**
 * Verifies a Supabase JWT from the Authorization: Bearer <token> header.
 * Attaches the decoded user object to req.user on success.
 */
export async function verifySupabaseJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({ error: "Empty bearer token" });
  }

  const {
    data: { user },
    error,
  } = await anonClient.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = user;
  req.token = token;
  next();
}
