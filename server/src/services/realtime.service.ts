import { env } from "../config/env";

type BroadcastEvent = "notification";

interface BroadcastPayload {
  userId: string;
  event: BroadcastEvent;
  payload: Record<string, unknown>;
}

export async function broadcastToUser({ userId, event, payload }: BroadcastPayload): Promise<void> {
  try {
    await fetch(`${env.SUPABASE_URL}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            topic: `user:${userId}`,
            event,
            payload,
            private: false,
          },
        ],
      }),
    });
  } catch (err) {
    console.error("Realtime broadcast failed:", err);
  }
}
