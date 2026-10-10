import { useState } from "react";
import { conversations } from "../data/feed";

type Message = { id: string; from: "me" | "them"; text: string; time: string };

export default function Messages() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [msgState, setMsgState] = useState<Record<string, Message[]>>(
    Object.fromEntries(conversations.map((c) => [c.id, c.messages as Message[]]))
  );

  const active = conversations.find((c) => c.id === activeId)!;
  const msgs = msgState[activeId] ?? [];
  const inputVal = inputs[activeId] ?? "";

  const send = () => {
    if (!inputVal.trim()) return;
    const newMsg: Message = { id: `m${Date.now()}`, from: "me", text: inputVal.trim(), time: "Just now" };
    setMsgState((s) => ({ ...s, [activeId]: [...(s[activeId] ?? []), newMsg] }));
    setInputs((i) => ({ ...i, [activeId]: "" }));
  };

  return (
    <div className="bg-[#F5F4F0] min-h-[calc(100vh-64px)]">
      <div className="max-w-[1100px] mx-auto px-4 lg:px-12 py-6 lg:py-10">
        <h1 className="text-[22px] font-bold text-[#0D1421] mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Messages</h1>

        <div className="grid lg:grid-cols-[320px_1fr] bg-white border border-[#DDD9D2] rounded-2xl overflow-hidden" style={{ minHeight: "600px" }}>

          {/* Conversation list */}
          <div className="border-r border-[#DDD9D2] flex flex-col">
            <div className="p-3.5 border-b border-[#DDD9D2]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input placeholder="Search conversations..." className="w-full pl-9 pr-3.5 py-2 bg-[#F5F4F0] border border-[#DDD9D2] rounded-xl text-[13px] placeholder-[#C5C0BB] focus:outline-none focus:ring-2 focus:ring-[#2557D6]" style={{ fontFamily: "'Inter', sans-serif" }} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((c) => (
                <button key={c.id} onClick={() => setActiveId(c.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-[#F0EDE8] last:border-b-0 text-left transition-colors ${activeId === c.id ? "bg-[#EEF2FF]" : "hover:bg-[#F5F4F0]"}`}>
                  <div className="relative shrink-0">
                    <img src={c.with.avatar} alt={c.with.name} className="w-10 h-10 rounded-full object-cover bg-[#E8E6E1]" />
                    {c.with.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#16A34A] rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[13.5px] font-semibold text-[#0D1421] truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{c.with.name}</p>
                      <p className="text-[11px] text-[#9CA3AF] shrink-0 ml-2" style={{ fontFamily: "'Inter', sans-serif" }}>{c.lastTime}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] text-[#6B7280] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{c.lastMessage}</p>
                      {c.unread > 0 && (
                        <span className="shrink-0 w-4 h-4 bg-[#2557D6] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{c.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation window */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#DDD9D2]">
              <div className="relative">
                <img src={active.with.avatar} alt={active.with.name} className="w-9 h-9 rounded-full object-cover" />
                {active.with.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#16A34A] rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{active.with.name}</p>
                <p className="text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {active.with.role} {active.with.online && <span className="text-[#16A34A]">· Online</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg border border-[#DDD9D2] flex items-center justify-center hover:bg-[#F5F4F0] transition-colors text-[#6B7280]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                </button>
                <button className="w-8 h-8 rounded-lg border border-[#DDD9D2] flex items-center justify-center hover:bg-[#F5F4F0] transition-colors text-[#6B7280]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ maxHeight: "460px" }}>
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[72%] ${m.from === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed ${m.from === "me" ? "bg-[#2557D6] text-white rounded-br-sm" : "bg-[#F5F4F0] text-[#1F2937] border border-[#DDD9D2] rounded-bl-sm"}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                      {m.text}
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] px-1" style={{ fontFamily: "'Inter', sans-serif" }}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-5 py-3.5 border-t border-[#DDD9D2] flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  rows={1}
                  value={inputVal}
                  onChange={(e) => setInputs((i) => ({ ...i, [activeId]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Write a message..."
                  className="w-full px-4 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-xl text-[13.5px] text-[#0D1421] placeholder-[#C5C0BB] resize-none focus:outline-none focus:ring-2 focus:ring-[#2557D6] focus:border-transparent"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <button
                onClick={send}
                disabled={!inputVal.trim()}
                className="p-2.5 bg-[#2557D6] text-white rounded-xl hover:bg-[#1E4AB8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
