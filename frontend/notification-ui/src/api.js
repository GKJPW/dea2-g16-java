export const NOTIFICATION_API_BASE = "http://localhost:8088/api/notifications";

export async function sendEmailNotification(payload) {
  const res = await fetch(`${NOTIFICATION_API_BASE}/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
  }
  return data;
}