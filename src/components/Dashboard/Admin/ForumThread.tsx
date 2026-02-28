import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../../context/ToastContext';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown,
  MessageCircle, 
  Share2, 
  MoreVertical, 
  Send,
  Clock,
  User,
  CheckCircle2,
  Flag,
  Reply,
  X,
  Trash2
} from 'lucide-react';
import { forumsStorage } from '../../../utils/storage';

const initialTopics = [
  {
    id: 1,
    title: 'How to start a career in AI as a high school student?',
    content: 'I\'m currently in my junior year of high school and I\'m really fascinated by Artificial Intelligence. I\'ve done some basic Python programming, but I\'m not sure what the next steps should be. \n\nShould I focus on specific math courses? Are there any online certifications that are actually respected by universities or employers? I\'d love to hear from anyone who has taken this path or is currently working in the field!',
    author: 'Alex Chen',
    authorRole: 'Student',
    authorImage: 'https://picsum.photos/seed/alex/100/100',
    category: 'Career Advice',
    replies: [
      {
        id: 101,
        author: 'Dr. Sarah Johnson',
        authorRole: 'AI Researcher',
        authorImage: 'https://picsum.photos/seed/sarah/100/100',
        isVerified: true,
        content: 'Great question, Alex! AI is a fantastic field to get into. At your stage, the most important thing is building a strong foundation in Mathematics—specifically Linear Algebra and Calculus. For programming, keep going with Python but start looking into libraries like NumPy and Pandas. Fast.ai has some great free courses that are very accessible.',
        time: '1 hour ago',
        likes: 15,
        dislikes: 2,
        replies: []
      }
    ],
    views: 156,
    likes: 42,
    dislikes: 1,
    time: '2 hours ago'
  }
];

export default function AdminForumThread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [replyText, setReplyText] = useState('');
  const [thread, setThread] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'topic' | 'reply', id: number } | null>(null);

  useEffect(() => {
    const storedTopics = forumsStorage.get(initialTopics);
    const found = storedTopics.find((t: any) => t.id.toString() === id);
    if (found) {
      setThread({
        ...found,
        replies: Array.isArray(found.replies) ? found.replies : []
      });
    }
  }, [id]);

  const updateThreadPersistence = (updatedThread: any) => {
    setThread(updatedThread);
    const storedTopics = forumsStorage.get(initialTopics);
    const updatedTopics = storedTopics.map((t: any) => t.id.toString() === id ? updatedThread : t);
    forumsStorage.save(updatedTopics);
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !thread) return;
    
    const newReply = {
      id: Date.now(),
      author: 'Bolu Ahmed',
      authorRole: 'Super Admin',
      authorImage: 'https://picsum.photos/seed/admin/100/100',
      isVerified: true,
      content: replyingTo ? `@${replyingTo.author} ${replyText}` : replyText,
      time: 'Just now',
      likes: 0,
      dislikes: 0,
      replies: []
    };

    let updatedThread;
    if (replyingTo) {
      updatedThread = {
        ...thread,
        replies: thread.replies.map((r: any) => 
          r.id === replyingTo.id 
            ? { ...r, replies: [...(r.replies || []), newReply] }
            : r
        )
      };
    } else {
      updatedThread = {
        ...thread,
        replies: [...thread.replies, newReply]
      };
    }

    updateThreadPersistence(updatedThread);
    setReplyText('');
    setReplyingTo(null);
    showToast('Reply posted as Admin');
  };

  const handleDelete = () => {
    if (!itemToDelete || !thread) return;

    if (itemToDelete.type === 'topic') {
      const storedTopics = forumsStorage.get(initialTopics);
      const updatedTopics = storedTopics.filter((t: any) => t.id.toString() !== id);
      forumsStorage.save(updatedTopics);
      showToast('Topic deleted');
      navigate('/admin/forum');
    } else {
      const deleteFromReplies = (replies: any[]): any[] => {
        return replies.filter(r => r.id !== itemToDelete.id).map(r => ({
          ...r,
          replies: r.replies ? deleteFromReplies(r.replies) : []
        }));
      };
      const updatedThread = {
        ...thread,
        replies: deleteFromReplies(thread.replies)
      };
      updateThreadPersistence(updatedThread);
      showToast('Reply deleted');
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  if (!thread) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-3 text-slate-400 font-black hover:text-brand transition-all"
      >
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all shadow-sm">
          <ArrowLeft className="w-6 h-6" />
        </div>
        Back
      </button>

      {/* Main Post */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 sm:p-12">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <img src={thread.authorImage} alt={thread.author} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-50 shadow-sm" />
              <div>
                <h4 className="text-lg font-black text-slate-900">{thread.author}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{thread.authorRole} • {thread.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setItemToDelete({ type: 'topic', id: thread.id }); setIsDeleteModalOpen(true); }}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <span className="px-4 py-2 bg-brand/5 text-brand rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand/10">
              {thread.category}
            </span>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              {thread.title}
            </h1>
            <p className="text-slate-600 font-bold text-lg leading-relaxed whitespace-pre-wrap">
              {thread.content}
            </p>
          </div>

          <div className="flex items-center gap-8 mt-10 pt-8 border-t border-slate-50 text-slate-400 text-sm font-black">
            <div className="flex items-center gap-2.5">
              <ThumbsUp className="w-5 h-5" /> {thread.likes}
            </div>
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-5 h-5" /> {thread.replies.length} Replies
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black text-slate-900 px-6">Replies</h3>
        <div className="space-y-6">
          {thread.replies.map((reply: any) => (
            <div key={reply.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-start gap-5">
                <img src={reply.authorImage} alt={reply.author} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-50" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-black text-slate-900">{reply.author}</h5>
                        {reply.isVerified && <CheckCircle2 className="w-4 h-4 text-brand" />}
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{reply.authorRole} • {reply.time}</p>
                    </div>
                    <button 
                      onClick={() => { setItemToDelete({ type: 'reply', id: reply.id }); setIsDeleteModalOpen(true); }}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-slate-600 font-bold leading-relaxed">
                    {reply.content}
                  </p>
                  <div className="flex items-center gap-4 mt-5">
                    <button 
                      onClick={() => setReplyingTo(reply)}
                      className="flex items-center gap-2 text-xs font-black text-brand hover:underline"
                    >
                      <Reply className="w-4 h-4" /> Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Nested Replies */}
              {reply.replies?.length > 0 && (
                <div className="mt-6 ml-12 space-y-4 border-l-4 border-slate-50 pl-8">
                  {reply.replies.map((nested: any) => (
                    <div key={nested.id} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                      <div className="flex items-start gap-4">
                        <img src={nested.authorImage} alt={nested.author} className="w-10 h-10 rounded-xl object-cover border-2 border-white" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h5 className="font-black text-slate-900 text-sm">{nested.author}</h5>
                              {nested.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-brand" />}
                            </div>
                            <button 
                              onClick={() => { setItemToDelete({ type: 'reply', id: nested.id }); setIsDeleteModalOpen(true); }}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-slate-600 font-bold text-sm leading-relaxed">
                            {nested.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reply Input */}
      <div className="sticky bottom-10 z-50">
        <form 
          onSubmit={handleReply}
          className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-2xl flex items-center gap-4"
        >
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder={replyingTo ? `Replying to ${replyingTo.author}...` : "Post an official admin reply..."}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-8 py-4 outline-none focus:ring-4 focus:ring-brand/10 font-bold text-slate-700"
            />
            {replyingTo && (
              <button 
                onClick={() => setReplyingTo(null)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-all"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
          <button 
            type="submit"
            disabled={!replyText.trim()}
            className="p-4 bg-brand text-white rounded-2xl shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[48px] shadow-2xl p-12 text-center"
            >
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trash2 className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Delete {itemToDelete?.type === 'topic' ? 'Topic' : 'Reply'}?</h2>
              <p className="text-slate-500 font-bold mb-10 leading-relaxed">
                Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone and will be removed permanently.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete} 
                  className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-200 hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
