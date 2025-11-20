import { Calendar, MessageSquare, Phone } from "lucide-react";

export default function Hero({ onOpenScheduler }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            AI Dental Receptionist
          </h1>
          <p className="text-blue-100/90 mb-6">
            Book appointments, answer questions, send reminders, and collect feedback — all in one simple assistant.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onOpenScheduler} className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-400 transition">
              <Calendar className="w-4 h-4" /> Book Appointment
            </button>
            <a href="#chat" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition">
              <MessageSquare className="w-4 h-4" /> Ask a Question
            </a>
            <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-white hover:bg-emerald-400 transition">
              <Phone className="w-4 h-4" /> Call Routing Demo
            </button>
          </div>
        </div>
        <div className="flex-1">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-400/20 p-6 border border-white/10">
            <ul className="grid grid-cols-2 gap-3 text-sm text-white/90">
              <li>• Scheduling & reminders</li>
              <li>• Patient records</li>
              <li>• Insurance check</li>
              <li>• Cost estimates</li>
              <li>• FAQ chatbot</li>
              <li>• Feedback capture</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
