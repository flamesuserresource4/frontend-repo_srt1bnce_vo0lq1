import { useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function Toolkit() {
  const [code, setCode] = useState("D1110");
  const [estimate, setEstimate] = useState(null);
  const [memberId, setMemberId] = useState("");
  const [provider, setProvider] = useState("Delta Dental");
  const [checkResult, setCheckResult] = useState(null);

  async function getEstimate() {
    const res = await fetch(`${API}/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ procedure_code: code }),
    });
    const data = await res.json();
    setEstimate(data);
  }

  async function checkInsurance() {
    const res = await fetch(`${API}/insurance/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, member_id: memberId }),
    });
    const data = await res.json();
    setCheckResult(data);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-white font-semibold mb-2">Quick Cost Estimate</h3>
        <div className="flex gap-2 mb-2">
          <input value={code} onChange={(e)=>setCode(e.target.value)} className="flex-1 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white" placeholder="Procedure code (e.g., D1110)" />
          <button onClick={getEstimate} className="rounded-lg bg-blue-500 px-4 py-2 text-white">Estimate</button>
        </div>
        {estimate && <pre className="text-xs text-white/90 bg-black/30 p-3 rounded-lg">{JSON.stringify(estimate, null, 2)}</pre>}
      </div>

      <div>
        <h3 className="text-white font-semibold mb-2">Insurance Eligibility Check</h3>
        <div className="flex gap-2 mb-2">
          <input value={provider} onChange={(e)=>setProvider(e.target.value)} className="flex-1 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white" placeholder="Provider" />
          <input value={memberId} onChange={(e)=>setMemberId(e.target.value)} className="flex-1 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white" placeholder="Member ID" />
          <button onClick={checkInsurance} className="rounded-lg bg-emerald-500 px-4 py-2 text-white">Check</button>
        </div>
        {checkResult && <pre className="text-xs text-white/90 bg-black/30 p-3 rounded-lg">{JSON.stringify(checkResult, null, 2)}</pre>}
      </div>
    </div>
  );
}
