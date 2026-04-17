import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut, Code2, UserCircle } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout, getOrgDetails } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const org = user?.orgId ? getOrgDetails(user.orgId) : null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden">
            <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-black border border-emerald-400">CS</div>
                    <span className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-white">CorpSphere</span>
                </div>

                <nav className="flex-1 px-4 mt-4 space-y-1">
                    <div className="text-[10px] text-zinc-500 uppercase px-3 mb-4 tracking-widest font-bold">Main Menu</div>
                    <div 
                        onClick={() => navigate('/dashboard')}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all ${location.pathname === '/dashboard' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium text-sm">Dashboard</span>
                    </div>

                    <div 
                        onClick={() => navigate('/dashboard/profile')}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all ${location.pathname === '/dashboard/profile' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
                    >
                        <UserCircle size={20} />
                        <span className="font-medium text-sm">My Profile</span>
                    </div>
                </nav>

                <div className="p-6 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <img src={user?.avatar} className="w-10 h-10 rounded-full border border-zinc-800" alt="User" />
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate text-white">{user?.name}</p>
                            <p className="text-[10px] text-emerald-500 font-mono truncate uppercase">{user?.role?.replace('_', ' ') || 'MEMBER'}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 text-zinc-400 font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
                   <div className="text-zinc-500 font-mono text-xs">
                        {org ? `Connected to: ${org.name} Node` : 'System Architecture Layer'}
                   </div>
                   {org && (
                       <div className="flex items-center gap-4">
                           <button 
                               onClick={() => window.open(`https://meet.jit.si/CorpSphere_${org.id}`, '_blank')}
                               className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-4 py-1.5 rounded-lg hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors"
                           >
                               <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                               </span>
                               <span className="text-xs font-bold text-white uppercase tracking-wider">Join Meeting</span>
                           </button>
                           
                           <div className="h-4 w-px bg-white/10"></div>
                           
                           <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                               <img src={org.logo} alt="Org Logo" className="w-5 h-5 rounded" />
                               <span className="text-xs font-bold text-emerald-500">{org.name}</span>
                           </div>
                       </div>
                   )}
                </header>
                
                <div className="flex-1 overflow-y-auto p-8 relative">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
