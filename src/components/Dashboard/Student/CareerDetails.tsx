import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Star, 
  TrendingUp, 
  DollarSign, 
  GraduationCap, 
  Clock,
  CheckCircle2,
  Users,
  MessageSquare,
  ChevronRight,
  Briefcase,
  Lightbulb,
  Target
} from 'lucide-react';

export default function CareerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for a single career
  const career = {
    id: 1,
    title: 'Software Engineer',
    category: 'Technology',
    match: '98%',
    image: 'https://picsum.photos/seed/software/1200/600',
    description: 'Software engineers design, develop, and maintain software systems and applications. They use various programming languages and development tools to create solutions for complex problems.',
    salary: {
      entry: '$75,000',
      average: '$115,000',
      senior: '$165,000+'
    },
    growth: '22% (Much faster than average)',
    education: 'Bachelor\'s Degree in Computer Science or related field',
    skills: [
      'Problem Solving', 'Algorithm Design', 'Python', 'JavaScript', 'React', 'Cloud Computing', 'Team Collaboration'
    ],
    responsibilities: [
      'Write clean, maintainable, and efficient code',
      'Collaborate with cross-functional teams to define and design new features',
      'Troubleshoot, debug and upgrade existing software',
      'Build reusable code and libraries for future use',
      'Optimize applications for maximum speed and scalability'
    ],
    pathway: [
      { step: 'High School', description: 'Focus on Mathematics, Physics, and Computer Science electives.' },
      { step: 'Bachelor\'s Degree', description: 'Major in Computer Science, Software Engineering, or a related technical field.' },
      { step: 'Internships', description: 'Gain practical experience through summer internships at tech companies.' },
      { step: 'Entry-level Role', description: 'Start as a Junior Software Engineer or Associate Developer.' },
      { step: 'Specialization', description: 'Focus on specific areas like Frontend, Backend, Mobile, or AI.' }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills & Duties' },
    { id: 'pathway', label: 'Career Path' },
    { id: 'market', label: 'Market Trends' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Library
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`p-3 rounded-2xl border transition-all ${
              isSaved ? 'bg-brand/10 border-brand text-brand' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-brand' : ''}`} />
          </button>
          <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-slate-600 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] rounded-[40px] overflow-hidden shadow-2xl">
        <img src={career.image} alt={career.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-10 left-10 right-10">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-4 py-1.5 bg-brand text-white rounded-full text-xs font-bold uppercase tracking-wider">
              {career.category}
            </span>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {career.match} Match
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{career.title}</h1>
          <p className="text-white/80 text-lg font-medium max-w-2xl line-clamp-2">
            {career.description}
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Salary</p>
            <p className="text-xl font-bold text-slate-900">{career.salary.average}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Growth</p>
            <p className="text-xl font-bold text-slate-900">{career.growth}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Education</p>
            <p className="text-xl font-bold text-slate-900">Bachelor's</p>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-bold text-sm transition-all relative ${
                  activeTab === tab.id ? 'text-brand' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-brand" /> What is a {career.title}?
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {career.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand" /> Key Responsibilities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {career.responsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-slate-700">{resp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-brand" /> Essential Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {career.skills.map((skill) => (
                      <span key={skill} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pathway' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative space-y-8 before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
                  {career.pathway.map((step, i) => (
                    <div key={i} className="relative pl-16">
                      <div className="absolute left-0 w-12 h-12 bg-white border-4 border-slate-50 rounded-2xl flex items-center justify-center text-brand font-bold shadow-sm">
                        {i + 1}
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{step.step}</h4>
                      <p className="text-slate-500 font-medium">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'market' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-emerald-50 rounded-3xl">
                    <h4 className="text-emerald-900 font-bold mb-2">Salary Outlook</h4>
                    <div className="space-y-3 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-emerald-700">Entry Level</span>
                        <span className="text-sm font-bold text-emerald-900">{career.salary.entry}</span>
                      </div>
                      <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-1/3"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-emerald-700">Mid Level</span>
                        <span className="text-sm font-bold text-emerald-900">{career.salary.average}</span>
                      </div>
                      <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-2/3"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-emerald-700">Senior Level</span>
                        <span className="text-sm font-bold text-emerald-900">{career.salary.senior}</span>
                      </div>
                      <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-3xl">
                    <h4 className="text-blue-900 font-bold mb-2">Job Availability</h4>
                    <p className="text-blue-700 text-sm font-medium mt-4">
                      The demand for {career.title}s is expected to grow significantly over the next decade as more industries undergo digital transformation.
                    </p>
                    <div className="mt-6 p-4 bg-white/50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold text-blue-900">{career.growth}</p>
                          <p className="text-xs font-bold text-blue-500 uppercase">Projected Growth</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Take Action</h3>
            <button className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" /> Ask a Mentor
            </button>
            <button className="w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              <Users className="w-5 h-5" /> Find Counselors
            </button>
            <div className="h-px bg-slate-100"></div>
            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl">
              <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
              <div>
                <p className="text-sm font-bold text-amber-900">Top Match!</p>
                <p className="text-xs font-medium text-amber-700">This career aligns perfectly with your interests.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-4">
            <h3 className="text-lg font-bold">Recommended Mentors</h3>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                  <img src={`https://picsum.photos/seed/mentor${i}/100/100`} className="w-12 h-12 rounded-xl object-cover" alt="Mentor" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">Sarah Johnson</p>
                    <p className="text-[10px] text-white/50 font-bold uppercase">Senior Engineer at Google</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
            <button className="w-full py-3 text-brand font-bold text-sm hover:underline">
              View all mentors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
