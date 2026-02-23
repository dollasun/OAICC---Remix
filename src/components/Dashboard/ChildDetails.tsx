import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  Target, 
  Activity as ActivityIcon, 
  Calendar, 
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Activity } from '../../types';

const activities: Activity[] = [
  { id: '1', type: 'Mentor', title: 'Requested a Mentor', description: 'You just Requested a mentor for Front-end development', time: '09:00 am', date: 'Today, Wednesday 31 March, 2022' },
  { id: '2', type: 'Interest', title: 'Followed an Interest', description: 'You followed Medicine as an interest. You will be able to see articles, videos and content regarding medicine as an interest.', time: '11:00 am', date: 'Today, Wednesday 31 March, 2022' },
  { id: '3', type: 'Quiz', title: 'Career Interest Quiz Result', description: 'Congratulations on completing the quiz career assessment. It evaluate and measure your interest and personality so we can find the right career for you. Click here to view result.', time: '12:00 pm', date: 'Today, Wednesday 31 March, 2022' },
  { id: '4', type: 'System', title: 'Welcome to your dashboard', description: 'Congratulations on signing up! Your career journey begins now.', time: '02:00 pm', date: 'Today, Wednesday 31 March, 2022' },
];

export default function ChildDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'interests' | 'tracker'>('tracker');

  const child = {
    firstName: 'Favour',
    lastName: 'Aina',
    class: 'JSS 3 A',
    school: 'The Seaside School',
    avatar: 'https://picsum.photos/seed/child1/200/200'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={child.avatar} alt={child.firstName} className="w-24 h-24 rounded-3xl object-cover" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900">{child.firstName} {child.lastName}</h1>
            <p className="text-slate-500 font-medium">{child.class} • {child.school}</p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all">
              <Edit2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-8 p-1 bg-slate-50 rounded-2xl w-fit">
          {[
            { id: 'profile', label: 'Profile Information', icon: <User className="w-4 h-4" /> },
            { id: 'interests', label: 'Career Interest', icon: <Target className="w-4 h-4" /> },
            { id: 'tracker', label: 'Tracker', icon: <ActivityIcon className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-brand shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'tracker' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">Recent Activities By {child.firstName}</h2>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm font-semibold text-slate-600">
                    <Calendar className="w-4 h-4" /> January 2023
                  </div>
                  <button className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {activities.map((activity) => (
                  <div key={activity.id} className="relative pl-12">
                    <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10 ${
                      activity.type === 'Mentor' ? 'bg-blue-500' : 
                      activity.type === 'Interest' ? 'bg-orange-500' : 
                      activity.type === 'Quiz' ? 'bg-cyan-500' : 'bg-slate-400'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{activity.time}</p>
                          <h3 className="text-lg font-bold text-slate-900">{activity.title}</h3>
                        </div>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{activity.description}</p>
                      {activity.type === 'Quiz' && (
                        <button className="mt-4 flex items-center gap-2 text-brand font-bold text-sm hover:underline">
                          View Result <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 space-y-12">
              <div className="space-y-6">
                {[
                  { label: 'First Name', value: 'Favour' },
                  { label: 'Last Name', value: 'Aina' },
                  { label: 'Email Address', value: 'favouraina@gmail.com' },
                  { label: 'Phone Number', value: '08054883021' },
                  { label: 'Gender', value: 'Female' },
                  { label: 'Class', value: 'JSS 3' },
                  { label: 'Bio', value: 'I am an JSS 3 student at The Seaside School based in Nigeria. I would love to pursue a degree in Computer science. I am currently in a Tech wiz club at my secondary school.' },
                  { label: 'Home Address', value: '34, Wuse II, Abuja, Nigeria' },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[200px_1fr] gap-4 items-start">
                    <p className="text-slate-500 font-medium">{item.label}</p>
                    <p className="text-slate-900 font-bold leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Counselor</h4>
                    <div className="flex items-center gap-3">
                      <img src="https://picsum.photos/seed/counselor/100/100" className="w-12 h-12 rounded-xl object-cover" alt="Counselor" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Sarah Ojo</p>
                        <p className="text-xs text-slate-500">Counselor at OAICC</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Mentor</h4>
                    <div className="flex items-center gap-3">
                      <img src="https://picsum.photos/seed/mentor/100/100" className="w-12 h-12 rounded-xl object-cover" alt="Mentor" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mason Biyi</p>
                        <p className="text-xs text-slate-500">Full Stack Developer at Moniepoint</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Teacher</h4>
                    <div className="flex items-center gap-3">
                      <img src="https://picsum.photos/seed/teacher/100/100" className="w-12 h-12 rounded-xl object-cover" alt="Teacher" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mr. Uzo Kelechi</p>
                        <p className="text-xs text-slate-500">Teacher at The Seaside School</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Career Interests</h2>
              <div className="space-y-4">
                {[
                  { title: 'Front-end Developer', skills: ['HTML', 'CSS', 'React'], color: 'bg-blue-500' },
                  { title: 'Full Stack Engineer', skills: ['Node.js', 'Python', 'SQL'], color: 'bg-emerald-500' },
                  { title: 'User Experience Engineer', skills: ['Figma', 'Research', 'Prototyping'], color: 'bg-violet-500' },
                ].map((interest, idx) => (
                  <div key={idx} className="p-6 rounded-2xl border border-slate-100 hover:border-brand transition-all group">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-900">{interest.title}</h3>
                      <button className="text-brand font-bold text-sm flex items-center gap-1">
                        View More <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {interest.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Notes</h3>
            <textarea 
              placeholder="Leave a note..." 
              className="w-full h-32 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand/20 outline-none text-sm resize-none"
            />
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <img src="https://picsum.photos/seed/parent/100/100" className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-xs font-bold">Dr. Fadeyibi Aina</p>
                    <p className="text-[10px] text-slate-400">3 mins ago</p>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Needs to try using Quickchart.io</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Assigned Team</h3>
            <div className="space-y-4">
              {[
                { role: 'Counselor', name: 'Sarah Ojo', school: 'OAICC' },
                { role: 'Mentor', name: 'Mason Byl', school: 'Moniepoint' },
                { role: 'Teacher', name: 'Mr. Uzo Kelechi', school: 'The Seaside School' },
              ].map((member, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">{member.role}</p>
                    <p className="text-sm font-bold text-slate-900">{member.name}</p>
                    <p className="text-[10px] text-slate-500">{member.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
