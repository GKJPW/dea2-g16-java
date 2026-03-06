import { useState } from "react";
import { sendEmailNotification } from "./api";
import "./App.css";

export default function App() {
  const [eventType, setEventType] = useState("ORDER_PLACED");
  const [toEmail, setToEmail] = useState("");
  const [message, setMessage] = useState("Order #101 Placed");

  const [result, setResult] = useState(null);
  const [statusMsg, setStatusMsg] = useState(""); // ✅ output message
  const [statusType, setStatusType] = useState("info"); // success | error | info
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!message.trim()) {
      setStatusType("error");
      setStatusMsg("❌ Message is required.");
      setResult({ error: "Message is required" });
      return;
    }

    setLoading(true);
    setStatusType("info");
    setStatusMsg("⏳ Sending notification...");
    setResult(null);

    try {
      const payload = {
        message: message.trim(),
        eventType,
        toEmail: toEmail.trim() || null,
      };

      const data = await sendEmailNotification(payload);

      setStatusType("success");
      setStatusMsg(`✅ Sent successfully! Log ID: ${data.logId} (Status: ${data.status})`);
      setResult(data);

      // ✅ clear inputs after success
      setEventType("ORDER_PLACED");
      setToEmail("");
      setMessage("");
    } catch (e) {
      setStatusType("error");
      setStatusMsg(`❌ Failed to send. ${String(e.message || e)}`);
      setResult({ error: String(e.message || e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">Notification Service UI (React)</h2>
        <p className="subtitle">Triggers backend email simulation + logs to MySQL.</p>

        <label className="label">Event Type</label>
        <select className="input" value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="ORDER_PLACED">ORDER_PLACED</option>
          <option value="ORDER_CANCELLED">ORDER_CANCELLED</option>
          <option value="PAYMENT_SUCCESS">PAYMENT_SUCCESS</option>
          <option value="PAYMENT_FAILED">PAYMENT_FAILED</option>
        </select>

        <label className="label">To Email</label>
        <input
          className="input"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          placeholder="customer@gmail.com"
        />

        <label className="label">Message</label>
        <textarea
          className="input textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Order #101 Placed"
        />

        <button className="btn" onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send Email (Simulate)"}
        </button>

        <h3 className="resultTitle">Output</h3>

        {/* ✅ Output message banner */}
        {statusMsg && (
          <div className={`statusBanner ${statusType}`}>
            {statusMsg}
          </div>
        )}

        {/* ✅ JSON output (dark) */}
        <pre className="resultBox">
          {JSON.stringify(result ?? {}, null, 2)}
        </pre>
      </div>
    </div>
  );
}