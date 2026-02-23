import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  Plus, 
  X, 
  Upload, 
  Video, 
  FileText, 
  Link as LinkIcon,
  ChevronRight,
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { careersStorage } from '../../../utils/storage';

export default function AdminEditCareer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'basic' | 'resources'>('basic');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Science',
    about: '',
    skills: [] as string[],
    subjects: [] as string[],
    salaryMin: '',
    salaryMax: ''
  });

  useEffect(() => {
    const allCareers = careersStorage.get([]);
    const career = allCareers.find((c: any) => c.id === Number(id));
    if (career) {
      setFormData({
        title: career.name,
        category: career.category,
        about: career.description || '',
        skills: career.skills || ['Software testing and quality assurance', 'Problem-solving skills'],
        subjects: career.subjects || ['Computer Science', 'Mathematics'],
        salaryMin: career.salaryMin || '100,000',
        salaryMax: career.salaryMax || '500,000'
      });
      setBgImage(career.image);
    }
  }, [id]);

  const handleUpdate = () => {
    const allCareers = careersStorage.get([]);
    const updated = allCareers.map((c: any) => {
      if (c.id === Number(id)) {
        return {
          ...c,
          name: formData.title,
          category: formData.category,
          description: formData.about,
          image: bgImage,
          salaryMin: formData.salaryMin,
          salaryMax: formData.salaryMax,
          skills: formData.skills,
          subjects: formData.subjects
        };
      }
      return c;
    });
    careersStorage.save(updated);
    navigate('/admin/careers');
  };

  const [resources, setResources] = useState({
    videos: [
      { id: 1, title: 'Tech design requirements', ownedBy: 'James Brown', thumbnail: 'https://picsum.photos/seed/v1/400/200' },
      { id: 2, title: 'Tech design requirements', ownedBy: 'James Brown', thumbnail: 'https://picsum.photos/seed/v2/400/200' },
      { id: 3, title: 'Tech design requirements', ownedBy: 'James Brown', thumbnail: 'https://picsum.photos/seed/v3/400/200' }
    ],
    articles: [
      { id: 1, title: 'Tech design requirements', author: 'James Brown', thumbnail: 'https://picsum.photos/seed/a1/400/200' },
      { id: 2, title: 'Tech design requirements', author: 'James Brown', thumbnail: 'https://picsum.photos/seed/a2/400/200' },
      { id: 3, title: 'Tech design requirements', author: 'James Brown', thumbnail: 'https://picsum.photos/seed/a3/400/200' }
    ],
    links: [
      { id: 1, title: 'Tech design requirements', url: 'www.weblink.com', thumbnail: 'https://picsum.photos/seed/l1/400/200' },
      { id: 2, title: 'Tech design requirements', url: 'www.weblink.com', thumbnail: 'https://picsum.photos/seed/l2/400/200' },
      { id: 3, title: 'Tech design requirements', url: 'www.weblink.com', thumbnail: 'https://picsum.photos/seed/l3/400/200' }
    ]
  });

  const handleImageClick = () => fileInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBgImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <button 
        onClick={() => navigate('/admin/careers')}
        className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Edit Software Engineering</h1>
        <p className="text-slate-500 font-medium mt-1">Update the details and resources for this career path.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-sm mb-10 w-fit mx-auto">
        <button 
          onClick={() => setActiveTab('basic')}
          className={`px-12 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'basic' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Basic Info
        </button>
        <button 
          onClick={() => setActiveTab('resources')}
          className={`px-12 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'resources' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Add Resources
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'basic' ? (
          <motion.div
            key="basic"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            {/* Background Image Upload */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Background Image</h3>
              <div 
                onClick={handleImageClick}
                className="relative h-64 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand/50 hover:bg-slate-100/50 transition-all group overflow-hidden"
              >
                {bgImage ? (
                  <>
                    <img src={bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
                        <Camera className="w-8 h-8 text-brand" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 font-bold">Click to upload or drag and drop</p>
                    <p className="text-slate-400 text-sm font-medium mt-1">PNG, JPG or GIF (max. 10MB)</p>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
            </div>

            {/* Basic Details */}
            <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Career Title</label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Career Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                  >
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Technology">Technology</option>
                    <option value="Creative">Creative</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">About</label>
                <textarea 
                  rows={8}
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none"
                />
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 ml-1">Top Skills</label>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-600 border border-slate-100">
                      {skill} <X className="w-3 h-3 cursor-pointer hover:text-red-500" />
                    </div>
                  ))}
                  <button className="px-4 py-2 bg-brand/10 text-brand rounded-xl flex items-center gap-2 text-xs font-bold hover:bg-brand/20 transition-all">
                    <Plus className="w-3 h-3" /> Add Skill
                  </button>
                </div>
              </div>

              {/* Subjects */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 ml-1">Top Subject Required</label>
                <div className="flex flex-wrap gap-2">
                  {formData.subjects.map((subject, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-600 border border-slate-100">
                      {subject} <X className="w-3 h-3 cursor-pointer hover:text-red-500" />
                    </div>
                  ))}
                  <button className="px-4 py-2 bg-brand/10 text-brand rounded-xl flex items-center gap-2 text-xs font-bold hover:bg-brand/20 transition-all">
                    <Plus className="w-3 h-3" /> Add Subject
                  </button>
                </div>
              </div>

              {/* Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Average Salary (Min)</label>
                  <input 
                    type="text" 
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Average Salary (Max)</label>
                  <input 
                    type="text" 
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8">
                <button 
                  onClick={() => navigate('/admin/careers')}
                  className="px-10 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setActiveTab('resources')}
                  className="px-10 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="resources"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Videos Section */}
            <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Video className="w-6 h-6 text-brand" /> Videos
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Videos have to be based on the career you are creating.</p>
                </div>
                <button className="p-3 bg-brand/10 text-brand rounded-2xl hover:bg-brand/20 transition-all">
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.videos.map((video) => (
                  <div key={video.id} className="group relative bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{video.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Owned by - {video.ownedBy}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-brand transition-colors shadow-sm">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-red-500 transition-colors shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 text-center">Click to upload or drag and drop</p>
                  <p className="text-[10px] font-bold text-brand mt-2">Click to add a URL</p>
                </div>
              </div>
            </div>

            {/* Articles Section */}
            <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-indigo-500" /> Articles
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Articles have to be based on the career you are creating.</p>
                </div>
                <button className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl hover:bg-indigo-100 transition-all">
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.articles.map((article) => (
                  <div key={article.id} className="group relative bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
                    <img src={article.thumbnail} alt={article.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{article.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Author - {article.author}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-brand transition-colors shadow-sm">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-red-500 transition-colors shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 text-center">Click to upload or drag and drop</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">PDF (max. 500x400px)</p>
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <LinkIcon className="w-6 h-6 text-emerald-500" /> Resources
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Resources have to be based on the career you are creating.</p>
                </div>
                <button className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl hover:bg-emerald-100 transition-all">
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.links.map((link) => (
                  <div key={link.id} className="group relative bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
                    <img src={link.thumbnail} alt={link.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{link.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Web Link: {link.url}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-brand transition-colors shadow-sm">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-red-500 transition-colors shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 text-center">Add Resources</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 text-center">You haven't added any links yet!</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8">
              <button 
                onClick={() => setActiveTab('basic')}
                className="px-10 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                Back
              </button>
              <button 
                onClick={handleUpdate}
                className="px-10 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                Update Career <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
