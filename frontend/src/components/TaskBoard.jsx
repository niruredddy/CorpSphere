import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, ChevronRight, Flag } from 'lucide-react';

const STATUSES = [
    { key: 'todo', label: 'To Do', color: 'border-zinc-600', badge: 'bg-zinc-700 text-zinc-300' },
    { key: 'in_progress', label: 'In Progress', color: 'border-yellow-500/50', badge: 'bg-yellow-500/10 text-yellow-400' },
    { key: 'done', label: 'Done', color: 'border-emerald-500/50', badge: 'bg-emerald-500/10 text-emerald-400' }
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const TaskBoard = ({ canManage = false }) => {
    const { getOrgTasks, addTask, updateTaskStatus, removeTask, getOrgMembers, user } = useAuth();
    const tasks = getOrgTasks(user.orgId);
    const members = getOrgMembers(user.orgId);
    
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [assignee, setAssignee] = useState('');
    const [priority, setPriority] = useState('Medium');

    const handleAdd = (e) => {
        e.preventDefault();
        addTask(user.orgId, title, assignee || 'Unassigned', priority);
        setTitle(''); setAssignee(''); setPriority('Medium'); setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                    <Flag size={20} className="text-emerald-500" /> Project Board
                </h2>
                {canManage && (
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 px-4 flex items-center gap-2 text-xs">
                        <Plus size={14} /> New Task
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleAdd} className="glass-card p-5 border border-emerald-500/30 space-y-3">
                    <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-emerald-500" />
                    <div className="flex gap-3">
                        <select value={assignee} onChange={e=>setAssignee(e.target.value)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-emerald-500 text-zinc-300">
                            <option value="">Assign to...</option>
                            {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                        </select>
                        <select value={priority} onChange={e=>setPriority(e.target.value)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-emerald-500 text-zinc-300">
                            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <button type="submit" className="bg-emerald-500 text-black font-bold px-6 rounded-lg text-sm hover:bg-emerald-400">Add</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-3 gap-4">
                {STATUSES.map(status => {
                    const columnTasks = tasks.filter(t => t.status === status.key);
                    return (
                        <div key={status.key} className={`rounded-xl border ${status.color} bg-white/[0.02] p-4 min-h-[200px]`}>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">{status.label}</h4>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${status.badge}`}>{columnTasks.length}</span>
                            </div>
                            <div className="space-y-3">
                                {columnTasks.map(task => (
                                    <div key={task.id} className="glass-card p-3 group relative">
                                        <p className="text-sm font-semibold text-white mb-2">{task.title}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-zinc-500">{task.assignee}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                                task.priority === 'Critical' ? 'bg-red-500/10 text-red-400' :
                                                task.priority === 'High' ? 'bg-orange-500/10 text-orange-400' :
                                                task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                'bg-zinc-700 text-zinc-400'
                                            }`}>{task.priority}</span>
                                        </div>
                                        {/* Status change buttons */}
                                        <div className="flex gap-1 mt-3 pt-2 border-t border-white/5">
                                            {STATUSES.filter(s => s.key !== task.status).map(s => (
                                                <button key={s.key} onClick={() => updateTaskStatus(task.id, s.key)} className="flex-1 text-[10px] py-1 rounded bg-white/5 hover:bg-emerald-500/20 text-zinc-400 hover:text-white transition-colors font-bold flex items-center justify-center gap-1">
                                                    <ChevronRight size={10} /> {s.label}
                                                </button>
                                            ))}
                                            {canManage && (
                                                <button onClick={() => removeTask(task.id)} className="px-2 py-1 rounded bg-white/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {columnTasks.length === 0 && (
                                    <p className="text-[10px] text-zinc-700 text-center py-6 border border-dashed border-white/5 rounded-lg">Empty</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskBoard;
