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
      // Ensure replies is an array and has the new fields
      if (!Array.isArray(found.replies)) {
        found.replies = [];
      }
      found.replies = found.replies.map((r: any) => ({
        ...r,
        dislikes: r.dislikes || 0,
        replies: r.replies || []
      }));
      found.dislikes = found.dislikes || 0;
      setThread(found);
    }
  }, [id]);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !thread) return;
    
    const newReply = {
      id: Date.now(),
      author: 'Bolu Ahmed',
      authorRole: 'Student',
      authorImage: 'https://picsum.photos/seed/student/100/100',
      isVerified: false,
      content: replyingTo ? `@${replyingTo.author} ${replyText}` : replyText,
      time: 'Just now',
      likes: 0,
      dislikes: 0,
      replies: []
    };

    let updatedThread;
    if (replyingTo) {
      // Add as a nested reply to the specific reply
      updatedThread = {
        ...thread,
        replies: thread.replies.map((r: any) => 
          r.id === replyingTo.id 
            ? { ...r, replies: [...(r.replies || []), newReply] }
            : r
        )
      };
    } else {
      // Add as a top-level reply
      updatedThread = {
        ...thread,
        replies: [...thread.replies, newReply]
      };
    }

    setThread(updatedThread);
    
    // Update in storage
    const storedTopics = forumsStorage.get(initialTopics);
    const updatedTopics = storedTopics.map((t: any) => 
      t.id.toString() === id ? updatedThread : t
    );
    forumsStorage.save(updatedTopics);
    
    setReplyText('');
    setReplyingTo(null);
    showToast('Reply posted successfully!');
  };

  const handleLikeReply = (replyId: number, isNested = false, parentId?: number) => {
    if (!thread) return;
    
    const updateReplies = (replies: any[]) => {
      return replies.map(r => {
        if (r.id === replyId) {
          return { ...r, likes: r.likes + 1 };
        }
        if (r.replies && r.replies.length > 0) {
          return { ...r, replies: updateReplies(r.replies) };
        }
        return r;
      });
    };

    const updatedThread = {
      ...thread,
      replies: updateReplies(thread.replies)
    };

    setThread(updatedThread);
    const storedTopics = forumsStorage.get(initialTopics);
    const updatedTopics = storedTopics.map((t: any) => 
      t.id.toString() === id ? updatedThread : t
    );
    forumsStorage.save(updatedTopics);
  };

  const handleDislikeReply = (replyId: number) => {
    if (!thread) return;
    
    const updateReplies = (replies: any[]) => {
      return replies.map(r => {
        if (r.id === replyId) {
          return { ...r, dislikes: (r.dislikes || 0) + 1 };
        }
        if (r.replies && r.replies.length > 0) {
          return { ...r, replies: updateReplies(r.replies) };
        }
        return r;
      });
    };

    const updatedThread = {
      ...thread,
      replies: updateReplies(thread.replies)
    };

    setThread(updatedThread);
    const storedTopics = forumsStorage.get(initialTopics);
    const updatedTopics = storedTopics.map((t: any) => 
      t.id.toString() === id ? updatedThread : t
    );
    forumsStorage.save(updatedTopics);
  };

  if (!thread) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Forum
      </button>

      {/* Main Post */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img src={thread.authorImage} alt={thread.author} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-50" />
              <div>
                <h4 className="font-bold text-slate-900">{thread.author}</h4>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>{thread.authorRole || 'Student'}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{thread.time}</span>
                </div>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-brand/5 text-brand rounded-lg text-[10px] font-bold uppercase tracking-widest">
                {thread.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {thread.title}
            </h1>
            <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-lg">
              {thread.content}
            </p>
          </div>

          <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-50">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setIsLiked(!isLiked);
                  if (isDisliked) setIsDisliked(false);
                }}
                className={`flex items-center gap-2 font-bold text-sm transition-all ${
                  isLiked ? 'text-brand' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-brand' : ''}`} /> {thread.likes + (isLiked ? 1 : 0)}
              </button>
              <button 
                onClick={() => {
                  setIsDisliked(!isDisliked);
                  if (isLiked) setIsLiked(false);
                }}
                className={`flex items-center gap-2 font-bold text-sm transition-all ${
                  isDisliked ? 'text-red-500' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-red-500' : ''}`} /> {thread.dislikes + (isDisliked ? 1 : 0)}
              </button>
            </div>
            <button className="flex items-center gap-2 font-bold text-sm text-slate-400 hover:text-slate-600 transition-all">
              <MessageCircle className="w-5 h-5" /> {thread.replies.length} Replies
            </button>
            <button className="flex items-center gap-2 font-bold text-sm text-slate-400 hover:text-slate-600 transition-all ml-auto">
              <Share2 className="w-5 h-5" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 px-4">Replies ({thread.replies.length})</h3>
        
        <div className="space-y-4">
          {thread.replies.map((reply: any) => (
            <div key={reply.id} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <img src={reply.authorImage} alt={reply.author} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900">{reply.author}</h5>
                          {reply.isVerified && <CheckCircle2 className="w-4 h-4 text-brand fill-brand/10" />}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{reply.authorRole} • {reply.time}</p>
                      </div>
                      <button className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors">
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {reply.content}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <button 
                        onClick={() => handleLikeReply(reply.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" /> {reply.likes}
                      </button>
                      <button 
                        onClick={() => handleDislikeReply(reply.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" /> {reply.dislikes || 0}
                      </button>
                      <button 
                        onClick={() => {
                          setReplyingTo(reply);
                          document.querySelector('input')?.focus();
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand transition-colors"
                      >
                        <Reply className="w-4 h-4" /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Nested Replies */}
              {reply.replies && reply.replies.length > 0 && (
                <div className="ml-12 space-y-4 border-l-2 border-slate-100 pl-6">
                  {reply.replies.map((nested: any) => (
                    <motion.div
                      key={nested.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-slate-50/50 p-6 rounded-[24px] border border-slate-100"
                    >
                      <div className="flex items-start gap-4">
                        <img src={nested.authorImage} alt={nested.author} className="w-10 h-10 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900 text-sm">{nested.author}</h5>
                                {nested.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-brand fill-brand/10" />}
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{nested.authorRole} • {nested.time}</p>
                            </div>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed text-sm">
                            {nested.content}
                          </p>
                          <div className="flex items-center gap-4 mt-4">
                            <button 
                              onClick={() => handleLikeReply(nested.id, true, reply.id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand transition-colors"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" /> {nested.likes}
                            </button>
                            <button 
                              onClick={() => handleDislikeReply(nested.id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
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
      <div className="sticky bottom-8">
        <AnimatePresence>
          {replyingTo && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-brand/5 border border-brand/10 px-6 py-2 rounded-t-2xl flex items-center justify-between mb-[-1px] relative z-0"
            >
              <p className="text-xs font-bold text-brand">Replying to {replyingTo.author}</p>
              <button onClick={() => setReplyingTo(null)} className="text-brand hover:text-brand/80">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <form 
          onSubmit={handleReply}
          className="bg-white p-4 rounded-[32px] border border-slate-200 shadow-2xl flex items-center gap-4 relative z-10"
        >
          <img src="https://picsum.photos/seed/student/100/100" alt="Me" className="w-10 h-10 rounded-xl object-cover hidden sm:block" />
          <input 
            type="text" 
            placeholder={replyingTo ? `Reply to ${replyingTo.author}...` : "Write a reply..."}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-3 outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700"
          />
          <button 
            type="submit"
            disabled={!replyText.trim()}
            className="p-3 bg-brand text-white rounded-2xl shadow-lg shadow-brand/20 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

