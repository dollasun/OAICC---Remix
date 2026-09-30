import React, { useState, useRef, useEffect } from 'react';
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
  Settings,
  Sparkles
} from 'lucide-react';
import { careersStorage } from '../../../utils/storage';
import { careerGlossary } from '../../../data/careers';
import { getTopRecommendedCareers } from '../../../utils/recommendations';
import { getArticleReaction, voteArticle, ArticleFeedback } from '../../../utils/articleReactions';

export default function CareerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'main' | 'videos' | 'articles' | 'resources'>('main');
  const [career, setCareer] = useState<any>(null);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Article Feedback State (Likes & Dislikes)
  const [articleFeedback, setArticleFeedback] = useState<ArticleFeedback>({ likes: 0, dislikes: 0, userVote: null });

  useEffect(() => {
    if (selectedArticle) {
      setArticleFeedback(getArticleReaction(selectedArticle.id));
    }
  }, [selectedArticle]);

  useEffect(() => {
    const handleSync = (e: any) => {
      if (selectedArticle && String(e.detail?.articleId) === String(selectedArticle.id)) {
        setArticleFeedback({
          likes: e.detail.likes,
          dislikes: e.detail.dislikes,
          userVote: e.detail.userVote
        });
      }
    };
    window.addEventListener('article_reactions_updated', handleSync);
    return () => window.removeEventListener('article_reactions_updated', handleSync);
  }, [selectedArticle]);

  useEffect(() => {
    const topCareers = getTopRecommendedCareers(24);
    let found: any = topCareers.find(c => c.id.toString() === id);

    if (!found) {
      const adminCareers = careersStorage.get([]);
      const foundAdmin = adminCareers.find((c: any) => c.id.toString() === id);
      if (foundAdmin) {
        found = {
          id: foundAdmin.id,
          title: foundAdmin.name || foundAdmin.title,
          category: foundAdmin.category || 'Professional Services',
          description: foundAdmin.description || `A professional in the ${foundAdmin.category || 'selected'} field.`,
          salary: `$${foundAdmin.salaryMin || '60,000'} - $${foundAdmin.salaryMax || '120,000'}`,
          growth: '20%',
          education: "Bachelor's Degree",
          image: foundAdmin.image || `https://picsum.photos/seed/${foundAdmin.id}/1200/600`,
          matchScore: 92,
          match: '92%'
        };
      }
    }

    if (!found) {
      let idCounter = 1;
      for (const [cluster, jobs] of Object.entries(careerGlossary)) {
        for (const job of jobs) {
          if (idCounter.toString() === id) {
            found = {
              id: idCounter,
              title: job,
              category: cluster,
              description: `A dedicated professional role focused on ${job.toLowerCase()} within the ${cluster} industry.`,
              salary: '$70,000 - $135,000',
              growth: '18%',
              education: "Bachelor's Degree",
              image: `https://picsum.photos/seed/${idCounter}/1200/600`,
              matchScore: 88,
              match: '88%'
            };
            break;
          }
          idCounter++;
        }
        if (found) break;
      }
    }

    if (found) {
      const categoryLower = (found.category || '').toLowerCase();
      
      let skills = ['Communication', 'Problem Solving', 'Analytical Thinking', 'Team Collaboration', 'Strategic Planning'];
      let responsibilities = [
        'Lead and coordinate core operational tasks and deliverables effectively.',
        'Collaborate with cross-functional teams to streamline project execution workflows.',
        'Analyze data and performance metrics to drive continuous improvement.',
        'Ensure compliance with organizational guidelines and industry standards.'
      ];

      if (categoryLower.includes('tech') || categoryLower.includes('information') || categoryLower.includes('software') || categoryLower.includes('data')) {
        skills = ['Software Architecture', 'Data Structures & Algorithms', 'Cloud Infrastructure', 'API Design', 'System Security', 'Problem Solving'];
        responsibilities = [
          'Design, build, and deploy scalable software and cloud system architectures.',
          'Conduct code reviews, automated testing, and continuous integration workflows.',
          'Optimize system performance, speed, and resolve technical bottlenecks.',
          'Collaborate with product managers and designers to deliver seamless user experiences.'
        ];
      } else if (categoryLower.includes('health') || categoryLower.includes('medicine')) {
        skills = ['Clinical Diagnosis', 'Patient Care & Empathy', 'Medical Ethics', 'Surgical Procedures', 'Critical Thinking', 'Emergency Response'];
        responsibilities = [
          'Perform medical evaluations, physical assessments, and patient diagnostic tests.',
          'Formulate and execute personalized treatment plans for patients.',
          'Maintain thorough health documentation while following strict medical regulations.',
          'Collaborate with specialists and nurses to ensure optimal patient recovery.'
        ];
      } else if (categoryLower.includes('finance') || categoryLower.includes('account')) {
        skills = ['Financial Modeling', 'Risk Assessment', 'Auditing & Compliance', 'Data Analytics', 'Portfolio Management', 'Strategic Planning'];
        responsibilities = [
          'Analyze balance sheets, revenue cycles, and financial growth projections.',
          'Prepare budget forecasts, tax strategies, and financial audit documentation.',
          'Evaluate market risk factors and advise corporate leaders on financial investments.',
          'Ensure strict compliance with financial regulations and reporting standards.'
        ];
      } else if (categoryLower.includes('creative') || categoryLower.includes('design') || categoryLower.includes('art')) {
        skills = ['User Experience (UX)', 'Visual Aesthetics', 'Prototyping (Figma)', 'Design Systems', 'User Research', 'Creative Direction'];
        responsibilities = [
          'Translate complex customer needs into intuitive visual designs and interactive wireframes.',
          'Conduct user research and usability testing to refine design iterations.',
          'Maintain brand design systems, typography standards, and visual assets.',
          'Collaborate closely with engineering teams to ensure flawless frontend implementation.'
        ];
      }

      const pathway = [
        { 
          step: 'Foundation & Preparation', 
          type: 'education',
          duration: '1-4 years',
          description: 'Build strong foundational knowledge in STEM, business, or humanities electives.',
          milestones: ['Complete relevant high school courses', 'Participate in extracurricular clubs', 'Research potential programs']
        },
        { 
          step: "Undergraduate Degree / Formal Training", 
          type: 'education',
          duration: '2-4 years',
          description: `Earn a Bachelor's Degree or accredited qualification in ${found.category} or a related field.`,
          milestones: ['Maintain strong GPA', 'Join professional student organizations', 'Build foundational portfolio']
        },
        { 
          step: 'Internships & Hands-On Experience', 
          type: 'professional',
          duration: '6-12 months',
          description: 'Gain real-world experience through corporate internships, capstone projects, or technical bootcamps.',
          milestones: ['Secure a summer internship', 'Find an industry mentor', 'Contribute to real-world projects']
        },
        { 
          step: 'Entry-Level Placement', 
          type: 'professional',
          duration: '1-3 years',
          description: `Launch your career as a Junior or Associate ${found.title} to master core tools and processes.`,
          milestones: ['Land first full-time role', 'Master industry-standard tools', 'Deliver measurable business value']
        },
        { 
          step: 'Advanced Specialization & Leadership', 
          type: 'professional',
          duration: '3+ years',
          description: 'Transition into senior management, specialized consulting, or executive leadership roles.',
          milestones: ['Lead cross-functional teams', 'Speak at industry conferences', 'Mentor junior professionals']
        }
      ];

      const salaryObj = typeof found.salary === 'object' ? found.salary : {
        entry: '$60,000',
        average: found.salary || '$95,000',
        senior: '$150,000+',
        median: found.salary ? found.salary.split('-')[0].trim() : '$85,000'
      };

      setCareer({
        ...found,
        salary: salaryObj,
        growth: found.growth ? `${found.growth} (Faster than average)` : '22% (Faster than average)',
        education: found.education || "Bachelor's Degree",
        skills,
        responsibilities,
        pathway,
        videos: [
          { id: 'v1', title: `A Day in the Life of a ${found.title}`, author: 'Career Spotlight', category: found.category, thumbnail: `https://picsum.photos/seed/v1-${found.id}/400/225`, duration: '10:15' },
          { id: 'v2', title: `Top Skills Required for ${found.title}`, author: 'Industry Experts', category: found.category, thumbnail: `https://picsum.photos/seed/v2-${found.id}/400/225`, duration: '14:30' }
        ],
        articles: (found.articleItems && found.articleItems.length > 0)
          ? found.articleItems.map((a: any) => ({
              id: a.id,
              title: a.title,
              author: a.author || 'Career Insights',
              category: found.category,
              readTime: a.readTime || (a.readTimeMinutes ? `${a.readTimeMinutes} mins read` : '5 mins read'),
              image: a.thumbnail || `https://picsum.photos/seed/${a.id}/400/250`,
              about: a.about
            }))
          : [
              { 
                id: 'a1', 
                title: `Industry Trends & Outlook for ${found.title}`, 
                author: 'Career Insights', 
                category: found.category, 
                readTime: '5 mins read', 
                image: `https://picsum.photos/seed/a1-${found.id}/400/250`,
                about: `<p>Maxwell's equations—the foundation of classical electromagnetism—describe light as a wave that moves with a characteristic velocity. The modern view is that light needs no medium of transmission, but Maxwell and his contemporaries were convinced that light waves were propagated in a medium, analogous to sound propagating in air, and ripples propagating on the surface of a pond.</p><p class="mt-4">This hypothetical medium was called the luminiferous aether, at rest relative to the "fixed stars" and through which the Earth moves. In this comprehensive guide, we delve into how emerging technological trends, automated tools, and digital transformation are reshaping workflows and creating new frontiers of opportunity for aspiring professionals.</p><h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Key Industry Takeaways</h3><ul class="list-disc list-inside space-y-2 text-slate-600"><li><strong>Automation and Intelligence:</strong> Modern tooling streamlines repetitive tasks, shifting the focus towards creative strategy and analytical depth.</li><li><strong>Interdisciplinary Versatility:</strong> Employers strongly favour candidates who blend deep domain expertise with solid communication and problem-solving skills.</li><li><strong>Continuous Professional Growth:</strong> Engaging with active communities, mentorship networks, and relevant industry publications helps you stay ahead of technological curves.</li></ul>`
              },
              { 
                id: 'a2', 
                title: `How to Build a Portfolio as a ${found.title}`, 
                author: 'Mentor Network', 
                category: found.category, 
                readTime: '7 mins read', 
                image: `https://picsum.photos/seed/a2-${found.id}/400/250`,
                about: `<p>A high-impact portfolio is one of your most valuable assets when seeking internships, entry-level opportunities, or academic sponsorships.</p><p class="mt-4">Highlight 3-5 well-documented case studies rather than a long list of unfinished demos. Explain the context, your specific contributions, and the measurable results achieved.</p>`
              }
            ],
        resources: [
          { id: 'r1', title: `${found.title} Starter Career Roadmap`, author: 'OAICC Learning', thumbnail: `https://picsum.photos/seed/r1-${found.id}/400/250` }
        ]
      });
    }
  }, [id]);

  const handleVote = (voteType: 'like' | 'dislike') => {
    if (!selectedArticle) return;
    const res = voteArticle(selectedArticle.id, voteType);
    setArticleFeedback(res);
    if (res.userVote === 'like') {
      showToast('Liked! Thanks for your feedback.');
    } else if (res.userVote === 'dislike') {
      showToast('Feedback noted.');
    }
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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills & Duties' },
    { id: 'pathway', label: 'Career Path' }
  ];

  if (!career) {
    return <div className="p-8 text-center text-slate-500 font-bold">Loading career...</div>;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8">
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
            className={`p-3 rounded-xl border transition-all ${
              isSaved ? 'bg-brand/10 border-brand text-brand' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-brand' : ''}`} />
          </button>
          <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-slate-600 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'main' ? (
        <>
          {/* Hero Section */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-sm">
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
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Salary</p>
                <p className="text-xl font-bold text-slate-900">{career.salary.average}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Growth</p>
                <p className="text-xl font-bold text-slate-900">{career.growth}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
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
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
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
                            <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
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
                      <div className="inline-block px-8 py-4 bg-slate-50 rounded-xl border border-slate-100">
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
                        {career.articles.map((article: any) => {
                          const rx = getArticleReaction(article.id);
                          return (
                            <motion.div 
                              key={article.id}
                              whileHover={{ y: -5 }}
                              onClick={() => setSelectedArticle(article)}
                              className="group cursor-pointer flex gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-brand/20 transition-all"
                            >
                              <img src={article.image} alt={article.title} className="w-24 h-24 rounded-xl object-cover" />
                              <div className="flex-1 py-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="font-bold text-slate-900 group-hover:text-brand transition-colors mb-1 line-clamp-1">{article.title}</h4>
                                  <p className="text-xs text-slate-500 font-medium mb-2">{article.author} • {article.category}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold text-brand uppercase tracking-wider">{article.readTime}</span>
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                    <ThumbsUp className="w-3 h-3 fill-emerald-500 text-emerald-600" /> {rx.likes}
                                  </span>
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md">
                                    <ThumbsDown className="w-3 h-3" /> {rx.dislikes}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
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
                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
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
                        {career.skills.map((skill: string) => (
                          <span key={skill} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-brand" /> Key Duties & Responsibilities
                      </h3>
                      <div className="space-y-3">
                        {career.responsibilities.map((resp: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                            <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                            <p className="text-slate-700 font-medium text-sm leading-relaxed">{resp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'pathway' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="relative space-y-8 before:absolute before:left-[27px] before:top-8 before:bottom-4 before:w-0.5 before:bg-slate-200">
                      {career.pathway.map((step: any, i: number) => (
                        <div key={i} className="relative pl-20">
                          <div className={`absolute left-0 top-1 w-14 h-14 bg-white border-4 ${step.type === 'education' ? 'border-blue-100 text-blue-500' : 'border-emerald-100 text-emerald-500'} rounded-full flex items-center justify-center shadow-sm z-10`}>
                            {step.type === 'education' ? <GraduationCap className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
                          </div>
                          
                          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${step.type === 'education' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {step.type}
                                  </span>
                                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {step.duration}
                                  </span>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900">{step.step}</h4>
                              </div>
                            </div>
                            
                            <p className="text-slate-600 font-medium mb-6">{step.description}</p>
                            
                            <div>
                              <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-brand" /> Key Milestones
                              </h5>
                              <div className="grid gap-2">
                                {step.milestones.map((milestone: string, idx: number) => (
                                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="w-5 h-5 rounded-md border-2 border-slate-200 bg-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 opacity-0 transition-opacity" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{milestone}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Take Action</h3>
                <button className="w-full py-4 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/5 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Ask a Mentor
                </button>
                <button className="w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" /> Find Counselors
                </button>
                <div className="h-px bg-slate-100"></div>
                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                  <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">Top Match!</p>
                    <p className="text-xs font-medium text-amber-700">This career aligns perfectly with your interests.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-2xl text-white space-y-4">
                <h3 className="text-lg font-bold">Recommended Mentors</h3>
                <div className="space-y-4">
                  {['m1', 'm2'].map((mentorId, i) => (
                    <div key={mentorId} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer group" onClick={() => navigate(`/student/mentors/${i + 1}`)}>
                      <img src={`https://picsum.photos/seed/mentor${i + 1}/100/100`} className="w-12 h-12 rounded-lg object-cover" alt="Mentor" />
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
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-sm transition-all group cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-brand scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-8 h-8 fill-brand" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-white">
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
            {career.articles.map((article: any) => {
              const rx = getArticleReaction(article.id);
              return (
                <motion.div 
                  key={article.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-sm transition-all group cursor-pointer flex gap-6"
                >
                  <img src={article.image} alt={article.title} className="w-32 h-32 rounded-2xl object-cover" />
                  <div className="flex-1 py-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider rounded-full">
                          {article.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand" /> {article.readTime}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-brand transition-colors mb-1">{article.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">By {article.author}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <ThumbsUp className="w-3 h-3 fill-emerald-500 text-emerald-600" /> {rx.likes} Likes
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <ThumbsDown className="w-3 h-3" /> {rx.dislikes}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-sm transition-all group cursor-pointer"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                  <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <Download className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand transition-colors mb-1">{resource.title}</h4>
                <p className="text-sm text-slate-500 font-medium">{resource.author}</p>
                <button className="w-full mt-6 py-3 bg-slate-50 text-slate-900 font-bold rounded-xl hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-2">
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
              <div className="relative w-full max-w-6xl aspect-video bg-black shadow-sm rounded-xl overflow-hidden group/player">
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
                      <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center text-brand shadow-sm">
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
              <header className="h-20 px-6 sm:px-10 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-2 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                  title="Back to Career"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-xs font-bold hidden sm:inline">Back</span>
                </button>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Thumbs Up (Like) */}
                  <button 
                    onClick={() => handleVote('like')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      articleFeedback.userVote === 'like'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80'
                    }`}
                    title="Like this article"
                  >
                    <ThumbsUp className={`w-4 h-4 ${articleFeedback.userVote === 'like' ? 'fill-emerald-500 text-emerald-600' : ''}`} />
                    <span>{articleFeedback.likes}</span>
                    <span className="hidden sm:inline font-medium">Likes</span>
                  </button>

                  {/* Thumbs Down (Dislike) */}
                  <button 
                    onClick={() => handleVote('dislike')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      articleFeedback.userVote === 'dislike'
                        ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80'
                    }`}
                    title="Dislike this article"
                  >
                    <ThumbsDown className={`w-4 h-4 ${articleFeedback.userVote === 'dislike' ? 'fill-rose-500 text-rose-600' : ''}`} />
                    <span>{articleFeedback.dislikes}</span>
                  </button>

                  <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

                  <button 
                    onClick={() => setIsSaved(!isSaved)}
                    className={`flex items-center gap-2 px-4 py-2 font-bold rounded-xl text-xs transition-all ${
                      isSaved ? 'bg-brand text-white shadow-sm' : 'bg-brand/10 text-brand hover:bg-brand/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('Article link copied to clipboard!');
                    }}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    title="Share article"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Main Reading Canvas (Distraction-Free) */}
              <div className="max-w-4xl mx-auto w-full py-12 px-6 sm:px-10 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {selectedArticle.category || career.category}
                    </span>
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime || '5 mins read'}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                    {selectedArticle.title}
                  </h1>
                  <div className="flex items-center gap-4 py-2 border-y border-slate-100">
                    <img 
                      src={`https://picsum.photos/seed/${selectedArticle.author || 'author'}/100/100`} 
                      className="w-11 h-11 rounded-full object-cover border-2 border-slate-100" 
                      alt={selectedArticle.author} 
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{selectedArticle.author || 'Career Insights'}</p>
                      <p className="text-xs text-slate-500 font-medium">
                        {career.title} • {selectedArticle.readTime || '5 mins read'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  <img 
                    src={selectedArticle.image || selectedArticle.thumbnail} 
                    className="w-full max-h-[480px] object-cover" 
                    alt={selectedArticle.title} 
                  />
                </div>

                {/* Article Content / Rich Text */}
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg">
                  {selectedArticle.about ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: selectedArticle.about }} 
                      className="space-y-4"
                    />
                  ) : (
                    <>
                      <p className="font-medium text-slate-600 leading-relaxed">
                        Maxwell's equations—the foundation of classical electromagnetism—describe light as a wave that moves with a characteristic velocity. The modern view is that light needs no medium of transmission, but Maxwell and his contemporaries were convinced that light waves were propagated in a medium, analogous to sound propagating in air, and ripples propagating on the surface of a pond.
                      </p>
                      <p className="font-medium text-slate-600 leading-relaxed mt-4">
                        This hypothetical medium was called the luminiferous aether, at rest relative to the "fixed stars" and through which the Earth moves. In this comprehensive guide, we delve into how emerging technological trends, automated tools, and digital transformation are reshaping workflows and creating new frontiers of opportunity for aspiring professionals.
                      </p>
                    </>
                  )}
                </div>

                {/* Article Interactive Feedback Section */}
                <div className="mt-12 pt-8 border-t border-slate-200/80">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        Was this article helpful?
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Your feedback helps us curate higher-quality guidance for future careers.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleVote('like')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                          articleFeedback.userVote === 'like'
                            ? 'bg-emerald-600 text-white shadow-emerald-600/20 scale-105'
                            : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-emerald-700 border border-slate-200'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${articleFeedback.userVote === 'like' ? 'fill-white' : ''}`} />
                        <span>Helpful ({articleFeedback.likes})</span>
                      </button>

                      <button
                        onClick={() => handleVote('dislike')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                          articleFeedback.userVote === 'dislike'
                            ? 'bg-rose-600 text-white shadow-rose-600/20 scale-105'
                            : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-rose-700 border border-slate-200'
                        }`}
                      >
                        <ThumbsDown className={`w-4 h-4 ${articleFeedback.userVote === 'dislike' ? 'fill-white' : ''}`} />
                        <span>Not helpful ({articleFeedback.dislikes})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
