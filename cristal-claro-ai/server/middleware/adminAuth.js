/**
 * Simple Bearer token for admin routes. Set ADMIN_API_TOKEN in .env
 */
export function requireAdmin(req, res, next) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) {
    return res.status(503).json({
      error: 'Admin API not configured (set ADMIN_API_TOKEN)',
    });
  }
  const auth = req.headers.authorization || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (bearer !== token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
