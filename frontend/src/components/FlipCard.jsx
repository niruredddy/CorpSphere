import React from 'react';
import { Code2, Share2, Briefcase, ExternalLink } from 'lucide-react';

const FlipCard = ({ member }) => {
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
          <p className="text-emerald-500 font-medium text-sm mb-4 uppercase tracking-wider">{member.role}</p>
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
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            {member.bio || "Leading innovation through scalable solutions and architectural excellence in the digital ecosystem."}
          </p>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <div className="text-left p-2 rounded bg-white/5">
                <p className="text-[10px] text-zinc-500 uppercase">Commits</p>
                <p className="text-emerald-400 font-bold">{member.githubStats?.commits || '--'}</p>
            </div>
            <div className="text-left p-2 rounded bg-white/5">
                <p className="text-[10px] text-zinc-500 uppercase">Repos</p>
                <p className="text-emerald-400 font-bold">{member.githubStats?.repos || '--'}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <a href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-emerald-500 transition-colors text-white">
              <Code2 size={18} />
            </a>
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
