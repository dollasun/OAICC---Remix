import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Lock,
  ShieldCheck,
  X,
  Bell,
  Trash2,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Plus,
  Edit2,
  Star,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { notifPrefs } from '../../../utils/schoolData';
import {
  NotificationsPanel, PoliciesPanel, SaveBar, SecurityPanel, SettingsPanel, SettingsShell, SignOutModal, savedNow, shrinkImage, usePolicies,
  type NotificationItem,
} from '../Shared/SettingsLayout';
import { 
  counselingSessionsStorage,
  counselorProfileStorage, 
  counselorsStorage, 
  CounselorProfileData,
  CounselorService,
  CounselorEducation,
  CounselorExperience 
} from '../../../utils/storage';

const POPULAR_EXPERTISE_SUGGESTIONS = [
  'University Admissions',
  'Scholarships',
  'Subject Selection',
  'Career Mapping',
  'Study Abroad',
  'STEM Programs',
  'College Essay Review',
  'Financial Aid Guidance',
  'Interview Coaching',
  'Vocational Guidance',
  'Mental Wellbeing'
];

type CounselorSection = 'personal' | 'professional' | 'security' | 'notifications' | 'policies';
const SECTIONS: CounselorSection[] = ['personal', 'professional', 'security', 'notifications', 'policies'];

const COUNSELOR_NOTIFICATIONS: NotificationItem[] = [
  { id: 'sessions', title: 'Session Requests & Reminders', desc: 'Alerts when a student books, reschedules or is about to start a session.', badge: 'Recommended' },
  { id: 'messages', title: 'Student Messages', desc: 'Alerts when a student or parent sends you a message.' },
  { id: 'assignments', title: 'New Student Assignments', desc: 'Alerts when a student is matched with you.' },
];

export default function CounselorProfile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  // Load counselor profile data from persistent storage
  const [profile, setProfile] = useState<CounselorProfileData>(() => counselorProfileStorage.get());

  // Form state for basic info & about me
  const [formData, setFormData] = useState({
    firstName: profile.firstName || 'Alfred',
    lastName: profile.lastName || 'Funmbi',
    title: profile.title || profile.role || 'Senior Academic Counselor',
    school: profile.school || 'Lagos City College',
    email: profile.email || 'alfred.funmbi@oaicc.com',
    phone: profile.phone || '+234 803 456 7890',
    location: profile.location || 'Lagos, Nigeria',
    aboutMe: profile.aboutMe || '',
    expertise: [...(profile.expertise || [])],
    services: [...(profile.services || [])],
    education: [...(profile.education || [])],
    experience: [...(profile.experience || [])],
  });

  // Expertise input state
  const [newExpertiseInput, setNewExpertiseInput] = useState('');

  // Which settings section is open (?tab=… deep-links, e.g. ?tab=policies).
  const tabParam = searchParams.get('tab') as CounselorSection | null;
  const initialSection: CounselorSection = tabParam && SECTIONS.includes(tabParam) ? tabParam : 'personal';

  // Modals for Service, Education, Experience, Password, Sign Out
  const [serviceModal, setServiceModal] = useState<{ isOpen: boolean; item?: CounselorService; index?: number }>({
    isOpen: false
  });
  const [serviceFormData, setServiceFormData] = useState({ name: '', price: 'FREE FOR STUDENTS' });

  const [educationModal, setEducationModal] = useState<{ isOpen: boolean; item?: CounselorEducation; index?: number }>({
    isOpen: false
  });
  const [educationFormData, setEducationFormData] = useState({ degree: '', school: '', year: '' });

  const [experienceModal, setExperienceModal] = useState<{ isOpen: boolean; item?: CounselorExperience; index?: number }>({
    isOpen: false
  });
  const [experienceFormData, setExperienceFormData] = useState({ role: '', school: '', period: '' });

  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  // Sync formData whenever profile changes
  useEffect(() => {
    setFormData({
      firstName: profile.firstName || 'Alfred',
      lastName: profile.lastName || 'Funmbi',
      title: profile.title || profile.role || 'Senior Academic Counselor',
      school: profile.school || 'Lagos City College',
      email: profile.email || 'alfred.funmbi@oaicc.com',
      phone: profile.phone || '+234 803 456 7890',
      location: profile.location || 'Lagos, Nigeria',
      aboutMe: profile.aboutMe || '',
      expertise: [...(profile.expertise || [])],
      services: [...(profile.services || [])],
      education: [...(profile.education || [])],
      experience: [...(profile.experience || [])],
    });
  }, [profile]);

  // Helper to persist updates to storage
  const saveProfileData = (updated: Partial<CounselorProfileData>, successMessage?: string) => {
    const newProfile = {
      ...profile,
      ...updated,
      name: updated.firstName && updated.lastName 
        ? `${updated.firstName} ${updated.lastName}` 
        : updated.name || profile.name
    };
    setProfile(newProfile);
    counselorProfileStorage.save(newProfile);

    // Sync to counselorsStorage list
    try {
      const allCounselors = counselorsStorage.get([]);
      const updatedList = allCounselors.map((c: any) => {
        if (c.id === newProfile.id || c.email === newProfile.email) {
          return {
            ...c,
            name: newProfile.name,
            role: newProfile.title,
            specialization: newProfile.expertise?.[0] || c.specialization,
            image: newProfile.image
          };
        }
        return c;
      });
      counselorsStorage.save(updatedList);
    } catch (e) {
      // Ignore sync error
    }

    if (successMessage) {
      showToast(successMessage, 'success');
    }
  };

  // --- EXPERTISE HANDLERS ---
  const handleAddExpertise = (tagToAdd?: string) => {
    const tag = (tagToAdd || newExpertiseInput).trim();
    if (!tag) return;
    if (formData.expertise.includes(tag)) {
      showToast('This expertise is already in your list');
      return;
    }
    const updated = [...formData.expertise, tag];
    setFormData(prev => ({ ...prev, expertise: updated }));
    saveProfileData({ expertise: updated }, `Added "${tag}" to expertise`);
    if (!tagToAdd) setNewExpertiseInput('');
  };

  const handleRemoveExpertise = (tagToRemove: string) => {
    const updated = formData.expertise.filter(t => t !== tagToRemove);
    setFormData(prev => ({ ...prev, expertise: updated }));
    saveProfileData({ expertise: updated }, `Removed "${tagToRemove}"`);
  };

  // --- COUNSELING SERVICES HANDLERS ---
  const handleOpenAddService = () => {
    setServiceFormData({ name: '', price: 'FREE FOR STUDENTS' });
    setServiceModal({ isOpen: true });
  };

  const handleOpenEditService = (service: CounselorService, index: number) => {
    setServiceFormData({ name: service.name, price: service.price });
    setServiceModal({ isOpen: true, item: service, index });
  };

  const handleSaveService = () => {
    if (!serviceFormData.name.trim()) {
      showToast('Please enter a service name');
      return;
    }
    const currentServices = [...(profile.services || [])];
    if (serviceModal.item && serviceModal.index !== undefined) {
      currentServices[serviceModal.index] = {
        ...serviceModal.item,
        name: serviceFormData.name.trim(),
        price: serviceFormData.price.trim() || 'FREE FOR STUDENTS'
      };
      saveProfileData({ services: currentServices }, 'Counseling service updated!');
    } else {
      const newService: CounselorService = {
        id: Date.now(),
        name: serviceFormData.name.trim(),
        price: serviceFormData.price.trim() || 'FREE FOR STUDENTS'
      };
      currentServices.push(newService);
      saveProfileData({ services: currentServices }, 'New counseling service added!');
    }
    setFormData(prev => ({ ...prev, services: currentServices }));
    setServiceModal({ isOpen: false });
  };

  const handleDeleteService = (index: number) => {
    const currentServices = [...(profile.services || [])];
    const removedName = currentServices[index]?.name;
    currentServices.splice(index, 1);
    saveProfileData({ services: currentServices }, `Deleted service "${removedName}"`);
    setFormData(prev => ({ ...prev, services: currentServices }));
  };

  // --- EDUCATION HANDLERS ---
  const handleOpenAddEducation = () => {
    setEducationFormData({ degree: '', school: '', year: '' });
    setEducationModal({ isOpen: true });
  };

  const handleOpenEditEducation = (edu: CounselorEducation, index: number) => {
    setEducationFormData({ degree: edu.degree, school: edu.school, year: edu.year });
    setEducationModal({ isOpen: true, item: edu, index });
  };

  const handleSaveEducation = () => {
    if (!educationFormData.degree.trim() || !educationFormData.school.trim()) {
      showToast('Please enter both qualification and institution');
      return;
    }
    const currentEducation = [...(profile.education || [])];
    if (educationModal.item && educationModal.index !== undefined) {
      currentEducation[educationModal.index] = {
        ...educationModal.item,
        degree: educationFormData.degree.trim(),
        school: educationFormData.school.trim(),
        year: educationFormData.year.trim()
      };
      saveProfileData({ education: currentEducation }, 'Education qualification updated!');
    } else {
      const newEdu: CounselorEducation = {
        id: Date.now(),
        degree: educationFormData.degree.trim(),
        school: educationFormData.school.trim(),
        year: educationFormData.year.trim() || `${new Date().getFullYear()}`
      };
      currentEducation.push(newEdu);
      saveProfileData({ education: currentEducation }, 'Education qualification added!');
    }
    setFormData(prev => ({ ...prev, education: currentEducation }));
    setEducationModal({ isOpen: false });
  };

  const handleDeleteEducation = (index: number) => {
    const currentEducation = [...(profile.education || [])];
    const removedDegree = currentEducation[index]?.degree;
    currentEducation.splice(index, 1);
    saveProfileData({ education: currentEducation }, `Removed "${removedDegree}"`);
    setFormData(prev => ({ ...prev, education: currentEducation }));
  };

  // --- PROFESSIONAL HISTORY HANDLERS ---
  const handleOpenAddExperience = () => {
    setExperienceFormData({ role: '', school: '', period: '' });
    setExperienceModal({ isOpen: true });
  };

  const handleOpenEditExperience = (exp: CounselorExperience, index: number) => {
    setExperienceFormData({ role: exp.role, school: exp.school, period: exp.period });
    setExperienceModal({ isOpen: true, item: exp, index });
  };

  const handleSaveExperience = () => {
    if (!experienceFormData.role.trim() || !experienceFormData.school.trim()) {
      showToast('Please enter both role title and organization');
      return;
    }
    const currentExperience = [...(profile.experience || [])];
    if (experienceModal.item && experienceModal.index !== undefined) {
      currentExperience[experienceModal.index] = {
        ...experienceModal.item,
        role: experienceFormData.role.trim(),
        school: experienceFormData.school.trim(),
        period: experienceFormData.period.trim()
      };
      saveProfileData({ experience: currentExperience }, 'Professional history updated!');
    } else {
      const newExp: CounselorExperience = {
        id: Date.now(),
        role: experienceFormData.role.trim(),
        school: experienceFormData.school.trim(),
        period: experienceFormData.period.trim() || 'Present'
      };
      currentExperience.push(newExp);
      saveProfileData({ experience: currentExperience }, 'Professional history entry added!');
    }
    setFormData(prev => ({ ...prev, experience: currentExperience }));
    setExperienceModal({ isOpen: false });
  };

  const handleDeleteExperience = (index: number) => {
    const currentExperience = [...(profile.experience || [])];
    const removedRole = currentExperience[index]?.role;
    currentExperience.splice(index, 1);
    saveProfileData({ experience: currentExperience }, `Removed "${removedRole}"`);
    setFormData(prev => ({ ...prev, experience: currentExperience }));
  };

  // --- SAVE ALL PERSONAL / PROFILE FORM FIELDS ---
  const handleSaveProfileSection = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileData({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      title: formData.title.trim(),
      role: formData.title.trim(),
      school: formData.school.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      aboutMe: formData.aboutMe.trim(),
      expertise: formData.expertise,
      services: formData.services,
      education: formData.education,
      experience: formData.experience,
    }, 'Profile information updated successfully!');
  };

  const [activeSection, setActiveSection] = useState<CounselorSection>(initialSection);
  const policies = usePolicies('counselor');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => notifPrefs.get('counselor', String(profile.id)));
  const isOn = (id: string) => prefs[id] !== false;
  const writePrefs = (next: Record<string, boolean>) => { setPrefs(next); notifPrefs.set('counselor', String(profile.id), next); };

  const changeSection = (id: string) => {
    setActiveSection(id as CounselorSection);
    setSearchParams(id === 'personal' ? {} : { tab: id });
  };

  const savePersonal = (e: React.FormEvent) => {
    handleSaveProfileSection(e);
    setSavedAt(savedNow());
  };

  const signOut = () => {
    localStorage.removeItem('counselor_auth');
    localStorage.removeItem('user_role');
    navigate('/counselor/signin');
  };

  // Overview numbers from this counsellor's real sessions.
  const mySessions = (counselingSessionsStorage.get() as { counselorId?: number; counselorName?: string; status?: string; studentRef?: unknown; studentId?: unknown }[])
    .filter(s => s.counselorId === profile.id || s.counselorName === profile.name);
  const studentsServed = new Set(mySessions.map(s => String(s.studentRef ?? s.studentId))).size;

  return (
    <>
      <SettingsShell
        subtitle="Manage your counsellor profile, expertise, services, security and notification preferences."
        banner={{
          avatarUrl: profile.image || `https://picsum.photos/seed/counselor-${profile.id}/200/200`,
          onAvatarFile: async file => {
            try { saveProfileData({ image: await shrinkImage(file) }, 'Profile photo updated successfully!'); }
            catch { showToast('That image could not be used. Try a different file.', 'error'); }
          },
          name: `${formData.firstName} ${formData.lastName}`.trim() || profile.name || 'Your account',
          roleLabel: 'Counsellor',
          email: formData.email,
          meta: [
            formData.school || 'Institution not set',
            <><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {profile.rating ?? '—'} ({profile.reviews ?? 0} reviews)</>,
            profile.availability || 'Availability not set',
          ],
          statusLabel: 'Active account',
          verified: profile.isVerified,
        }}
        nav={[
          { id: 'personal', label: 'Personal Information', description: 'Profile identity & contact info', icon: User },
          { id: 'professional', label: 'Professional Profile', description: 'Expertise, services & history', icon: Briefcase },
          { id: 'security', label: 'Security & Access', description: 'Password & active sessions', icon: Lock },
          { id: 'notifications', label: 'Notifications', description: 'Alerts & activity updates', icon: Bell },
          { id: 'policies', label: 'Platform Policies', description: 'Legal terms & compliance', icon: ShieldCheck, badge: `${policies.length} Docs` },
        ]}
        active={activeSection}
        onSelect={changeSection}
        summary={{ title: 'Counselling Overview', items: [
          { label: 'Students', value: studentsServed },
          { label: 'Sessions', value: mySessions.length },
          { label: 'Upcoming', value: mySessions.filter(s => s.status !== 'Completed').length },
          { label: 'Rating', value: profile.rating ?? '—' },
        ] }}
        onSignOutClick={() => setIsSignOutOpen(true)}
      >
        {activeSection === 'personal' && (
          <SettingsPanel panelKey="personal" icon={User} title="Personal Information" description="Update your name, role, institution and contact details shown to students.">
            <form onSubmit={savePersonal} className="p-6 sm:p-8 space-y-6">
                  {/* PART 1A: Basic Personal & Contact Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">First Name</label>
                        <input 
                          type="text" 
                          value={formData.firstName} 
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm text-slate-700 dark:text-slate-200" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Last Name</label>
                        <input 
                          type="text" 
                          value={formData.lastName} 
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm text-slate-700 dark:text-slate-200" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Designation / Role Title</label>
                        <input 
                          type="text" 
                          value={formData.title} 
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm text-slate-700 dark:text-slate-200" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Primary School / Institution</label>
                        <input 
                          type="text" 
                          value={formData.school} 
                          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm text-slate-700 dark:text-slate-200" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm text-slate-700 dark:text-slate-200" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                        <input 
                          type="tel" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm text-slate-700 dark:text-slate-200" 
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Location</label>
                        <input 
                          type="text" 
                          value={formData.location} 
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm text-slate-700 dark:text-slate-200" 
                        />
                      </div>
                    </div>
                  </div>
              <SaveBar savedAt={savedAt} />
            </form>
          </SettingsPanel>
        )}

        {activeSection === 'professional' && (
          <SettingsPanel panelKey="professional" icon={Briefcase} tone="bg-amber-50 text-amber-600" title="Professional Profile" description="What students see when choosing a counsellor: about you, expertise, services, education and history.">
            <form onSubmit={savePersonal} className="p-6 sm:p-8 space-y-10">
                  {/* PART 1B: About Me Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">About Me</h4>
                        <p className="text-xs font-medium text-slate-500">
                          Introduce yourself, share your experience, counseling philosophy, and student guidance focus.
                        </p>
                      </div>
                    </div>
                    <textarea 
                      rows={5} 
                      value={formData.aboutMe} 
                      onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                      placeholder="Write your professional bio and counseling approach..."
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 resize-none leading-relaxed text-sm sm:text-base border border-slate-100 dark:border-slate-800" 
                    />
                  </div>

                  {/* PART 1C: Expertise Section */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Expertise</h4>
                      <p className="text-xs font-medium text-slate-500">
                        Add and manage specific skills and guidance topics you assist students with.
                      </p>
                    </div>

                    {/* Active tags */}
                    <div className="flex flex-wrap gap-2.5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 min-h-[64px] items-center">
                      {formData.expertise.map((exp) => (
                        <div 
                          key={exp} 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-brand/5 dark:bg-brand/10 border border-brand/20 rounded-xl text-sm font-bold text-brand shadow-xs"
                        >
                          <span>{exp}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveExpertise(exp)}
                            className="hover:bg-brand/20 p-0.5 rounded-full text-brand/70 hover:text-brand transition-colors"
                            title={`Remove ${exp}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {formData.expertise.length === 0 && (
                        <p className="text-xs text-slate-400 font-medium">No expertise tags added yet. Type below or choose from suggestions.</p>
                      )}
                    </div>

                    {/* Add Tag Input */}
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newExpertiseInput}
                        onChange={(e) => setNewExpertiseInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddExpertise();
                          }
                        }}
                        placeholder="Type a new expertise (e.g. Study Abroad, SAT Prep) and press Add..."
                        className="flex-1 px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleAddExpertise()}
                        className="px-6 py-3 bg-brand text-white rounded-xl font-bold text-sm hover:scale-105 transition-all flex items-center gap-1.5 shadow-sm shadow-brand/10"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>

                    {/* Quick Suggestions */}
                    <div className="pt-1">
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2">Suggested areas of expertise:</p>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_EXPERTISE_SUGGESTIONS.map((sug) => {
                          const isAdded = formData.expertise.includes(sug);
                          return (
                            <button
                              key={sug}
                              type="button"
                              onClick={() => handleAddExpertise(sug)}
                              disabled={isAdded}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isAdded
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand/10 hover:text-brand'
                              }`}
                            >
                              + {sug}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* PART 1D: Counseling Services Section (Matches reference design) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <Award className="w-5 h-5 text-brand" /> Counseling Services
                        </h4>
                        <p className="text-xs font-medium text-slate-500">
                          Configure advisory offerings and session types visible to students.
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={handleOpenAddService}
                        className="flex items-center gap-1.5 px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl shadow-sm shadow-brand/10 hover:scale-105 transition-all"
                      >
                        <Plus className="w-4 h-4" /> Add Service
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.services.map((service, idx) => (
                        <div 
                          key={service.id || idx} 
                          className="group relative p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand/30 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h5 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-brand transition-colors">
                                {service.name}
                              </h5>
                              <p className="text-xs font-bold text-emerald-500 mt-2 tracking-wider uppercase">
                                {service.price}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                type="button"
                                onClick={() => handleOpenEditService(service, idx)}
                                className="p-2 text-slate-400 hover:text-brand hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title="Edit Service"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleDeleteService(idx)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title="Delete Service"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {formData.services.length === 0 && (
                        <div className="col-span-2 text-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                          <p className="text-slate-400 font-bold text-sm mb-2">No counseling services added</p>
                          <button type="button" onClick={handleOpenAddService} className="text-brand font-bold text-xs hover:underline">
                            + Add your first service
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PART 1E: Education & Professional History (2-column layout matching reference design) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Education Card */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-brand" /> Education
                          </h4>
                          <p className="text-xs font-medium text-slate-500">Degrees and qualifications</p>
                        </div>
                        <button 
                          type="button"
                          onClick={handleOpenAddEducation}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/5 dark:bg-brand/10 text-brand font-bold text-xs rounded-xl hover:bg-brand/10 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>

                      <div className="space-y-6">
                        {formData.education.map((edu, idx) => (
                          <div 
                            key={edu.id || idx} 
                            className="group relative pl-7 before:absolute before:left-0 before:top-2 before:bottom-[-24px] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 last:before:hidden"
                          >
                            {/* Cyan solid circle indicator */}
                            <div className="absolute left-[-3.5px] top-2 w-2 h-2 rounded-full bg-brand ring-4 ring-slate-50 dark:ring-slate-800"></div>

                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{edu.degree}</h5>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{edu.school}</p>
                                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{edu.year}</p>
                              </div>

                              <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  type="button"
                                  onClick={() => handleOpenEditEducation(edu, idx)}
                                  className="p-1.5 text-slate-400 hover:text-brand hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Edit Qualification"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteEducation(idx)}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Delete Qualification"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {formData.education.length === 0 && (
                          <p className="text-xs text-slate-400 font-medium">No education qualifications added yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Professional History Card */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand" /> Professional History
                          </h4>
                          <p className="text-xs font-medium text-slate-500">Past & current advisory roles</p>
                        </div>
                        <button 
                          type="button"
                          onClick={handleOpenAddExperience}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/5 dark:bg-brand/10 text-brand font-bold text-xs rounded-xl hover:bg-brand/10 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>

                      <div className="space-y-6">
                        {formData.experience.map((exp, idx) => (
                          <div 
                            key={exp.id || idx} 
                            className="group relative pl-7 before:absolute before:left-0 before:top-2 before:bottom-[-24px] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 last:before:hidden"
                          >
                            {/* Cyan solid circle indicator */}
                            <div className="absolute left-[-3.5px] top-2 w-2 h-2 rounded-full bg-brand ring-4 ring-slate-50 dark:ring-slate-800"></div>

                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{exp.role}</h5>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{exp.school}</p>
                                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{exp.period}</p>
                              </div>

                              <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  type="button"
                                  onClick={() => handleOpenEditExperience(exp, idx)}
                                  className="p-1.5 text-slate-400 hover:text-brand hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Edit Role"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteExperience(idx)}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Delete Role"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {formData.experience.length === 0 && (
                          <p className="text-xs text-slate-400 font-medium">No professional history added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
              <SaveBar savedAt={savedAt} label="Save Profile" />
            </form>
          </SettingsPanel>
        )}

        {activeSection === 'security' && <SecurityPanel onSignOutClick={() => setIsSignOutOpen(true)} />}

        {activeSection === 'notifications' && (
          <NotificationsPanel
            description="Choose which session and student activity appears in your notification inbox."
            items={COUNSELOR_NOTIFICATIONS}
            isOn={isOn}
            onToggle={id => { writePrefs({ ...prefs, [id]: !isOn(id) }); showToast('Notification preference updated'); }}
            onSetAll={enable => { writePrefs(Object.fromEntries(COUNSELOR_NOTIFICATIONS.map(n => [n.id, enable]))); showToast(enable ? 'All notifications enabled' : 'All notifications muted'); }}
          />
        )}

        {activeSection === 'policies' && (
          <PoliciesPanel role="counselor" governance="Counsellors work directly with students and must follow the counsellor code of conduct and safeguarding policies below." />
        )}
      </SettingsShell>

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}

      {/* Modal 1: Add / Edit Counseling Service */}
      <AnimatePresence>
        {serviceModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setServiceModal({ isOpen: false })}
              className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-100 dark:border-slate-800 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {serviceModal.item ? 'Edit Counseling Service' : 'Add Counseling Service'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">Service title and student pricing badge</p>
                </div>
                <button 
                  onClick={() => setServiceModal({ isOpen: false })}
                  className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Service Title</label>
                  <input 
                    type="text" 
                    value={serviceFormData.name} 
                    onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                    placeholder="e.g. University Application Review"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Pricing / Student Badge</label>
                  <input 
                    type="text" 
                    value={serviceFormData.price} 
                    onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                    placeholder="FREE FOR STUDENTS or Complimentary"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {['FREE FOR STUDENTS', 'COMPLIMENTARY', 'INCLUDED IN PROGRAM'].map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => setServiceFormData({ ...serviceFormData, price: badge })}
                      className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setServiceModal({ isOpen: false })}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveService}
                  className="px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-sm hover:scale-105 transition-all text-sm"
                >
                  {serviceModal.item ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Add / Edit Education */}
      <AnimatePresence>
        {educationModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setEducationModal({ isOpen: false })}
              className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-100 dark:border-slate-800 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {educationModal.item ? 'Edit Qualification' : 'Add Education Qualification'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">Degree, institution, and completion year</p>
                </div>
                <button 
                  onClick={() => setEducationModal({ isOpen: false })}
                  className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Degree / Qualification</label>
                  <input 
                    type="text" 
                    value={educationFormData.degree} 
                    onChange={(e) => setEducationFormData({ ...educationFormData, degree: e.target.value })}
                    placeholder="e.g. M.Ed. in Guidance and Counseling"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Institution / University</label>
                  <input 
                    type="text" 
                    value={educationFormData.school} 
                    onChange={(e) => setEducationFormData({ ...educationFormData, school: e.target.value })}
                    placeholder="e.g. University of Lagos"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Graduation Year</label>
                  <input 
                    type="text" 
                    value={educationFormData.year} 
                    onChange={(e) => setEducationFormData({ ...educationFormData, year: e.target.value })}
                    placeholder="e.g. 2007"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEducationModal({ isOpen: false })}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveEducation}
                  className="px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-sm hover:scale-105 transition-all text-sm"
                >
                  {educationModal.item ? 'Update Qualification' : 'Save Qualification'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 3: Add / Edit Professional History */}
      <AnimatePresence>
        {experienceModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setExperienceModal({ isOpen: false })}
              className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-100 dark:border-slate-800 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {experienceModal.item ? 'Edit Professional History' : 'Add Professional History'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">Role, organization, and employment period</p>
                </div>
                <button 
                  onClick={() => setExperienceModal({ isOpen: false })}
                  className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Role / Position Title</label>
                  <input 
                    type="text" 
                    value={experienceFormData.role} 
                    onChange={(e) => setExperienceFormData({ ...experienceFormData, role: e.target.value })}
                    placeholder="e.g. Senior Academic Counselor"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">School / Organization</label>
                  <input 
                    type="text" 
                    value={experienceFormData.school} 
                    onChange={(e) => setExperienceFormData({ ...experienceFormData, school: e.target.value })}
                    placeholder="e.g. Lagos City College"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Period (Years / Duration)</label>
                  <input 
                    type="text" 
                    value={experienceFormData.period} 
                    onChange={(e) => setExperienceFormData({ ...experienceFormData, period: e.target.value })}
                    placeholder="e.g. 2015 - Present"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 dark:text-slate-200 text-sm" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setExperienceModal({ isOpen: false })}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveExperience}
                  className="px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-sm hover:scale-105 transition-all text-sm"
                >
                  {experienceModal.item ? 'Update History' : 'Save History'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      <SignOutModal open={isSignOutOpen} onClose={() => setIsSignOutOpen(false)} portalName="Counsellor Portal" onConfirm={signOut} />
    </>
  );
}
