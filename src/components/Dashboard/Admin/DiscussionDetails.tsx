import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MessageSquare, 
  MoreVertical, 
  Copy, 
  Send, 
  ThumbsUp, 
  Share2,
  X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const replies = [
  { id: 1, author: 'Bankole Dan', date: 'July 22, 2022', content: 'Hey, have you tried using Quickchart.io?', avatar: 'https://picsum.photos/seed/r1/100/100', likes: 2 },
  { id: 2, author: 'Amaka Bee', date: 'July 22, 2022', content: 'You can also embed charts from Google sheets...', avatar: 'https://picsum.photos/seed/r2/100/100', likes: 5 },
];

export default function AdminDiscussionDetails() {
  const navigate = useNavigate();
  const { id, discussionId } = useParams();

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate(`/admin/forums/${id}`)}
        className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Charts with dates in Glide</h1>
          <div className="flex items-center gap-4 mb-8">
            <img src="https://picsum.photos/seed/author/100/100" className="w-12 h-12 rounded-2xl object-cover" alt="Author" />
            <div>
              <p className="font-bold text-slate-900">Dumebi Halsey <span className="mx-2 text-slate-300">•</span> <span className="text-slate-400 font-medium text-sm">July 22, 2022</span></p>
            </div>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
            <p>I believe this is an 'unworkaround' scenario, but thought I'd post in case I'm missing something/ and someone has found a way around this.</p>
            <p>Situation:</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Bar Charts in App with Date based values (i.e. LABEL/ X-axis is date)</li>
              <li>Charts has quantity on Y-Axis</li>
            </ul>
            <button className="text-brand font-bold mt-4 hover:underline">View More...</button>
          </div>
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-slate-50">
            <div className="flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> 600 Replies</span>
              <span className="flex items-center gap-2"><ThumbsUp className="w-4 h-4" /> 200 Likes</span>
            </div>
            <button className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors text-sm">
              <Copy className="w-4 h-4" /> Copy Link
            </button>
          </div>
        </div>

        <div className="p-10 bg-slate-50/30">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Replies</h3>
          <div className="space-y-8">
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-6">
                <img src={reply.avatar} className="w-12 h-12 rounded-2xl object-cover shrink-0" alt={reply.author} />
                <div className="flex-1">
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-slate-900">{reply.author}</p>
                      <button className="p-1 text-slate-300 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                    <p className="text-slate-600 font-medium">{reply.content}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-brand transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">{reply.likes}</span>
                      </button>
                      <button className="text-[10px] font-bold text-slate-400 hover:text-brand transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 relative">
            <textarea 
              placeholder="Leave a comment"
              rows={1}
              className="w-full px-8 py-5 bg-white border border-slate-100 rounded-[32px] outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 shadow-sm pr-20 resize-none"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20 hover:scale-105 transition-all">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
