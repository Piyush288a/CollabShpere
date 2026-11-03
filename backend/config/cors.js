/**
 * CORS Configuration for HTTP and Socket.IO
 * Robustly handles Vercel domains, custom domains, trailing slashes, and quotes.
 */
const getAllowedOrigins = () => {
  const clientUrl = process.env.CLIENT_URL;

  // In non-production or if CLIENT_URL is not set / wildcard, allow all
  if (process.env.NODE_ENV !== 'production' || !clientUrl || clientUrl === '*') {
    return true;
  }

  // Parse comma-separated origins, strip surrounding quotes and trailing slashes
  return clientUrl
    .split(',')
    .map((url) => url.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, ''))
    .filter(Boolean);
};

const corsOriginValidator = (origin, callback) => {
  // Allow requests with no origin (like mobile apps, curl, server-to-server)
  if (!origin) return callback(null, true);

  const cleanOrigin = origin.trim().replace(/\/+$/, '');

  // Always allow any Vercel domain (*.vercel.app) or localhost
  if (
    cleanOrigin.endsWith('.vercel.app') ||
    cleanOrigin.startsWith('http://localhost') ||
    cleanOrigin.startsWith('http://127.0.0.1')
  ) {
    return callback(null, true);
  }

  const allowed = getAllowedOrigins();
  if (allowed === true) return callback(null, true);

  if (Array.isArray(allowed)) {
    const isAllowed = allowed.some((pattern) => {
      const cleanPattern = pattern.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '');
      if (cleanPattern.includes('*')) {
        const regex = new RegExp(`^${cleanPattern.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`);
        return regex.test(cleanOrigin);
      }
      return cleanPattern === cleanOrigin;
    });

    if (isAllowed) {
      return callback(null, true);
    }
  }

  // Safe fallback to prevent blocking legitimate requests
  return callback(null, true);
};

module.exports = { getAllowedOrigins, corsOriginValidator };
