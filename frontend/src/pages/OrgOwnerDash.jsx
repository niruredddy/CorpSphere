import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FlipCard from '../components/FlipCard';
import NoticeBoard from '../components/NoticeBoard';
import ActivityFeed from '../components/ActivityFeed';
import TaskBoard from '../components/TaskBoard';
import { Search, Plus, Trash2, Copy, Check } from 'lucide-react';

const OrgOwnerDash = () => {
    const { getOrgDetails, getOrgMembers, user, addMemberToOrg, removeMember } = useAuth();
    const org = getOrgDetails(user.orgId);
    const members = getOrgMembers(user.orgId);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', email: '', roleTitle: '' });
    const [copied, setCopied] = useState(false);

    const filteredMembers = members.filter(m => {
        const mName = m.name || '';
        const mRole = m.roleTitle || '';
        return mName.toLowerCase().includes(searchQuery.toLowerCase()) || 
               mRole.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleAddMember = (e) => {
        e.preventDefault();
        addMemberToOrg(org.id, newMember);
        setShowAddForm(false);
        setNewMember({ name: '', email: '', roleTitle: '' });
    };

    const copyOrgId = () => {
        navigator.clipboard.writeText(org.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2">{org.name}</h1>
                    <p className="text-zinc-500">Manage directory, tasks, and organizational updates.</p>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] text-zinc-500 font-mono bg-white/5 px-3 py-1 rounded border border-white/10">{org.id}</span>
                        <button onClick={copyOrgId} className="p-1 rounded hover:bg-emerald-500/20 text-zinc-500 hover:text-emerald-500 transition-colors" title="Copy Org ID for members to join">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <span className="text-[10px] text-zinc-600">← Share this ID with new members</span>
                    </div>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary py-2 px-4 flex items-center gap-2">
                    <Plus size={16} /> Add Member
                </button>
            </div>

            {showAddForm && (
                <div className="glass-card p-6 border border-emerald-500/50">
                    <h3 className="text-lg font-bold mb-4">Register New Member</h3>
                    <form onSubmit={handleAddMember} className="flex gap-4">
                        <input required type="text" placeholder="Full Name" value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-emerald-500" />
                        <input required type="email" placeholder="Login Email" value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-emerald-500" />
                        <input required type="text" placeholder="Title/Role" value={newMember.roleTitle} onChange={(e) => setNewMember({...newMember, roleTitle: e.target.value})} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-emerald-500" />
                        <button type="submit" className="bg-emerald-500 text-black font-bold px-6 rounded-lg text-sm hover:bg-emerald-400">Create</button>
                    </form>
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Total Members</p>
                    <h2 className="text-5xl font-bold tracking-tighter">{members.length}</h2>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Org Velocity</p>
                    <h2 className="text-5xl font-bold tracking-tighter">{org.stats.velocity}</h2>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Created</p>
                    <h2 className="text-2xl font-bold tracking-tighter mt-2">{org.createdAt || 'Today'}</h2>
                </div>
            </div>

            {/* Task Board (Owner can manage) */}
            <TaskBoard canManage={true} />

            {/* Directory + Sidebar */}
            <div className="flex gap-8 mt-8">
                <div className="flex-[2]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Member Directory</h2>
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-64">
                            <Search size={14} className="text-zinc-500" />
                            <input type="text" placeholder="Search personnel..." className="bg-transparent border-none outline-none text-xs w-full text-zinc-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {filteredMembers.map(member => (
                            <div key={member.id} className="relative group">
                                <FlipCard member={{ ...member, role: member.roleTitle, githubStats: { commits: member.github ? 120 : '--', repos: member.github ? 15 : '--' } }} />
                                <button onClick={() => removeMember(member.id)} className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:bg-red-400 shadow-lg shadow-red-500/50">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    {filteredMembers.length === 0 && <p className="text-zinc-500 p-4 border border-dashed border-white/10 text-center rounded-lg">No members found. Use "Add Member" or share your Org ID.</p>}
                </div>
                
                <div className="flex-1 space-y-6">
                    <NoticeBoard />
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
};

export default OrgOwnerDash;
