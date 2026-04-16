import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, LayoutDashboard, Users, MessageSquare, BarChart3, Plus, Hash } from 'lucide-react';
import FlipCard from './FlipCard';
import axios from 'axios';

const ORG_DATA = {
  "org_a": {
    name: "Cyberdyne Systems",
    logo: "https://via.placeholder.com/40/10b981/ffffff?text=C",
    stats: { velocity: 94.2, growth: 87.4, activeProjects: 142 },
    members: [
      { id: 1, name: "Marcus Thorne", role: "Principal Strategist", progress: 88, github: "marcus", bio: "Orchestrating high-impact digital ecosystems with a focus on architectural integrity." },
      { id: 2, name: "Elena Rodriguez", role: "Lead Systems Architect", progress: 75, github: "elena", bio: "Designing resilient cloud native infrastructures for global scale operations." },
      { id: 3, name: "Sarah Chen", role: "UX Director", progress: 92, github: "sarah", bio: "Crafting intuitive human-machine interfaces that bridge complexity and simplicity." }
    ],
    discussions: [
        { id: 1, author: "Marcus Thorne", content: "Architecture review for the new edge gateway is complete.", time: "2h ago" },
        { id: 2, author: "Sarah Chen", content: "User testing results for the dashboard are in. Looking good!", time: "5h ago" }
    ]
  },
  "org_b": {
    name: "Wayne Enterprises",
    logo: "https://via.placeholder.com/40/10b981/ffffff?text=W",
    stats: { velocity: 82.5, growth: 91.2, activeProjects: 88 },
    members: [
      { id: 4, name: "Bruce Wayne", role: "CEO", progress: 100, github: "bruce", bio: "Visionary leadership dedicated to philanthropy and technological advancement." },
      { id: 5, name: "Lucius Fox", role: "Head of R&D", progress: 95, github: "lucius", bio: "Engineering the future through experimental applied sciences and security." }
    ],
    discussions: [
        { id: 3, author: "Lucius Fox", content: "The new tactical suit prototype is ready for field testing.", time: "1h ago" }
    ]
  }
};

const Dashboard = () => {
  const [activeOrg, setActiveOrg] = useState("org_a");
  const [data, setData] = useState(ORG_DATA["org_a"]);
  const [githubStats, setGithubStats] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Simulated GitHub API Integration
  useEffect(() => {
    const fetchGithubData = async () => {
        // In a real app, you'd call actual endpoints
        // Here we mock the result of real-time fetching
        const mockStats = {};
        data.members.forEach(member => {
            mockStats[member.id] = {
                commits: Math.floor(Math.random() * 500) + 100,
                repos: Math.floor(Math.random() * 50) + 10
            };
        });
        setGithubStats(mockStats);
    };

    fetchGithubData();
  }, [data]);

  const changeOrg = (orgId) => {
    setActiveOrg(orgId);
    setData(ORG_DATA[orgId]);
  };

  const filteredMembers = data.members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold">C</div>
          <span className="text-xl font-bold tracking-tighter">CorpSphere</span>
        </div>

        <nav className="flex-1 px-4 mt-4">
          <div className="text-[10px] text-zinc-500 uppercase px-3 mb-4 tracking-widest font-bold">Main Menu</div>
          {[
            { icon: LayoutDashboard, label: "Overview", active: true },
            { icon: Users, label: "Directory", active: false },
            { icon: MessageSquare, label: "Discussions", active: false },
            { icon: BarChart3, label: "Analytics", active: false }
          ].map((item, idx) => (
            <div key={idx} className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all ${item.active ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-500 hover:bg-white/5'}`}>
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}

          <div className="text-[10px] text-zinc-500 uppercase px-3 mt-10 mb-4 tracking-widest font-bold">Organizations</div>
          <div className="space-y-2">
            <div 
                onClick={() => changeOrg("org_a")}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${activeOrg === "org_a" ? 'border border-emerald-500/50 bg-emerald-500/5' : 'text-zinc-500 hover:bg-white/5'}`}
            >
                <div className="w-6 h-6 rounded bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">C</div>
                <span>Cyberdyne</span>
            </div>
            <div 
                onClick={() => changeOrg("org_b")}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${activeOrg === "org_b" ? 'border border-emerald-500/50 bg-emerald-500/5' : 'text-zinc-500 hover:bg-white/5'}`}
            >
                <div className="w-6 h-6 rounded bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">W</div>
                <span>Wayne Ent.</span>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <img src="https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff" className="w-8 h-8 rounded-full" alt="User" />
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">System Admin</p>
                <p className="text-xs text-zinc-500 truncate">admin@corpsphere.io</p>
            </div>
            <Settings size={16} className="text-zinc-500" />
          </div>
          <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg text-sm transition-colors">
            Invite Members
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-96">
            <Search size={16} className="text-zinc-500" />
            <input 
                type="text" 
                placeholder="Search resources, members, projects..." 
                className="bg-transparent border-none outline-none text-sm w-full text-zinc-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
                <Bell size={20} className="text-zinc-400" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#050505]"></div>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-2">
                <img src={data.logo} className="w-6 h-6 rounded" alt="Org Logo" />
                <span className="text-sm font-semibold text-emerald-500">{data.name}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
            {/* Hero Stats */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Velocity Score</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold tracking-tighter">{data.stats.velocity}</h2>
                        <span className="text-emerald-500 text-sm font-bold">+2.4%</span>
                    </div>
                    <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${data.stats.velocity}%` }}></div>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Completion Rate</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold tracking-tighter">{data.stats.growth}%</h2>
                        <span className="text-emerald-500 text-sm font-bold">Optimal</span>
                    </div>
                    <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${data.stats.growth}%` }}></div>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Active Projects</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold tracking-tighter">{data.stats.activeProjects}</h2>
                        <span className="text-zinc-600 font-mono text-xs ml-2">LIVE FEED</span>
                    </div>
                    <div className="mt-4 flex gap-1">
                        {[1,2,3,4,5,6].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>)}
                    </div>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Directory Section */}
                <div className="flex-[2]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Member Directory</h2>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs rounded-full border border-emerald-500/20">All</span>
                            <span className="px-3 py-1 bg-white/5 text-zinc-500 text-xs rounded-full cursor-pointer hover:bg-white/10">Leadership</span>
                            <span className="px-3 py-1 bg-white/5 text-zinc-500 text-xs rounded-full cursor-pointer hover:bg-white/10">Engineering</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {filteredMembers.map(member => (
                            <FlipCard 
                                key={member.id} 
                                member={{
                                    ...member,
                                    githubStats: githubStats[member.id]
                                }} 
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="flex-1 space-y-8">
                    {/* Discussion Board */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <MessageSquare size={18} className="text-emerald-500" />
                                Discussion Hub
                            </h3>
                            <Plus size={16} className="text-zinc-500 cursor-pointer" />
                        </div>
                        <div className="space-y-4">
                            {data.discussions.map(post => (
                                <div key={post.id} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Hash size={12} className="text-emerald-500" />
                                        <span className="text-[10px] text-zinc-500 font-mono uppercase">Internal Channel</span>
                                    </div>
                                    <p className="text-sm text-zinc-300 font-medium mb-2">{post.content}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-emerald-500/70">{post.author}</span>
                                        <span className="text-[10px] text-zinc-600">{post.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 border border-white/10 rounded-lg text-xs font-bold text-zinc-400 hover:bg-white/5 transition-all">
                            View All Hubs
                        </button>
                    </div>

                    {/* Project Tracker */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <BarChart3 size={18} className="text-emerald-500" />
                            Project Velocity
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold">Edge Gateway Alpha</span>
                                    <span className="text-xs text-emerald-500 font-bold">84%</span>
                                </div>
                                <div className="h-1 bg-zinc-800 rounded-full">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold">UI Design System</span>
                                    <span className="text-xs text-emerald-500 font-bold">62%</span>
                                </div>
                                <div className="h-1 bg-zinc-800 rounded-full">
                                    <div className="h-full bg-white/20 rounded-full" style={{ width: '62%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
