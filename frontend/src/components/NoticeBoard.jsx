import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pin, Plus, Hash } from 'lucide-react';

const NoticeBoard = () => {
    const { getOrgNotes, addNote, user } = useAuth();
    const notes = getOrgNotes(user.orgId);
    
    const [newNote, setNewNote] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const handlePost = (e) => {
        e.preventDefault();
        if (newNote.trim()) {
            addNote(user.orgId, newNote.trim());
            setNewNote('');
            setIsPosting(false);
        }
    };

    return (
        <div className="glass-card p-6 border-t-4 border-t-white/10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Pin size={18} className="text-emerald-500" />
                    Organization Notice Board
                </h3>
                {user.role === 'ORG_OWNER' && (
                    <button onClick={() => setIsPosting(!isPosting)} className="text-zinc-500 hover:text-emerald-500 transition-colors">
                        <Plus size={18} />
                    </button>
                )}
            </div>

            {isPosting && (
                <form onSubmit={handlePost} className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <textarea 
                        required
                        value={newNote}
                        onChange={(e)=>setNewNote(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded py-2 px-3 text-sm text-white focus:border-emerald-500 outline-none resize-none"
                        placeholder="Write a critical organization update..."
                        rows={3}
                    />
                    <div className="flex justify-end mt-2">
                        <button type="submit" className="px-4 py-1 text-xs font-bold bg-emerald-500 text-black rounded hover:bg-emerald-400">Post Notice</button>
                    </div>
                </form>
            )}

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {notes.length === 0 ? (
                    <p className="text-xs text-zinc-600 text-center py-4 border border-dashed border-white/5 rounded">No active notices.</p>
                ) : (
                    notes.map(note => (
                        <div key={note.id} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Hash size={12} className="text-emerald-500" />
                                <span className="text-[10px] text-zinc-500 font-mono uppercase">Update From: {note.author}</span>
                            </div>
                            <p className="text-sm text-zinc-300 font-medium mb-3">{note.content}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-zinc-600">{note.date}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(255,255,255,0.1);
                  border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default NoticeBoard;
