import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

const Toast = () => {
    const { toast } = useAuth();

    if (!toast) return null;

    return (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border animate-[slideUp_0.3s_ease-out] ${
            toast.type === 'warning' 
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
            {toast.type === 'warning' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
            <span className="text-sm font-semibold">{toast.message}</span>
        </div>
    );
};

export default Toast;
