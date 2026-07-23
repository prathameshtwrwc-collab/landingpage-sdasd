"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Target, Plus, Check, Trash2, ChevronRight } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  category: string;
  progress: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, title: "Sleep by 10:30 PM every night", category: "Sleep", progress: 65 },
    { id: 2, title: "Wake up without snoozing", category: "Routine", progress: 40 },
    { id: 3, title: "Exercise 3 times this week", category: "Fitness", progress: 80 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", category: "Sleep" });
  const [idCounter, setIdCounter] = useState(4);

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    setGoals([...goals, { id: idCounter, title: newGoal.title, category: newGoal.category, progress: 0 }]);
    setIdCounter(idCounter + 1);
    setNewGoal({ title: "", category: "Sleep" });
    setShowForm(false);
  };

  const deleteGoal = (id: number) => setGoals(goals.filter((g) => g.id !== id));

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Goals</span>
          <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Sleep Goals</h1>
        </div>
        <button type="button" onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-[6px] text-white text-[13px] font-semibold px-[16px] py-[10px] border-none cursor-pointer rounded-xl transition-all"
          style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 12px rgba(53,49,155,0.25)", fontFamily: "Poppins, sans-serif" }}>
          <Plus size={16} stroke="white" /> {showForm ? "Cancel" : "Add Goal"}
        </button>
      </div>

      {showForm && (
        <div className="p-[20px] rounded-[16px] mb-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] mb-[12px]">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold mb-[4px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Goal Title</label>
              <input type="text" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="e.g. Sleep by 10:30 PM"
                className="w-full px-[12px] py-[9px] text-[13px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold mb-[4px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>Category</label>
              <select value={newGoal.category} onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="w-full px-[12px] py-[9px] text-[13px] bg-white rounded-lg outline-none" style={{ border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif" }}>
                {["Sleep", "Routine", "Fitness", "Energy", "Nutrition"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="button" onClick={addGoal} disabled={!newGoal.title.trim()}
            className="text-white text-[13px] font-semibold px-[20px] py-[9px] border-none cursor-pointer rounded-xl disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", fontFamily: "Poppins, sans-serif" }}>
            Add Goal
          </button>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <Target size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Set your first sleep goal</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
          {goals.map((goal) => (
            <div key={goal.id} className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="flex items-start justify-between mb-[10px]">
                <div className="flex items-center gap-[10px]">
                  <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: goal.progress >= 100 ? "rgba(46,125,50,0.1)" : "rgba(245,154,0,0.1)" }}>
                    {goal.progress >= 100 ? <Check size={16} stroke="#2E7D32" /> : <Target size={16} stroke="#F59A00" />}
                  </div>
                  <div>
                    <p className="m-0 text-[13px] font-medium" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{goal.title}</p>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#F59A00", fontFamily: "Poppins, sans-serif" }}>{goal.category}</span>
                  </div>
                </div>
                <button type="button" onClick={() => deleteGoal(goal.id)}
                  className="bg-transparent border-none cursor-pointer p-[4px] hover:opacity-70" style={{ color: "#CCC" }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="w-full h-[6px] rounded-full" style={{ background: "#F0F0F0" }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${goal.progress}%`, background: "linear-gradient(90deg, #35319B, #F59A00)" }} />
              </div>
              <p className="m-0 mt-[6px] text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{goal.progress}% complete</p>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
