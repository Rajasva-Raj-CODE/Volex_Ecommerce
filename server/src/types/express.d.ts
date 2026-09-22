/**
 * Razorpay signs the exact bytes it sent, so the webhook route needs the body
 * before `express.json()` reparses it. `express.json({ verify })` in app.ts
 * stashes that buffer here.
 */
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

export {};
