import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowLeft, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  Edit2, 
  Share2, 
  BarChart2, 
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { getArticleReaction, ArticleFeedback } from '../../../utils/articleReactions';

interface AdminArticleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: any;
  careerCategory?: string;
  careerTitle?: string;
  onEdit?: (article: any) => void;
}

export default function AdminArticleViewModal({
  isOpen,
  onClose,
  article,
  careerCategory = 'Career Insights',
  careerTitle = '',
  onEdit
}: AdminArticleViewModalProps) {
  const [feedback, setFeedback] = useState<ArticleFeedback>({ likes: 0, dislikes: 0, userVote: null });

  useEffect(() => {
    if (!article) return;
    setFeedback(getArticleReaction(article.id));

    const handleSync = (e: any) => {
      if (article && String(e.detail?.articleId) === String(article.id)) {
        setFeedback({
          likes: e.detail.likes,
          dislikes: e.detail.dislikes,
          userVote: e.detail.userVote
        });
      }
    };

    window.addEventListener('article_reactions_updated', handleSync);
    return () => window.removeEventListener('article_reactions_updated', handleSync);
  }, [article]);

  if (!isOpen || !article) return null;

  const totalVotes = feedback.likes + feedback.dislikes;
  const approvalRate = totalVotes > 0 ? Math.round((feedback.likes / totalVotes) * 100) : 100;
  const readTimeDisplay = article.readTime || (article.readTimeMinutes ? `${article.readTimeMinutes} mins read` : '5 mins read');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4 sm:p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto"
        >
          {/* Header Bar */}
          <header className="sticky top-0 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex items-center gap-2 p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-all"
                title="Close View"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-xs font-bold hidden sm:inline">Back to List</span>
              </button>
              <div className="h-5 w-px bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Admin View & Analytics</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(article);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Article</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="p-6 sm:p-10 space-y-8 max-h-[85vh] overflow-y-auto">
            {/* Student Feedback & Reactions Section (Admin Analytics) */}
            <div className="bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/40 p-6 sm:p-7 rounded-2xl border border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200/60">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand" />
                    Student Feedback & Reaction Analytics
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    Real-time student responses and sentiment for this article.
                  </p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                  ● Live Data
                </span>
              </div>

              {/* Feedback Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Thumbs Up (Likes) */}
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Thumbs Up</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ThumbsUp className="w-4 h-4 fill-emerald-500" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-black text-emerald-600">{feedback.likes}</span>
                    <span className="text-xs font-bold text-slate-500 ml-1.5">Likes</span>
                  </div>
                </div>

                {/* Thumbs Down (Dislikes) */}
                <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Thumbs Down</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                      <ThumbsDown className="w-4 h-4 fill-rose-500" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-black text-rose-600">{feedback.dislikes}</span>
                    <span className="text-xs font-bold text-slate-500 ml-1.5">Dislikes</span>
                  </div>
                </div>

                {/* Total Interactions */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interactions</span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-black text-slate-900">{totalVotes}</span>
                    <span className="text-xs font-bold text-slate-500 ml-1.5">Votes</span>
                  </div>
                </div>

                {/* Approval Percentage */}
                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approval Rate</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-black text-indigo-600">{approvalRate}%</span>
                    <span className="text-xs font-bold text-slate-500 ml-1.5">Positive</span>
                  </div>
                </div>
              </div>

              {/* Progress Sentiment Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <ThumbsUp className="w-3.5 h-3.5 fill-emerald-600" /> {feedback.likes} Helpful ({approvalRate}%)
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-700">
                    {feedback.dislikes} Unhelpful ({100 - approvalRate}%) <ThumbsDown className="w-3.5 h-3.5 fill-rose-600" />
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${approvalRate}%` }} 
                  />
                  <div 
                    className="bg-rose-500 h-full transition-all duration-500" 
                    style={{ width: `${100 - approvalRate}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Article Content Display */}
            <div>
              {/* Category, Read Time, and Author info */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3.5 py-1 bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider rounded-full">
                  {careerCategory || 'Career Insights'}
                </span>
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-brand" /> {readTimeDisplay}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
                {article.title}
              </h1>

              <div className="flex items-center gap-3.5 py-3 border-y border-slate-100 mb-6">
                <img 
                  src={`https://picsum.photos/seed/${article.author || 'author'}/100/100`} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                  alt={article.author || 'Author'} 
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{article.author || 'Career Insights'}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {careerTitle ? `${careerTitle} • ` : ''}{readTimeDisplay}
                  </p>
                </div>
              </div>

              {/* Cover Image */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 mb-8 bg-slate-50">
                <img 
                  src={article.thumbnail || article.image || 'https://picsum.photos/seed/article-preview/800/400'} 
                  alt={article.title} 
                  className="w-full max-h-[380px] object-cover" 
                />
              </div>

              {/* Rich Text Body */}
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base">
                {article.about ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: article.about }} 
                    className="space-y-4"
                  />
                ) : (
                  <p className="italic text-slate-400">No content provided for this article.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
