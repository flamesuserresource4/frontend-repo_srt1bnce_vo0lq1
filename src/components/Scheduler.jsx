import { useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function Scheduler({ onClose }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    reason: "Cleaning",
    date: "",
    start: "09:00",
    duration: 60,
    provider: "Dr. Smith",
  });
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Ensure/create patient
      const patientRes = await fetch(`${API}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email || undefined,
          phone: form.phone || undefined,
        }),
      });
      const patientData = await patientRes.json();
      const patientId = patientData?.patient?._id || patientData?._id || patientData?.patientId;

      const dateStr = form.date; // YYYY-MM-DD
      const startISO = new Date(`${dateStr}T${form.start}:00`).toISOString();
      const endISO = new Date(new Date(`${dateStr}T${form.start}:00`).getTime() + form.duration * 60000).toISOString();

      const apptRes = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          reason: form.reason,
          start_time: startISO,
          end_time: endISO,
          provider: form.provider,
        }),
      });

      if (!apptRes.ok) {
        const err = await apptRes.json();
        throw new Error(err?.detail || "Failed to schedule");
      }

      const appt = await apptRes.json();
      setCreated(appt.appointment);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Book an Appointment</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        {created ? (
          <div className="text-white">
            <p className="mb-2">Appointment scheduled!</p>
            <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-auto">{JSON.stringify(created, null, 2)}</pre>
            <div className="mt-4 text-right">
              <button onClick={onClose} className="rounded-lg bg-blue-500 px-4 py-2 text-white">Close</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <input name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" required />
            <input name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" required />
            <input name="email" placeholder="Email (optional)" value={form.email} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />

            <select name="reason" value={form.reason} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
              <option>Cleaning</option>
              <option>Check-up</option>
              <option>Filling</option>
              <option>Tooth pain</option>
              <option>Emergency</option>
            </select>
            <input type="date" name="date" value={form.date} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" required />
            <input type="time" name="start" value={form.start} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" required />
            <select name="duration" value={form.duration} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
            </select>
            <input name="provider" placeholder="Provider" value={form.provider} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white md:col-span-2" />

            {error && <div className="md:col-span-2 text-red-300 text-sm">{error}</div>}

            <div className="md:col-span-2 text-right">
              <button disabled={loading} className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-60">
                {loading ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
