import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../../context/ToastContext';
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
  Target,
  Play,
  Pause,
  FileText,
  Download,
  X,
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Settings
} from 'lucide-react';

export default function CareerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'main' | 'videos' | 'articles' | 'resources'>('main');
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Comments state
  const [comments, setComments] = useState<any[]>([
    { id: 'c1', author: 'Sarah Miller', text: 'This is so helpful! I never knew product design involved so much research.', time: '2h ago', avatar: 'https://picsum.photos/seed/s1/100/100' },
    { id: 'c2', author: 'Alex Chen', text: 'Great article. The part about Maxwell\'s equations was a bit unexpected but interesting.', time: '1h ago', avatar: 'https://picsum.photos/seed/s2/100/100' }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: `c-${Date.now()}`,
      author: 'Bolu Ahmed',
      text: newComment,
      time: 'Just now',
      avatar: 'https://picsum.photos/seed/student/100/100'
    };
    setComments([comment, ...comments]);
    setNewComment('');
    showToast('Comment posted successfully!');
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Mock data for a single career
  const career = {
    id: 1,
    title: 'Product Design',
    category: 'Design',
    match: '98%',
    image: 'https://picsum.photos/seed/design/1200/600',
    description: 'Product design is a subset of industrial design. They use their designing skills and technical knowledge to design new products or improve the way that existing products look or work. Product designers design products keeping in mind the consumer market and are involved in the whole product design life cycle, from concept to its design delivery.',
    salary: {
      entry: '$60,000',
      average: '$115,000',
      senior: '$165,000+',
      median: '$85,000'
    },
    growth: '22% (Much faster than average)',
    education: 'Bachelor\'s Degree in Design or related field',
    skills: [
      'Physical fitness', 'Leadership', 'Communication', 'First aid', 'Problem Solving', 'User Research', 'Prototyping'
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
    ],
    videos: [
      { id: 'v1', title: 'Data editor updates', author: 'David Aina', category: 'Software development', thumbnail: 'https://picsum.photos/seed/v1/400/225', duration: '12:45' },
      { id: 'v2', title: 'Introduction to UI/UX', author: 'Sarah Johnson', category: 'Design', thumbnail: 'https://picsum.photos/seed/v2/400/225', duration: '15:20' },
      { id: 'v3', title: 'Prototyping basics', author: 'Michael Chen', category: 'Design', thumbnail: 'https://picsum.photos/seed/v3/400/225', duration: '08:15' },
      { id: 'v4', title: 'User research methods', author: 'Emma Wilson', category: 'Research', thumbnail: 'https://picsum.photos/seed/v4/400/225', duration: '20:30' },
    ],
    articles: [
      { id: 'a1', title: 'Data editor updates', author: 'David Aina', category: 'Software development', readTime: '5 mins read', image: 'https://picsum.photos/seed/a1/400/250' },
      { id: 'a2', title: 'Installing Glide apps', author: 'David Aina', category: 'Software development', readTime: '8 mins read', image: 'https://picsum.photos/seed/a2/400/250' },
      { id: 'a3', title: 'Barcode scanning', author: 'David Aina', category: 'Software development', readTime: '4 mins read', image: 'https://picsum.photos/seed/a3/400/250' },
      { id: 'a4', title: 'Custom analytics app', author: 'David Aina', category: 'Software development', readTime: '6 mins read', image: 'https://picsum.photos/seed/a4/400/250' },
    ],
    resources: [
      { id: 'r1', title: 'Landing a UX Role', author: 'Coursera', thumbnail: 'https://picsum.photos/seed/r1/400/250' },
      { id: 'r2', title: 'Foundations of User Experience', author: 'Coursera', thumbnail: 'https://picsum.photos/seed/r2/400/250' },
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
          onClick={() => {
            if (viewMode !== 'main') {
              setViewMode('main');
            } else {
              navigate(-1);
            }
          }}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> {viewMode === 'main' ? 'Back to Library' : 'Back to Career'}
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

      {viewMode === 'main' ? (
        <>
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
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Videos Section */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                        Videos
                        <button onClick={() => setViewMode('videos')} className="text-sm text-brand hover:underline">View all</button>
                      </h3>
                      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {career.videos.map((video) => (
                          <motion.div 
                            key={video.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedVideo(video)}
                            className="min-w-[280px] group cursor-pointer"
                          >
                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-brand scale-90 group-hover:scale-100 transition-transform">
                                  <Play className="w-6 h-6 fill-brand" />
                                </div>
                              </div>
                              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white">
                                {video.duration}
                              </div>
                            </div>
                            <h4 className="font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1">{video.title}</h4>
                            <p className="text-xs text-slate-500 font-medium">{video.author} • {video.category}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6">Top skills</h3>
                      <div className="flex flex-wrap gap-3">
                        {career.skills.map((skill) => (
                          <span key={skill} className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full text-sm font-bold text-slate-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Median Salary */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6">Median salary</h3>
                      <div className="inline-block px-8 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-bold text-slate-900">{career.salary.median}</p>
                      </div>
                    </div>

                    {/* About Section */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">About</h3>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        {career.description}
                      </p>
                      <p className="text-slate-600 font-medium leading-relaxed mt-4">
                        Design has wide variety of sub fields including graphic designing, fashion designing, interior designing, web designing, set designing, industrial designing, visual merchandising designing etc. Each of these categories requires a certain specialization. One can select their area of specialization on the basis of their interest, skill and aptitude. Most institutes have an entrance exam for admission and competition for the premier institutes like NID and NIFT is quite high.
                      </p>
                    </div>

                    {/* Articles Section */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                        Articles
                        <button onClick={() => setViewMode('articles')} className="text-sm text-brand hover:underline">View all</button>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {career.articles.map((article) => (
                          <motion.div 
                            key={article.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedArticle(article)}
                            className="group cursor-pointer flex gap-4 p-4 bg-slate-50 rounded-3xl border border-transparent hover:border-brand/20 transition-all"
                          >
                            <img src={article.image} alt={article.title} className="w-24 h-24 rounded-2xl object-cover" />
                            <div className="flex-1 py-1">
                              <h4 className="font-bold text-slate-900 group-hover:text-brand transition-colors mb-1">{article.title}</h4>
                              <p className="text-xs text-slate-500 font-medium mb-2">{article.author} • {article.category}</p>
                              <span className="text-[10px] font-bold text-brand uppercase tracking-wider">{article.readTime}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Resources Section */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                        Top {career.title.toLowerCase()} design resources
                        <button onClick={() => setViewMode('resources')} className="text-sm text-brand hover:underline">View all</button>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {career.resources.map((resource) => (
                          <div key={resource.id} className="group cursor-pointer">
                            <div className="relative aspect-video rounded-3xl overflow-hidden mb-3">
                              <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                <Download className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all" />
                              </div>
                            </div>
                            <h4 className="font-bold text-slate-900 group-hover:text-brand transition-colors">{resource.title}</h4>
                            <p className="text-xs text-slate-500 font-medium">{resource.author}</p>
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
                  {['m1', 'm2'].map((mentorId, i) => (
                    <div key={mentorId} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group" onClick={() => navigate(`/student/mentors/${i + 1}`)}>
                      <img src={`https://picsum.photos/seed/mentor${i + 1}/100/100`} className="w-12 h-12 rounded-xl object-cover" alt="Mentor" />
                      <div className="flex-1">
                        <p className="text-sm font-bold">Sarah Johnson</p>
                        <p className="text-[10px] text-white/50 font-bold uppercase">Senior Engineer at Google</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-brand font-bold text-sm hover:underline" onClick={() => navigate('/student/mentors')}>
                  View all mentors
                </button>
              </div>
            </div>
          </div>
        </>
      ) : viewMode === 'videos' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-900">All Videos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {career.videos.map((video) => (
              <motion.div 
                key={video.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedVideo(video)}
                className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-brand scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-8 h-8 fill-brand" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-xs font-bold text-white">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand transition-colors mb-2">{video.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">{video.author} • {video.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : viewMode === 'articles' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-900">All Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {career.articles.map((article) => (
              <motion.div 
                key={article.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedArticle(article)}
                className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex gap-6"
              >
                <img src={article.image} alt={article.title} className="w-32 h-32 rounded-[32px] object-cover" />
                <div className="flex-1 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">• {article.readTime}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-brand transition-colors mb-2">{article.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">By {article.author}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-900">All Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {career.resources.map((resource) => (
              <motion.div 
                key={resource.id}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="relative aspect-video rounded-[32px] overflow-hidden mb-4">
                  <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <Download className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand transition-colors mb-1">{resource.title}</h4>
                <p className="text-sm text-slate-500 font-medium">{resource.author}</p>
                <button className="w-full mt-6 py-3 bg-slate-50 text-slate-900 font-bold rounded-2xl hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Material
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
            <div className="h-20 px-8 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent absolute top-0 left-0 right-0 z-10">
              <button 
                onClick={() => {
                  setSelectedVideo(null);
                  setIsPlaying(false);
                }}
                className="flex items-center gap-2 text-white font-bold hover:text-brand transition-colors"
              >
                <ArrowLeft className="w-6 h-6" /> {selectedVideo.title}
              </button>
              <div className="flex items-center gap-4">
                <button className="p-2 text-white/60 hover:text-white transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
                <button className="p-2 text-white/60 hover:text-white transition-colors">
                  <Bookmark className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center">
              <img 
                src={selectedVideo.thumbnail} 
                className="w-full h-full object-cover opacity-40 blur-2xl absolute inset-0" 
                alt="Background"
              />
              <div className="relative w-full max-w-6xl aspect-video bg-black shadow-2xl rounded-2xl overflow-hidden group/player">
                <video 
                  ref={videoRef}
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  className="w-full h-full object-contain"
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"
                    >
                      <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center text-brand shadow-2xl">
                        <Play className="w-10 h-10 fill-brand ml-1" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity">
                  <div className="h-1.5 bg-white/20 rounded-full mb-6 relative overflow-hidden cursor-pointer group/progress">
                    <div className="absolute inset-y-0 left-0 bg-brand w-1/3 group-hover/progress:bg-brand/80 transition-all"></div>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-8">
                      <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                        {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                      </button>
                      <span className="text-sm font-bold tabular-nums">04:20 / {selectedVideo.duration}</span>
                    </div>
                    <div className="flex items-center gap-8">
                      <button className="hover:text-brand transition-colors"><Settings className="w-5 h-5" /></button>
                      <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center text-[10px] font-bold">CC</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Article View Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] bg-white flex overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto">
              <header className="h-20 px-8 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-10">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand font-bold rounded-xl">
                    <CheckCircle2 className="w-4 h-4" /> Saved
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-900">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </header>

              <div className="max-w-3xl mx-auto py-12 px-8 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {selectedArticle.category}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">• {selectedArticle.readTime}</span>
                  </div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-6">{selectedArticle.title}</h1>
                  <div className="flex items-center gap-4">
                    <img src="https://picsum.photos/seed/author/100/100" className="w-10 h-10 rounded-full" alt="Author" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{selectedArticle.author}</p>
                      <p className="text-xs text-slate-500 font-medium">Software development • 5 mins read</p>
                    </div>
                  </div>
                </div>

                <img src={selectedArticle.image} className="w-full aspect-video rounded-[32px] object-cover shadow-lg" alt="Article" />

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    Maxwell's equations—the foundation of classical electromagnetism—describe light as a wave that moves with a characteristic velocity. The modern view is that light needs no medium of transmission, but Maxwell and his contemporaries were convinced that light waves were propagated in a medium, analogous to sound propagating in air, and ripples propagating on the surface of a pond. This hypothetical medium was called the luminiferous aether, at rest relative to the "fixed stars" and through which the Earth moves. Fresnel's partial ether dragging hypothesis ruled out the measurement of first-order (v/c) effects, and although observations of second-order effects (v2/c2) were possible in principle, Maxwell thought they were too small to be detected with then-current technology.
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium mt-6">
                    Maxwell's equations—the foundation of classical electromagnetism—describe light as a wave that moves with a characteristic velocity. The modern view is that light needs no medium of transmission, but Maxwell and his contemporaries were convinced that light waves were propagated in a medium, analogous to sound propagating in air, and ripples propagating on the surface of a pond. This hypothetical medium was called the luminiferous aether, at rest relative to the "fixed stars" and through which the Earth moves. Fresnel's partial ether dragging hypothesis ruled out the measurement of first-order (v/c) effects, and although observations of second-order effects (v2/c2) were possible in principle, Maxwell thought they were too small to be detected with then-current technology.
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Sidebar */}
            <div className="w-96 border-l border-slate-100 bg-slate-50 flex flex-col hidden xl:flex">
              <div className="p-8 border-b border-slate-100 bg-white flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Comments</h3>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">{comments.length}</span>
              </div>
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={comment.id} 
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <img src={comment.avatar} className="w-8 h-8 rounded-full" alt={comment.author} />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{comment.author}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{comment.time}</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                      </div>
                      <div className="flex items-center gap-4 px-2">
                        <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-brand transition-colors">
                          <ThumbsUp className="w-3 h-3" /> Like
                        </button>
                        <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors">
                          <ThumbsDown className="w-3 h-3" /> Dislike
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-400">Be the first to leave a comment</p>
                  </div>
                )}
              </div>
              <div className="p-6 bg-white border-t border-slate-100">
                <div className="relative">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment..." 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand/20 outline-none text-sm resize-none h-24"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="absolute bottom-3 right-3 p-2 bg-brand text-white rounded-xl shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
