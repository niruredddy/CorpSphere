import React, { useState, useEffect } from 'react';
import { Code2, Share2, Briefcase, ExternalLink, GitBranch } from 'lucide-react';

const FlipCard = ({ member }) => {
  const [realStats, setRealStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member.github) {
      setLoading(true);
      fetch(`https://api.github.com/users/${member.github}`)
        .then(res => res.json())
        .then(data => {
            if (data.login) {
                setRealStats({ repos: data.public_repos, followers: data.followers });
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Failed to fetch Github stats", err);
            setLoading(false);
        });
    }
  }, [member.github]);

  const displayRepos = realStats ? realStats.repos : (member.githubStats?.repos || '--');
  const displayFollowers = realStats ? realStats.followers : (member.githubStats?.commits || '--'); // Using commits slot for followers if no real data

  return (
    <div className="card-container">
      <div className="card-inner">
        {/* Front of the Card */}
        <div className="card-front glass-card">
          <img 
            src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=10b981&color=fff`} 
            alt={member.name} 
            className="profile-image"
          />
          <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
          <p className="text-emerald-500 font-medium text-sm mb-4 uppercase tracking-wider">{member.role || member.roleTitle || 'Member'}</p>
          <div className="mt-auto w-full">
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: `${member.progress || 0}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-mono">
                <span>PROJECT PROGRESS</span>
                <span>{member.progress || 0}%</span>
            </div>
          </div>
        </div>

        {/* Back of the Card */}
        <div className="card-back glass-card">
          <h3 className="text-lg font-semibold text-white mb-2 underline decoration-emerald-500 decoration-2 underline-offset-4">Professional Bio</h3>
          <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
            {member.bio || "Leading innovation through scalable solutions and architectural excellence in the digital ecosystem."}
          </p>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <div className="text-left p-2 rounded bg-white/5 border border-white/5">
                <p className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                    <GitBranch size={10}/> {member.github ? 'Real Repos' : 'Repos'}
                </p>
                <p className="text-emerald-400 font-bold">{loading ? '...' : displayRepos}</p>
            </div>
            <div className="text-left p-2 rounded bg-white/5 border border-white/5">
                <p className="text-[10px] text-zinc-500 uppercase">Followers</p>
                <p className="text-emerald-400 font-bold">{loading ? '...' : displayFollowers}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            {member.github && (
                <a href={`https://github.com/${member.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-zinc-800 hover:bg-emerald-500 transition-colors text-white" title="View GitHub">
                  <GitBranch size={18} />
                </a>
            )}
            <a href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-emerald-500 transition-colors text-white">
              <Share2 size={18} />
            </a>
            <a href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-emerald-500 transition-colors text-white">
              <Briefcase size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
