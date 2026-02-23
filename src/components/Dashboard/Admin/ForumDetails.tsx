import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  MessageSquare, 
  Users, 
  MoreVertical, 
  Eye, 
  Trash2,
  ChevronRight,
  Copy
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const discussions = [
  { id: 1, title: 'How can I learn to play chess', author: 'Dumebi Halsey', date: 'July 22, 2022', views: 200, replies: 600, avatar: 'https://picsum.photos/seed/d1/100/100' },
  { id: 2, title: 'How can I learn to play chess', author: 'Dumebi Halsey', date: 'July 22, 2022', views: 200, replies: 600, avatar: 'https://picsum.photos/seed/d2/100/100' },
  { id: 3, title: 'Charts with dates in Glide', author: 'Dumebi Halsey', date: 'July 22, 2022', views: 200, replies: 600, avatar: 'https://picsum.photos/seed/d3/100/100' },
  { id: 4, title: 'How can I learn to play chess', author: 'Dumebi Halsey', date: 'July 22, 2022', views: 200, replies: 600, avatar: 'https://picsum.photos/seed/d4/100/100' },
  { id: 5, title: 'How can I learn to play chess', author: 'Dumebi Halsey', date: 'July 22, 2022', views: 200, replies: 600, avatar: 'https://picsum.photos/seed/d5/100/100' },
  { id: 6, title: 'How can I learn to play chess', author: 'Dumebi Halsey', date: 'July 22, 2022', views: 200, replies: 600, avatar: 'https://picsum.photos/seed/d6/100/100' },
];

export default function AdminForumDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate('/admin/forums')}
        className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="bg-brand rounded-[40px] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Art</h1>
          <div className="flex items-center gap-6 text-white/80 font-bold uppercase tracking-widest text-xs">
            <span>204.2K followers</span>
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
            <span>100 posts</span>
          </div>
          <div className="flex gap-2 mt-8">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-xl text-[10px] font-bold uppercase tracking-widest">Art and Design</span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-xl text-[10px] font-bold uppercase tracking-widest">Media and Internet</span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-xl text-[10px] font-bold uppercase tracking-widest">+3</span>
          </div>
        </div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-20">
          <MessageSquare className="w-64 h-64 rotate-12" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search discussions..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">
          <Plus className="w-5 h-5" /> Create Forum
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {discussions.map((discussion) => (
            <div 
              key={discussion.id} 
              onClick={() => navigate(`/admin/forums/${id}/discussion/${discussion.id}`)}
              className="p-8 hover:bg-slate-50/50 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <img src={discussion.avatar} alt={discussion.author} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand transition-colors mb-1">{discussion.title}</h3>
                  <p className="text-sm font-medium text-slate-400">
                    {discussion.author} <span className="mx-2">•</span> {discussion.date} <span className="mx-2">•</span> <span className="text-brand font-bold">#thequeensgambit</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Views</p>
                  <p className="text-lg font-bold text-slate-900">{discussion.views}</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Replies</p>
                  <p className="text-lg font-bold text-slate-900">{discussion.replies}</p>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
