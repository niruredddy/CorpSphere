import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FlipCard from '../components/FlipCard';
import NoticeBoard from '../components/NoticeBoard';
import TaskBoard from '../components/TaskBoard';
import { Search, Activity, GitCommit, GitPullRequest } from 'lucide-react';

const MemberDash = () => {
    const { getOrgDetails, getOrgMembers, user, updateProgress } = useAuth();
    const org = getOrgDetails(user.orgId);
    const members = getOrgMembers(user.orgId);
    const [searchQuery, setSearchQuery] = useState("");
    const [progressInput, setProgressInput] = useState(user.progress || 0);

    const filteredMembers = members.filter(m => 
        (m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.roleTitle?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        m.id !== user.id
    );

    const handleUpdateProgress = () => {
        updateProgress(parseInt(progressInput));
    };

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="border-b border-white/5 pb-8">
                <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Welcome, {user.name.split(' ')[0]}</h1>
                <p className="text-zinc-500">Your personal workspace within <span className="text-emerald-500 font-semibold">{org.name}</span></p>
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
                     <button onClick={handleUpdateProgress} className="w-full py-2 bg-zinc-800 hover:bg-emerald-500 text-white rounded font-bold transition-colors text-sm">Sync Data</button>
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

            {/* Task Board (Members can move tasks but not create/delete) */}
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
