import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FlipCard from '../components/FlipCard';
import NoticeBoard from '../components/NoticeBoard';
import TaskBoard from '../components/TaskBoard';
import { Search, Activity, GitCommit, GitPullRequest, Trophy, Medal, Star, Flame } from 'lucide-react';

const MemberDash = () => {
    const { getOrgDetails, getOrgMembers, user, updateProgress } = useAuth();
    const org = getOrgDetails(user.orgId);
    const members = getOrgMembers(user.orgId);
    const [searchQuery, setSearchQuery] = useState("");
    const [progressInput, setProgressInput] = useState(user.progress || 0);

    const filteredMembers = members.filter(m => {
        const mName = m.name || '';
        const mRole = m.roleTitle || '';
        return (mName.toLowerCase().includes(searchQuery.toLowerCase()) || 
               mRole.toLowerCase().includes(searchQuery.toLowerCase())) &&
               m.id !== user.id;
    });

    const handleUpdateProgress = () => {
        updateProgress(parseInt(progressInput));
    };

    // Calculate Badges
    const badges = [];
    if (user.progress > 0) badges.push({ id: 1, name: 'First Steps', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' });
    if (user.progress >= 50) badges.push({ id: 2, name: 'Halfway There', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' });
    if (user.progress >= 80) badges.push({ id: 3, name: 'Task Master', icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' });
    if (user.progress >= 100) badges.push({ id: 4, name: 'Perfectionist', icon: Medal, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' });

    // Leaderboard logic
    const leaderboard = [...members, user]
        .filter(m => m && m.name) // valid members
        .sort((a, b) => (b.progress || 0) - (a.progress || 0))
        .slice(0, 5);

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="border-b border-white/5 pb-8">
                <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Welcome, {(user.name || 'User').split(' ')[0]}</h1>
                <p className="text-zinc-500">Your personal workspace within <span className="text-emerald-500 font-semibold">{org.name}</span></p>
            </div>

            {/* Gamification and Leaderboard Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 md:col-span-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-all"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-500" />
                            Achievement Badges
                        </h3>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">{badges.length} Unlocked</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 relative z-10">
                        {badges.length > 0 ? badges.map(b => (
                            <div key={b.id} className={`flex flex-col items-center justify-center p-4 rounded-xl border ${b.border} ${b.bg} w-28 text-center hover:scale-105 transition-transform`}>
                                <b.icon size={24} className={`${b.color} mb-2 drop-shadow-md`} />
                                <span className="text-[10px] font-bold text-white uppercase">{b.name}</span>
                            </div>
                        )) : (
                            <div className="w-full py-6 text-center text-zinc-500 border border-dashed border-white/5 rounded-xl text-sm">
                                Complete tasks and increase velocity to earn badges.
                            </div>
                        )}
                        
                        {/* Shadow placeholder for next badge */}
                        {badges.length < 4 && (
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-white/10 bg-white/5 w-28 text-center opacity-50">
                                <div className="w-6 h-6 rounded-full bg-white/10 mb-2 flex items-center justify-center">?</div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Locked</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                        <Flame size={18} className="text-orange-500" />
                        Top Contributors
                    </h3>
                    <div className="space-y-4">
                        {leaderboard.map((m, idx) => (
                            <div key={m.id} className={`flex items-center gap-3 p-2 rounded-lg ${m.id === user.id ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5 border border-transparent'}`}>
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-zinc-300 text-black' : idx === 2 ? 'bg-orange-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                                    #{idx + 1}
                                </div>
                                <img src={m.avatar || `https://ui-avatars.com/api/?name=${m.name}`} alt={m.name} className="w-8 h-8 rounded-full" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-bold text-white truncate">{m.name}</p>
                                    <p className="text-[10px] text-emerald-500 font-mono">{m.progress || 0} Velocity</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Personal Workspace Row */}
            <div className="grid grid-cols-3 gap-6">
                <div className="glass-card p-6 border-t-4 border-t-emerald-500">
                     <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1 flex items-center gap-2"><Activity size={14}/> My Velocity</p>
                     <div className="my-4">
                         <div className="flex items-center gap-4">
                             <input type="range" min="0" max="100" value={progressInput} onChange={(e)=>setProgressInput(e.target.value)} className="w-full accent-emerald-500" />
                             <span className="text-2xl font-bold w-16 text-right">{progressInput}%</span>
                         </div>
                     </div>
                     <button onClick={handleUpdateProgress} className="w-full py-2 bg-zinc-800 hover:bg-emerald-500 hover:text-black text-white rounded font-bold transition-colors text-sm">Sync Data</button>
                </div>
                
                <div className="glass-card p-6 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                     <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-4 relative z-10">GitHub Stats</p>
                     <div className="space-y-4 relative z-10">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><GitCommit size={14} className="text-emerald-500" /><span className="text-sm font-bold">Commits (7d)</span></div>
                            <span className="text-lg font-bold">124</span>
                         </div>
                         <div className="w-full h-[1px] bg-white/5"></div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><GitPullRequest size={14} className="text-yellow-500" /><span className="text-sm font-bold">Active PRs</span></div>
                            <span className="text-lg font-bold">6</span>
                         </div>
                     </div>
                </div>

                <NoticeBoard />
            </div>

            {/* Task Board */}
            <TaskBoard canManage={false} />

            {/* Colleague Directory */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold border-l-2 border-emerald-500 pl-3">Colleague Directory</h2>
                    <div className="flex items-center gap-4 bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-1.5 w-64">
                        <Search size={14} className="text-zinc-500" />
                        <input type="text" placeholder="Find a colleague..." className="bg-transparent border-none outline-none text-xs w-full text-zinc-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                     {filteredMembers.length > 0 ? filteredMembers.map(member => (
                         <div key={member.id} className="opacity-80 hover:opacity-100 transition-opacity">
                             <FlipCard member={{ ...member, role: member.roleTitle, githubStats: { commits: member.github ? 120 : '--', repos: member.github ? 15 : '--' } }} />
                         </div>
                     )) : (
                         <div className="col-span-3 py-10 text-center text-zinc-500 border border-dashed border-white/5 rounded-xl">
                            No colleagues in this directory yet.
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default MemberDash;
