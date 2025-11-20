import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import Scheduler from "./components/Scheduler";
import ChatWidget from "./components/ChatWidget";
import Toolkit from "./components/Toolkit";

function App() {
  const [open, setOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    const API = import.meta.env.VITE_BACKEND_URL || "";
    fetch(`${API}/test`).then(r=>r.json()).then(setBackendStatus).catch(()=>{});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)]" />

      <div className="relative max-w-5xl mx-auto p-6 space-y-8">
        <Hero onOpenScheduler={() => setOpen(true)} />

        {backendStatus && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-xs text-blue-100/80">
            <div>Backend: {backendStatus.backend}</div>
            <div>Database: {backendStatus.database}</div>
          </div>
        )}

        <Toolkit />
        <ChatWidget />
      </div>

      {open && <Scheduler onClose={() => setOpen(false)} />}
    </div>
  );
}

export default App;
