import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  MoreVertical, 
  Send,
  Clock,
  User,
  CheckCircle2,
  Flag
} from 'lucide-react';

export default function ForumThread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  // Mock data for the thread
  const thread = {
    id: 1,
    title: 'How to start a career in AI as a high school student?',
    category: 'Career Advice',
    content: `I'm currently in my junior year of high school and I'm really fascinated by Artificial Intelligence. I've done some basic Python programming, but I'm not sure what the next steps should be. 

Should I focus on specific math courses? Are there any online certifications that are actually respected by universities or employers? I'd love to hear from anyone who has taken this path or is currently working in the field!`,
    author: 'Alex Chen',
    authorRole: 'Student',
    authorImage: 'https://picsum.photos/seed/alex/100/100',
    time: '2 hours ago',
    likes: 42,
    replies: [
      {
        id: 101,
        author: 'Dr. Sarah Johnson',
        authorRole: 'AI Researcher',
        authorImage: 'https://picsum.photos/seed/sarah/100/100',
        isVerified: true,
        content: 'Great question, Alex! AI is a fantastic field to get into. At your stage, the most important thing is building a strong foundation in Mathematics—specifically Linear Algebra and Calculus. For programming, keep going with Python but start looking into libraries like NumPy and Pandas. Fast.ai has some great free courses that are very accessible.',
        time: '1 hour ago',
        likes: 15
      },
      {
        id: 102,
        author: 'Marcus Thorne',
        authorRole: 'Senior Software Engineer',
        authorImage: 'https://picsum.photos/seed/marcus/100/100',
        isVerified: true,
        content: 'I second the math advice. Also, try building small projects. A simple chatbot or a basic image classifier using pre-trained models can teach you a lot about the workflow. Don\'t worry too much about certifications yet; your portfolio of projects will speak much louder!',
        time: '45 mins ago',
        likes: 8
      }
    ]
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    // Logic to add reply would go here
    setReplyText('');
  };

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
                  <span>{thread.authorRole}</span>
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
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 font-bold text-sm transition-all ${
                isLiked ? 'text-brand' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-brand' : ''}`} /> {thread.likes + (isLiked ? 1 : 0)}
            </button>
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
          {thread.replies.map((reply) => (
            <motion.div
              key={reply.id}
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
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand transition-colors">
                      <ThumbsUp className="w-4 h-4" /> {reply.likes}
                    </button>
                    <button className="text-xs font-bold text-slate-400 hover:text-brand transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reply Input */}
      <div className="sticky bottom-8">
        <form 
          onSubmit={handleReply}
          className="bg-white p-4 rounded-[32px] border border-slate-200 shadow-2xl flex items-center gap-4"
        >
          <img src="https://picsum.photos/seed/student/100/100" alt="Me" className="w-10 h-10 rounded-xl object-cover hidden sm:block" />
          <input 
            type="text" 
            placeholder="Write a reply..." 
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
