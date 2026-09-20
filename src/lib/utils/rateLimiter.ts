import dbConnect from '@/lib/db/connect';
import RateLimitModel from '@/lib/db/models/RateLimit';

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Atomic persistent rate-limiter using MongoDB TTL index.
 * Works across serverless instances and multiple server nodes.
 *
 * @param key Unique rate limit identifier (e.g. `msg_user_123`)
 * @param limit Maximum allowed requests per window
 * @param windowSeconds Time window duration in seconds
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  try {
    await dbConnect();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

    // Query existing record by key to avoid E11000 duplicate key error on upsert
    let record = await RateLimitModel.findOne({ key });
    if (!record || record.expiresAt <= now) {
      record = await RateLimitModel.findOneAndUpdate(
        { key },
        { count: 1, expiresAt },
        { upsert: true, returnDocument: 'after' }
      );
    } else {
      record = await RateLimitModel.findOneAndUpdate(
        { key },
        { $inc: { count: 1 } },
        { returnDocument: 'after' }
      );
    }

    if (!record) {
      return {
        allowed: true,
        limit,
        remaining: limit - 1,
        resetInSeconds: windowSeconds,
      };
    }

    const count = record.count;
    const remaining = Math.max(0, limit - count);
    const resetInSeconds = Math.max(
      1,
      Math.ceil((record.expiresAt.getTime() - now.getTime()) / 1000)
    );

    return {
      allowed: count <= limit,
      limit,
      remaining,
      resetInSeconds,
    };
  } catch (error) {
    // If rate-limiter database check fails, log warning and allow request gracefully
    console.warn('Rate limiter check error, falling back to allow:', error);
    return {
      allowed: true,
      limit,
      remaining: 1,
      resetInSeconds: windowSeconds,
    };
  }
}
