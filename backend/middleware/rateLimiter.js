import redis from "../config/redis.js";

// In-memory fallback for rate limiting when Redis is unavailable
const memoryStore = new Map();

/**
 * Advanced rate limiter with Redis backend and memory fallback
 */
export const rateLimiter = (options = {}) => {
    const {
        windowMs = 60 * 1000,
        maxRequests = 100,
        keyGenerator = (req) => req.ip || req.connection?.remoteAddress || "unknown",
        skipSuccessfulRequests = false,
        skip = () => false,
        message = "Too many requests. Please try again later."
    } = options;

    return async (req, res, next) => {
        if (skip(req)) {
            return next();
        }

        const key = `ratelimit:${keyGenerator(req)}`;
        const now = Date.now();
        const windowStart = now - windowMs;

        try {
            let requestCount;
            let oldestRequest;

            try {
                await redis.zremrangebyscore(key, 0, windowStart);
                requestCount = await redis.zcard(key);

                if (requestCount >= maxRequests) {
                    const oldest = await redis.zrange(key, 0, 0, "WITHSCORES");
                    oldestRequest = oldest.length >= 2 ? parseInt(oldest[1]) : now;

                    const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000);

                    res.set("X-RateLimit-Limit", maxRequests);
                    res.set("X-RateLimit-Remaining", 0);
                    res.set("X-RateLimit-Reset", Math.ceil((oldestRequest + windowMs) / 1000));
                    res.set("Retry-After", retryAfter);

                    return res.status(429).json({
                        error: message,
                        retryAfter: retryAfter
                    });
                }

                const requestMember = `${now}-${req.ip || 'unknown'}-${req.path}`;
                await redis.zadd(key, now, requestMember);
                await redis.expire(key, Math.ceil(windowMs / 1000));

                res.set("X-RateLimit-Limit", maxRequests);
                res.set("X-RateLimit-Remaining", Math.max(0, maxRequests - requestCount - 1));

            } catch (_redisErr) {
                // Fallback to memory store
                if (!memoryStore.has(key)) {
                    memoryStore.set(key, []);
                }

                const requests = memoryStore.get(key).filter(t => t > windowStart);
                memoryStore.set(key, requests);

                if (requests.length >= maxRequests) {
                    const retryAfter = Math.ceil((requests[0] + windowMs - now) / 1000);

                    res.set("X-RateLimit-Limit", maxRequests);
                    res.set("X-RateLimit-Remaining", 0);
                    res.set("Retry-After", retryAfter);

                    return res.status(429).json({
                        error: message,
                        retryAfter: retryAfter
                    });
                }

                requests.push(now);
                res.set("X-RateLimit-Limit", maxRequests);
                res.set("X-RateLimit-Remaining", Math.max(0, maxRequests - requests.length));
            }

            if (skipSuccessfulRequests) {
                const requestMember = `${now}-${req.ip || 'unknown'}-${req.path}`;
                const originalEnd = res.end.bind(res);
                res.end = function (...args) {
                    if (res.statusCode < 400) {
                        redis.zrem(key, requestMember).catch(() => { });
                    }
                    return originalEnd.apply(this, args);
                };
            }

            next();
        } catch (err) {
            console.error("Rate limiter error:", err.message);
            next();
        }
    };
};

setInterval(() => {
    const now = Date.now();
    const maxAge = 15 * 60 * 1000;
    for (const [key, requests] of memoryStore.entries()) {
        const filtered = requests.filter(t => t > now - maxAge);
        if (filtered.length === 0) {
            memoryStore.delete(key);
        } else {
            memoryStore.set(key, filtered);
        }
    }
}, 5 * 60 * 1000);

export const rateLimiters = {
    auth: rateLimiter({
        windowMs: 60 * 1000,
        maxRequests: 5,
        keyGenerator: (req) => {
            const identifier = req.body?.identifier || req.body?.email || "";
            const ip = req.ip || req.connection?.remoteAddress || "unknown";
            return `${ip}:${identifier.toLowerCase()}`;
        },
        skip: (req) => req.method === "OPTIONS",
        message: "Too many authentication attempts. Please try again in a minute."
    }),
    api: rateLimiter({
        windowMs: 60 * 1000,
        maxRequests: 100,
        skip: (req) => {
            if (req.method === "OPTIONS") return true;
            if (req.path === "/auth/me" || req.path === "/oauth/refresh") return true;
            return false;
        },
        message: "API rate limit exceeded. Please slow down."
    }),
    read: rateLimiter({
        windowMs: 60 * 1000,
        maxRequests: 300,
        message: "Too many requests. Please try again later."
    }),
    expensive: rateLimiter({
        windowMs: 60 * 1000,
        maxRequests: 10,
        message: "This operation is rate limited. Please try again later."
    }),
    codeExecution: rateLimiter({
        windowMs: 60 * 1000,
        maxRequests: 30,
        keyGenerator: (req) => req.user?.id || req.ip,
        message: "Code execution rate limit reached. Please wait before running more code."
    }),
    ai: rateLimiter({
        windowMs: 60 * 1000,
        maxRequests: 20,
        keyGenerator: (req) => req.user?.id || req.ip,
        message: "AI request limit reached. Please wait before making more AI requests."
    })
};

export default { rateLimiter, rateLimiters };
