type RateLimitBucket = {
  attemptCount: number;
  windowStartMs: number;
  blockedUntilMs: number;
};

const RATE_LIMIT_STORE = new Map<string, RateLimitBucket>();

const ADMIN_LOGIN_WINDOW_MS = 15 * 60 * 1000;
const ADMIN_LOGIN_BLOCK_MS = 15 * 60 * 1000;
const ADMIN_LOGIN_MAX_ATTEMPTS = 5;

type LimitResult = {
  blocked: boolean;
  retryAfterSeconds: number;
};

function nowMs() {
  return Date.now();
}

function getBucket(key: string): RateLimitBucket {
  const existing = RATE_LIMIT_STORE.get(key);

  if (!existing) {
    const fresh: RateLimitBucket = {
      attemptCount: 0,
      windowStartMs: nowMs(),
      blockedUntilMs: 0
    };

    RATE_LIMIT_STORE.set(key, fresh);
    return fresh;
  }

  return existing;
}

export function getAdminLoginRateLimitKey(ipAddress: string) {
  return `admin-login:${ipAddress}`;
}

export function checkAdminLoginBlocked(key: string): LimitResult {
  const bucket = getBucket(key);
  const now = nowMs();

  if (bucket.blockedUntilMs > now) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((bucket.blockedUntilMs - now) / 1000)
    };
  }

  if (now - bucket.windowStartMs > ADMIN_LOGIN_WINDOW_MS) {
    bucket.attemptCount = 0;
    bucket.windowStartMs = now;
    bucket.blockedUntilMs = 0;
  }

  return { blocked: false, retryAfterSeconds: 0 };
}

export function recordAdminLoginFailure(key: string): LimitResult {
  const bucket = getBucket(key);
  const now = nowMs();

  if (now - bucket.windowStartMs > ADMIN_LOGIN_WINDOW_MS) {
    bucket.attemptCount = 0;
    bucket.windowStartMs = now;
    bucket.blockedUntilMs = 0;
  }

  bucket.attemptCount += 1;

  if (bucket.attemptCount >= ADMIN_LOGIN_MAX_ATTEMPTS) {
    bucket.blockedUntilMs = now + ADMIN_LOGIN_BLOCK_MS;

    return {
      blocked: true,
      retryAfterSeconds: Math.ceil(ADMIN_LOGIN_BLOCK_MS / 1000)
    };
  }

  return { blocked: false, retryAfterSeconds: 0 };
}

export function clearAdminLoginFailures(key: string) {
  RATE_LIMIT_STORE.delete(key);
}
