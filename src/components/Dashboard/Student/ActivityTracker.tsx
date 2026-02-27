import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Award, 
  BookOpen, 
  MessageSquare, 
  Users,
  ChevronRight,
  Star
} from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'quiz',
    title: 'Career Interest Assessment',
    status: 'Completed',
    date: 'Oct 10, 2024',
    icon: Activity,
    color: 'bg-brand',
    details: 'You matched with 12 potential career paths based on your interests.'
  },
  {
    id: 2,
    type: 'forum',
    title: 'Started a Discussion',
    status: 'Active',
    date: 'Oct 12, 2024',
    icon: MessageSquare,
    color: 'bg-amber-500',
    details: 'Topic: "How to start a career in AI as a high school student?"'
  },
  {
    id: 3,
    type: 'mentor',
    title: 'Mentorship Request',
    status: 'Pending',
    date: 'Oct 13, 2024',
    icon: Users,
    color: 'bg-indigo-500',
    details: 'Sent a request to Sarah Johnson (Senior Software Engineer at Google).'
  },
  {
    id: 4,
    type: 'career',
    title: 'Saved Career Path',
    status: 'Updated',
    date: 'Oct 14, 2024',
    icon: BookOpen,
    color: 'bg-emerald-500',
    details: 'You saved "Data Scientist" to your career library.'
  }
];

const milestones = [
  { id: 1, title: 'Profile 100% Complete', date: 'Oct 05, 2024', icon: Award },
  { id: 2, title: 'First Career Match', date: 'Oct 10, 2024', icon: Star },
  { id: 3, title: 'Community Contributor', date: 'Oct 12, 2024', icon: MessageSquare }
];

export default function ActivityTracker() {
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = React.useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Activity Tracker</h1>
          <p className="text-slate-500 font-medium mt-1">Keep track of your progress, achievements, and recent interactions.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Progress</p>
            <p className="text-lg font-bold text-slate-900">+15% from last week</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <Clock className="w-6 h-6 text-brand" /> Recent Activity
            </h2>
            
            <div className="relative space-y-8 before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-50">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16 group"
                >
                  <div className={`absolute left-0 w-12 h-12 ${activity.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform z-10`}>
                    <activity.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{activity.title}</h3>
                    <span className="text-xs font-bold text-slate-400">{activity.date}</span>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-brand/20 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        activity.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' :
                        activity.status === 'Active' ? 'bg-blue-50 text-blue-500' :
                        activity.status === 'Pending' ? 'bg-amber-50 text-amber-500' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600">{activity.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-8 py-4 text-slate-400 font-bold text-sm hover:text-brand transition-colors">
              Load more activity
            </button>
          </div>
        </div>

        {/* Sidebar Achievements */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-brand" /> Milestones
            </h2>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                    <milestone.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{milestone.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{milestone.date}</p>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setIsAchievementsModalOpen(true)}
              className="w-full mt-6 py-3 text-brand font-bold text-sm hover:underline"
            >
              View all achievements
            </button>
          </div>

          <AnimatePresence>
            {isAchievementsModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsAchievementsModalOpen(false)}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
                >
                  <div className="p-8 sm:p-10">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-slate-900">All Achievements</h2>
                      <button onClick={() => setIsAchievementsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                        <ChevronRight className="w-6 h-6 rotate-90" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {[...milestones, 
                        { id: 4, title: 'First Quiz Passed', date: 'Oct 15, 2024', icon: Award },
                        { id: 5, title: 'Mentor Connected', date: 'Oct 18, 2024', icon: Users },
                        { id: 6, title: 'Career Path Saved', date: 'Oct 20, 2024', icon: BookOpen },
                        { id: 7, title: 'Forum Expert', date: 'Oct 22, 2024', icon: Star },
                        { id: 8, title: 'Weekly Streak', date: 'Oct 25, 2024', icon: Activity }
                      ].map((milestone) => (
                        <div key={milestone.id} className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                            <milestone.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{milestone.title}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{milestone.date}</p>
                          </div>
                          <div className="ml-auto">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Next Goal</h3>
              <p className="text-white/60 text-sm font-medium mb-6">Complete your first mentorship session to earn the "Guided" badge.</p>
              
              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Progress</span>
                  <span>60%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand w-[60%]"></div>
                </div>
              </div>

              <button className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:scale-105 transition-all">
                Continue Journey
              </button>
            </div>
            <Activity className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
