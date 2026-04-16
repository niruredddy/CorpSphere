import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const AuthGateway = () => {
    const { login, signupAdmin, signupOrgOwner, signupMember } = useAuth();
    const navigate = useNavigate();
    
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [role, setRole] = useState('MEMBER'); // 'SYSTEM_ADMIN', 'ORG_OWNER', 'MEMBER'
    const [error, setError] = useState(null);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [orgName, setOrgName] = useState('');
    const [orgId, setOrgId] = useState('');
    const [roleTitle, setRoleTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        
        if (mode === 'login') {
            const success = login(email, password, role);
            if (success) navigate('/dashboard');
            else setError('Invalid credentials.');
        } else {
            // Signup
            let res;
            if (role === 'SYSTEM_ADMIN') {
                res = signupAdmin(name, email, password);
            } else if (role === 'ORG_OWNER') {
                res = signupOrgOwner(name, email, password, orgName);
            } else {
                res = signupMember(name, email, password, orgId, roleTitle);
            }

            if (res.error) setError(res.error);
            else navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
            <ParticleBackground />
            <div className="glass-card w-full max-w-lg p-8 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tighter">CorpSphere</h1>
                    <p className="text-zinc-500 text-sm mt-2">Enterprise Access Gateway</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-lg mb-6">
                    <button onClick={() => setMode('login')} className={`flex-1 py-2 text-xs font-bold rounded ${mode === 'login' ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>LOGIN</button>
                    <button onClick={() => setMode('signup')} className={`flex-1 py-2 text-xs font-bold rounded ${mode === 'signup' ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>SIGN UP</button>
                </div>

                <div className="flex gap-2 mb-6">
                    {['MEMBER', 'ORG_OWNER', 'SYSTEM_ADMIN'].map(r => (
                        <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded border ${role === r ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-white/10 text-zinc-500'}`}>
                            {r.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <input required type="text" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500" />
                        </div>
                    )}
                    
                    {mode === 'signup' && role === 'ORG_OWNER' && (
                        <div>
                            <input required type="text" placeholder="Organization / Company Name" value={orgName} onChange={e=>setOrgName(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500" />
                        </div>
                    )}

                    {mode === 'signup' && role === 'MEMBER' && (
                        <>
                            <div>
                                <input required type="text" placeholder="Organization ID (provided by Owner)" value={orgId} onChange={e=>setOrgId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500" />
                            </div>
                            <div>
                                <input required type="text" placeholder="Professional Title (e.g. Engineer)" value={roleTitle} onChange={e=>setRoleTitle(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500" />
                            </div>
                        </>
                    )}

                    <div>
                        <input required type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500" />
                    </div>

                    <button type="submit" className="w-full btn-primary py-3 font-bold uppercase tracking-wider text-xs mt-6">
                        {mode === 'login' ? 'Authenticate' : 'Initialize Account'}
                    </button>
                </form>
            </div>
            {/* Background decors */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
    );
};

export default AuthGateway;
