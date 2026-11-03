/**
 * CORS Configuration for HTTP and Socket.IO
 * Supports single origin, multiple comma-separated origins, and Vercel preview URLs.
 */
const getAllowedOrigins = () => {
  const clientUrl = process.env.CLIENT_URL;

  // In non-production or if CLIENT_URL is not set / wildcard, allow all
  if (process.env.NODE_ENV !== 'production' || !clientUrl || clientUrl === '*') {
    return true;
  }

  // Parse comma-separated origins, strip trailing slashes
  return clientUrl
    .split(',')
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean);
};

const corsOriginValidator = (origin, callback) => {
  // Allow requests with no origin (like mobile apps, curl, or server-to-server requests)
  if (!origin) return callback(null, true);

  const allowed = getAllowedOrigins();
  if (allowed === true) return callback(null, true);

  if (Array.isArray(allowed)) {
    const isAllowed = allowed.some((pattern) => {
      if (pattern.includes('*')) {
        const regex = new RegExp(`^${pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`);
        return regex.test(origin);
      }
      return pattern === origin;
    });

    if (isAllowed) {
      return callback(null, true);
    }
  }

  return callback(new Error(`CORS blocked for origin: ${origin}`));
};

module.exports = { getAllowedOrigins, corsOriginValidator };
