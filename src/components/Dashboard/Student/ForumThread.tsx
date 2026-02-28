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
  X
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
      },
      {
        id: 102,
        author: 'Marcus Thorne',
        authorRole: 'Senior Software Engineer',
        authorImage: 'https://picsum.photos/seed/marcus/100/100',
        isVerified: true,
        content: 'I second the math advice. Also, try building small projects. A simple chatbot or a basic image classifier using pre-trained models can teach you a lot about the workflow. Don\'t worry too much about certifications yet; your portfolio of projects will speak much louder!',
        time: '45 mins ago',
        likes: 8,
        dislikes: 0,
        replies: []
      }
    ],
    views: 156,
    likes: 42,
    dislikes: 1,
    time: '2 hours ago'
  }
];

export default function ForumThread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [thread, setThread] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);

  useEffect(() => {
    const storedTopics = forumsStorage.get(initialTopics);
    const found = storedTopics.find((t: any) => t.id.toString() === id);
    if (found) {
      // Ensure replies is an array for robust rendering
      const sanitizedThread = {
        ...found,
        replies: Array.isArray(found.replies) ? found.replies : []
      };
      setThread(sanitizedThread);
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
      authorRole: 'Student',
      authorImage: 'https://picsum.photos/seed/bolu/100/100',
      isVerified: false,
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
    showToast('Reply posted successfully!');
  };

  const handleLikeReply = (replyId: number) => {
    if (!thread) return;
    const updateReplies = (replies: any[]) => {
      return replies.map(r => {
        if (r.id === replyId) return { ...r, likes: r.likes + 1 };
        if (r.replies?.length > 0) return { ...r, replies: updateReplies(r.replies) };
        return r;
      });
    };
    updateThreadPersistence({ ...thread, replies: updateReplies(thread.replies) });
  };

  const handleDislikeReply = (replyId: number) => {
    if (!thread) return;
    const updateReplies = (replies: any[]) => {
      return replies.map(r => {
        if (r.id === replyId) return { ...r, dislikes: (r.dislikes || 0) + 1 };
        if (r.replies?.length > 0) return { ...r, replies: updateReplies(r.replies) };
        return r;
      });
    };
    updateThreadPersistence({ ...thread, replies: updateReplies(thread.replies) });
  };

  const handleLikePost = () => {
    if (!thread) return;
    let newLikes = thread.likes;
    let newDislikes = thread.dislikes || 0;
    let newIsLiked = !isLiked;
    let newIsDisliked = isDisliked;

    if (newIsLiked) {
      newLikes += 1;
      if (isDisliked) {
        newDislikes -= 1;
        newIsDisliked = false;
      }
    } else {
      newLikes -= 1;
    }

    setIsLiked(newIsLiked);
    setIsDisliked(newIsDisliked);

    const updatedThread = { ...thread, likes: newLikes, dislikes: newDislikes };
    updateThreadPersistence(updatedThread);
  };

  const handleDislikePost = () => {
    if (!thread) return;
    let newLikes = thread.likes;
    let newDislikes = thread.dislikes || 0;
    let newIsLiked = isLiked;
    let newIsDisliked = !isDisliked;

    if (newIsDisliked) {
      newDislikes += 1;
      if (isLiked) {
        newLikes -= 1;
        newIsLiked = false;
      }
    } else {
      newDislikes -= 1;
    }

    setIsLiked(newIsLiked);
    setIsDisliked(newIsDisliked);

    const updatedThread = { ...thread, likes: newLikes, dislikes: newDislikes };
    updateThreadPersistence(updatedThread);
  };

  if (!thread) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-brand/10 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Navigation */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="group flex items-center gap-3 text-slate-400 font-black hover:text-brand transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </div>
        Back to Community
      </motion.button>

      {/* Main Post */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
      >
        <div className="p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img src={thread.authorImage} alt={thread.author} className="w-16 h-16 rounded-[24px] object-cover border-4 border-slate-50 shadow-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">{thread.author}</h4>
                <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <span className="text-brand">{thread.authorRole || 'Student'}</span>
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  <span>{thread.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 bg-brand/5 text-brand rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                {thread.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              {thread.title}
            </h1>
            <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-lg sm:text-xl">
              {thread.content}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-12 pt-10 border-t border-slate-50">
            <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl gap-1">
              <button 
                onClick={handleLikePost}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm transition-all ${
                  isLiked ? 'bg-white text-brand shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-brand' : ''}`} /> {thread.likes}
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1" />
              <button 
                onClick={handleDislikePost}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm transition-all ${
                  isDisliked ? 'bg-white text-red-500 shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-red-500' : ''}`} /> {thread.dislikes || 0}
              </button>
            </div>
            
            <div className="flex items-center gap-2 px-5 py-3.5 bg-slate-50 rounded-2xl text-slate-500 font-black text-sm">
              <MessageCircle className="w-5 h-5 text-brand" /> {thread.replies.length} Replies
            </div>
            
            <div className="flex items-center gap-2 px-5 py-3.5 bg-slate-50 rounded-2xl text-slate-500 font-black text-sm ml-auto">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Verified Discussion
            </div>
          </div>
        </div>
      </motion.div>

      {/* Replies Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-2xl font-black text-slate-900">Community Thoughts</h3>
          <div className="text-sm font-bold text-slate-400">Sort by: <span className="text-brand cursor-pointer">Most Helpful</span></div>
        </div>
        
        <div className="space-y-6">
          {thread.replies.map((reply: any, index: number) => (
            <div key={reply.id} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-5">
                  <img src={reply.authorImage} alt={reply.author} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-50 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-slate-900">{reply.author}</h5>
                          {reply.isVerified && <CheckCircle2 className="w-4 h-4 text-brand fill-brand/10" />}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{reply.authorRole} • {reply.time}</p>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-red-400 transition-colors">
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed text-lg">
                      {reply.content}
                    </p>
                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleLikeReply(reply.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs text-slate-400 hover:text-brand hover:bg-brand/5 transition-all"
                        >
                          <ThumbsUp className="w-4 h-4" /> {reply.likes}
                        </button>
                        <button 
                          onClick={() => handleDislikeReply(reply.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <ThumbsDown className="w-4 h-4" /> {reply.dislikes || 0}
                        </button>
                      </div>
                      <button 
                        onClick={() => {
                          setReplyingTo(reply);
                          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl font-black text-xs hover:bg-brand hover:text-white transition-all"
                      >
                        <Reply className="w-4 h-4" /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Nested Replies */}
              {reply.replies && reply.replies.length > 0 && (
                <div className="ml-8 sm:ml-16 space-y-4 border-l-4 border-slate-100 pl-6 sm:pl-10">
                  {reply.replies.map((nested: any) => (
                    <motion.div
                      key={nested.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100"
                    >
                      <div className="flex items-start gap-4">
                        <img src={nested.authorImage} alt={nested.author} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-black text-slate-900 text-sm">{nested.author}</h5>
                                {nested.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-brand fill-brand/10" />}
                              </div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{nested.authorRole} • {nested.time}</p>
                            </div>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed text-sm">
                            {nested.content}
                          </p>
                          <div className="flex items-center gap-4 mt-4">
                            <button 
                              onClick={() => handleLikeReply(nested.id)}
                              className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-brand transition-all"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" /> {nested.likes}
                            </button>
                            <button 
                              onClick={() => handleDislikeReply(nested.id)}
                              className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-red-500 transition-all"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" /> {nested.dislikes || 0}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reply Input */}
      <div className="sticky bottom-8 z-50 px-4">
        <AnimatePresence>
          {replyingTo && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-brand text-white px-8 py-3 rounded-t-[32px] flex items-center justify-between mb-[-1px] relative z-0 shadow-lg"
            >
              <p className="text-xs font-black uppercase tracking-widest">Replying to {replyingTo.author}</p>
              <button onClick={() => setReplyingTo(null)} className="hover:scale-110 transition-transform">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <form 
          onSubmit={handleReply}
          className="bg-white p-4 rounded-[40px] border-2 border-slate-100 shadow-2xl flex items-center gap-4 relative z-10"
        >
          <img src="https://picsum.photos/seed/bolu/100/100" alt="Me" className="w-12 h-12 rounded-2xl object-cover hidden sm:block border-2 border-slate-50" />
          <input 
            type="text" 
            placeholder={replyingTo ? `Write your reply to ${replyingTo.author}...` : "Share your thoughts..."}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-slate-50 border-none rounded-[24px] px-8 py-4 outline-none focus:ring-4 focus:ring-brand/10 font-bold text-slate-700 placeholder:text-slate-300"
          />
          <button 
            type="submit"
            disabled={!replyText.trim()}
            className="p-4 bg-brand text-white rounded-[24px] shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}

