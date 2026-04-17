import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const AuthGateway = () => {
    const { login, signupAdmin, signupOrgOwner, signupMember, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    
    const [stage, setStage] = useState('role'); // 'role' or 'auth'
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [role, setRole] = useState(null); // 'SYSTEM_ADMIN', 'ORG_OWNER', 'MEMBER'
    const [error, setError] = useState(null);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [orgName, setOrgName] = useState('');
    const [orgId, setOrgId] = useState('');
    const [roleTitle, setRoleTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (mode === 'login') {
            const success = await login(email, password, role);
            if (success) navigate('/dashboard');
            else setError('Invalid credentials or role mismatch.');
        } else {
            // Signup
            let res;
            if (role === 'SYSTEM_ADMIN') {
                res = await signupAdmin(name, email, password);
            } else if (role === 'ORG_OWNER') {
                res = await signupOrgOwner(name, email, password, orgName);
            } else {
                res = await signupMember(name, email, password, orgId, roleTitle);
            }

            if (res.error) setError(res.error);
            else navigate('/dashboard');
        }
    };

    const handleGoogleLogin = async () => {
        const res = await loginWithGoogle();
        if (res.success) navigate('/dashboard');
    };

    const selectRole = (selectedRole) => {
        setRole(selectedRole);
        setStage('auth');
    };

    const goBack = () => {
        setStage('role');
        setError(null);
        setMode('login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
            <ParticleBackground />
            
            <div className="relative z-10 w-full max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3">CorpSphere</h1>
                    <p className="text-zinc-400 text-sm tracking-wide uppercase font-semibold">Enterprise Access Gateway</p>
                </div>

                {stage === 'role' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-[fadeIn_0.4s_ease-out]">
                        <div 
                            onClick={() => selectRole('MEMBER')}
                            className="glass-card p-6 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-center group"
                        >
                            <div className="w-12 h-12 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Team Member</h3>
                            <p className="text-xs text-zinc-500">Join an existing organization to collaborate and track progress.</p>
                        </div>
                        
                        <div 
                            onClick={() => selectRole('ORG_OWNER')}
                            className="glass-card p-6 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-center group"
                        >
                            <div className="w-12 h-12 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Organization Owner</h3>
                            <p className="text-xs text-zinc-500">Create and manage your organization's workspace and members.</p>
                        </div>
                        
                        <div 
                            onClick={() => selectRole('SYSTEM_ADMIN')}
                            className="glass-card p-6 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-center group"
                        >
                            <div className="w-12 h-12 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">System Admin</h3>
                            <p className="text-xs text-zinc-500">Manage platform-wide settings and organization deployments.</p>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card w-full max-w-md mx-auto p-8 animate-[fadeIn_0.4s_ease-out]">
                        <button onClick={goBack} className="flex items-center text-xs text-zinc-500 hover:text-white mb-6 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                            Change Role
                        </button>
                        
                        <div className="flex bg-white/5 p-1 rounded-lg mb-6">
                            <button onClick={() => setMode('login')} className={`flex-1 py-2 text-xs font-bold rounded ${mode === 'login' ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>LOGIN</button>
                            <button onClick={() => setMode('signup')} className={`flex-1 py-2 text-xs font-bold rounded ${mode === 'signup' ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>SIGN UP</button>
                        </div>

                        <div className="mb-6 text-center">
                            <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold">{role.replace('_', ' ')}</p>
                        </div>

                        {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs text-center">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'signup' && (
                                <div>
                                    <input required type="text" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500 transition-colors" />
                                </div>
                            )}
                            
                            {mode === 'signup' && role === 'ORG_OWNER' && (
                                <div>
                                    <input required type="text" placeholder="Organization / Company Name" value={orgName} onChange={e=>setOrgName(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500 transition-colors" />
                                </div>
                            )}

                            {mode === 'signup' && role === 'MEMBER' && (
                                <>
                                    <div>
                                        <input required type="text" placeholder="Organization ID (provided by Owner)" value={orgId} onChange={e=>setOrgId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500 transition-colors" />
                                    </div>
                                    <div>
                                        <input required type="text" placeholder="Professional Title (e.g. Engineer)" value={roleTitle} onChange={e=>setRoleTitle(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500 transition-colors" />
                                    </div>
                                </>
                            )}

                            <div>
                                <input required type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500 transition-colors" />
                            </div>
                            <div>
                                <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-sm outline-none focus:border-emerald-500 transition-colors" />
                            </div>

                            <button type="submit" className="w-full btn-primary py-3 font-bold uppercase tracking-wider text-xs mt-6">
                                {mode === 'login' ? 'Authenticate' : 'Initialize Account'}
                            </button>
                            
                            <div className="flex items-center justify-center space-x-2 my-4">
                                <div className="h-px bg-white/10 w-full"></div>
                                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">OR</span>
                                <div className="h-px bg-white/10 w-full"></div>
                            </div>

                            <button 
                                type="button" 
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors text-white font-bold uppercase tracking-wider text-xs"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Background decors */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
    );
};

export default AuthGateway;

