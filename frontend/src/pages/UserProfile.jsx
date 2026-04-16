import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Code2, Save, Upload } from 'lucide-react';

const UserProfile = () => {
    const { user, updateUserProfile } = useAuth();
    
    const [formData, setFormData] = useState({
        name: user.name || '',
        roleTitle: user.roleTitle || '',
        avatar: user.avatar || '',
        github: user.github || '',
        bio: user.bio || '',
    });
    
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSaved(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result });
                setSaved(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserProfile(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-2">My Profile Configuration</h1>
                    <p className="text-zinc-500 text-sm">Manage your personal organizational identity and external links.</p>
                </div>
            </div>

            <div className="glass-card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-8 mb-8">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <img src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=10b981&color=fff`} className="w-24 h-24 rounded-full border-2 border-emerald-500/50 object-cover" alt="Profile" />
                            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload size={16} className="text-white mb-1"/>
                                <span className="text-[10px] uppercase font-bold text-white">Upload</span>
                            </div>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange}
                        />
                        <div className="flex-1">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Profile Image</p>
                            <p className="text-xs text-zinc-400">Click the avatar to upload a true image from your device.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Professional Title</label>
                            <input 
                                type="text" 
                                name="roleTitle"
                                value={formData.roleTitle}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                                readOnly={user.role === 'SYSTEM_ADMIN'} // Admins don't have titles
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 flex items-center gap-2">
                            <Code2 size={14} /> GitHub Username
                        </label>
                        <input 
                            type="text" 
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                            placeholder="username"
                        />
                         <p className="text-[10px] text-zinc-600 mt-2">Required for aggregating repository stats on your FlipCard.</p>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Professional Bio</label>
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-emerald-500 transition-colors resize-none"
                            placeholder="A brief summary of your expertise..."
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                        <span className="text-emerald-500 text-sm font-bold opacity-0 transition-opacity" style={{ opacity: saved ? 1 : 0 }}>
                            Successfully Updated ✔
                        </span>
                        <button type="submit" className="btn-primary py-2 px-6 flex items-center gap-2">
                            <Save size={16} /> Save Configuration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
