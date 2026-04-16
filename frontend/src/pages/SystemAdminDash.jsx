import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Database, Server, Building, Trash2 } from 'lucide-react';

const SystemAdminDash = () => {
    const { getAllOrgs, db, addOrg, removeOrg } = useAuth();
    const orgs = getAllOrgs();

    const [showAddForm, setShowAddForm] = useState(false);
    const [newOrgName, setNewOrgName] = useState('');

    const handleAddOrg = (e) => {
        e.preventDefault();
        addOrg({ name: newOrgName });
        setShowAddForm(false);
        setNewOrgName('');
    };

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Global Overseer</h1>
                    <p className="text-zinc-500">System architecture health and full tenant lifecycle management.</p>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary py-2 px-4 flex items-center gap-2">
                    <Building size={16} /> Provision Tenant
                </button>
            </div>

            {/* Add Org Form UI */}
            {showAddForm && (
                <div className="glass-card p-6 mb-8 border border-emerald-500/50">
                    <h3 className="text-lg font-bold mb-4">Provision New Organization Container</h3>
                    <form onSubmit={handleAddOrg} className="flex gap-4">
                        <input 
                            required type="text" placeholder="Organization/Company Name" 
                            value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)}
                            className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-4 text-sm outline-none focus:border-emerald-500"
                        />
                        <button type="submit" className="bg-emerald-500 text-black font-bold px-6 rounded-lg text-sm hover:bg-emerald-400">
                            Initialize Container
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1 flex items-center gap-2"><Database size={14}/> Active Tenants</p>
                    <div className="flex items-baseline gap-2 mt-2">
                        <h2 className="text-5xl font-bold tracking-tighter">{orgs.length}</h2>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-zinc-700">
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1 flex items-center gap-2"><Server size={14}/> Node Health</p>
                    <div className="flex items-baseline gap-2 mt-2">
                        <h2 className="text-5xl font-bold tracking-tighter text-emerald-500">99.9%</h2>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-zinc-700">
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1 flex items-center gap-2">Total Managed Identities</p>
                    <div className="flex items-baseline gap-2 mt-2">
                        <h2 className="text-5xl font-bold tracking-tighter">{db.users.length}</h2>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tighter text-white mt-10 mb-6 border-b border-white/10 pb-4">Tenant Management Array</h2>
            <div className="grid grid-cols-2 gap-6">
                 {orgs.map(org => {
                     const members = db.users.filter(u => u.orgId === org.id);
                     return (
                         <div key={org.id} className="glass-card p-6 border border-white/5 relative group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <img src={org.logo} alt={org.name} className="w-12 h-12 rounded border border-white/10" />
                                    <div>
                                        <h3 className="text-xl font-bold">{org.name}</h3>
                                        <span className="text-xs text-zinc-500 font-mono">Tenant ID: {org.id}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeOrg(org.id)}
                                    className="p-2 bg-red-500/10 rounded-lg cursor-pointer hover:bg-red-500 text-red-500 hover:text-white transition-colors"
                                    title="Decommission Tenant"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex gap-4 border-t border-white/5 pt-4">
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Base Velocity</p>
                                    <p className="font-bold text-emerald-400">{org.stats.velocity || 100}</p>
                                </div>
                                <div className="w-[1px] bg-white/5"></div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Registered Nodes (Users)</p>
                                    <p className="font-bold">{members.length}</p>
                                </div>
                            </div>
                         </div>
                     );
                 })}
            </div>
        </div>
    );
};

export default SystemAdminDash;
