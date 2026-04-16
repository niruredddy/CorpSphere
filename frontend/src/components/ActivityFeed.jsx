import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const ActivityFeed = () => {
    const { getOrgActivities, user } = useAuth();
    const activities = getOrgActivities(user.orgId);

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                <Activity size={18} className="text-emerald-500" />
                Live Activity Feed
            </h3>
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                {activities.length === 0 ? (
                    <p className="text-xs text-zinc-600 text-center py-6 border border-dashed border-white/5 rounded-lg">No activity yet. Actions will appear here in real-time.</p>
                ) : (
                    activities.map(a => (
                        <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-pulse"></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-zinc-300 leading-relaxed">{a.action}</p>
                                <p className="text-[10px] text-zinc-600 font-mono mt-1">{a.time}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
