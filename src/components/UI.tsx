import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store';
import { Send, Users } from 'lucide-react';

const TaskUI = () => {
  const uiState = useGameStore(state => state.uiState);
  const setUiState = useGameStore(state => state.setUiState);
  const setTask = useGameStore(state => state.setTask);
  const [loading, setLoading] = useState(false);

  if (uiState === 'none') return null;

  const handleAction = (nextTask: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUiState('none');
      setTask(nextTask);
      useGameStore.getState().setAction('idle');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {uiState === 'email' && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Writing an important email</h2>
            <div className="space-y-4">
              <input type="text" disabled value="To: CEO" className="w-full p-2 border rounded bg-gray-50 text-slate-600" />
              <input type="text" disabled value="Subject: Q3 Report" className="w-full p-2 border rounded bg-gray-50 text-slate-600" />
              <textarea disabled value="Attached is the report for your review. I would appreciate your comments." className="w-full p-2 border rounded bg-gray-50 h-24 text-slate-600" />
              <button 
                onClick={() => handleAction('meeting')}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                {loading ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </>
        )}
        {uiState === 'coffee' && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Coffee Machine</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAction('write_email')} disabled={loading} className="p-4 border-2 border-amber-700 rounded-xl hover:bg-amber-50 font-bold text-amber-900 transition">Espresso</button>
              <button onClick={() => handleAction('write_email')} disabled={loading} className="p-4 border-2 border-amber-700 rounded-xl hover:bg-amber-50 font-bold text-amber-900 transition">Cappuccino</button>
              <button onClick={() => handleAction('write_email')} disabled={loading} className="p-4 border-2 border-amber-700 rounded-xl hover:bg-amber-50 font-bold text-amber-900 transition">Americano</button>
              <button onClick={() => handleAction('write_email')} disabled={loading} className="p-4 border-2 border-amber-700 rounded-xl hover:bg-amber-50 font-bold text-amber-900 transition">Green Tea</button>
            </div>
            {loading && <div className="mt-4 text-center text-amber-700 font-bold animate-pulse">Preparing drink...</div>}
          </>
        )}
        {uiState === 'printer' && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Main Printer</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-xl flex justify-between items-center border border-gray-200">
                <span className="font-semibold text-slate-700">Q3_Report.pdf</span>
                <span className="text-gray-500 text-sm">2 pages</span>
              </div>
              <button 
                onClick={() => handleAction('it_room')}
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
              >
                {loading ? 'Printing...' : 'Print Document'}
              </button>
            </div>
          </>
        )}
        {uiState === 'it' && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Server Room (IT)</h2>
            <p className="mb-6 text-slate-600 leading-relaxed">The internet is down again. Need to reboot the main router so everyone can get back to work.</p>
            <button 
              onClick={() => handleAction('done')}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
            >
              {loading ? 'Rebooting...' : 'Reboot Router'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export function UI() {
  const players = useGameStore(state => state.players);
  const sendMessage = useGameStore(state => state.sendMessage);
  const currentTask = useGameStore(state => state.currentTask);
  const [chatInput, setChatInput] = useState('');

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const taskMessages: Record<string, string> = {
    find_desk: "🎯 Task: Find an empty desk and sit down",
    working: "💻 Task: Working hard... (Wait a few seconds)",
    make_coffee: "☕ Task: Go to the kitchen and make some coffee",
    write_email: "✉️ Task: Go back to your desk and write an email to the CEO",
    meeting: "🤝 Task: Attend the team meeting in the conference room",
    meeting_active: "🗣️ Task: Listening in the meeting... (Wait a few seconds)",
    print_document: "🖨️ Task: Print the Q3 report at the printer",
    it_room: "🔌 Task: Reboot the router in the IT room",
    done: "🎉 Task: You've finished the workday! Great job!"
  };

  // Handle timers for working and meeting
  const myId = useGameStore(state => state.myId);
  const myPlayer = myId ? players[myId] : null;
  const setTask = useGameStore(state => state.setTask);

  useEffect(() => {
    if (currentTask === 'working' && myPlayer?.action === 'sit_work') {
      const timer = setTimeout(() => {
        setTask('make_coffee');
        useGameStore.getState().setAction('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentTask, myPlayer?.action, setTask]);

  useEffect(() => {
    if (currentTask === 'meeting_active' && myPlayer?.action === 'sit_work') {
      const timer = setTimeout(() => {
        setTask('print_document');
        useGameStore.getState().setAction('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentTask, myPlayer?.action, setTask]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      <TaskUI />
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200 pointer-events-auto flex gap-3 items-center">
          <Users size={18} className="text-indigo-500" />
          <span className="font-semibold text-slate-700 text-sm">{Object.keys(players).length} connected</span>
        </div>

        {/* Task Tracker */}
        <div className="bg-indigo-600/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg text-white font-bold text-sm pointer-events-auto">
          {taskMessages[currentTask]}
        </div>
        
        <div className="w-[100px]"></div> {/* Spacer for balance */}
      </div>

      {/* Bottom Bar (Chat & Instructions) */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-slate-600 text-xs font-bold bg-white/80 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-slate-200">
          ⌨️ Move: W, A, S, D or Arrows | 🖱️ Interact: Space or Click
        </div>
        <form onSubmit={handleChatSubmit} className="bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-slate-200 pointer-events-auto flex items-center w-full max-w-md transition-shadow focus-within:shadow-xl focus-within:border-indigo-300">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type something..." 
            className="flex-1 bg-transparent outline-none px-4 text-slate-700 placeholder-slate-400 text-sm font-medium"
          />
          <button type="submit" className="w-10 h-10 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-colors">
            <Send size={16} className="mr-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
