import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, TrendingUp, Target, DollarSign, Briefcase } from 'lucide-react';
import { careersStorage } from '../../../utils/storage';
import { careerGlossary } from '../../../data/careers';

interface CompareCareersModalProps {
  careerIds: number[];
  onClose: () => void;
}

const getFullCareerDetails = (id: number) => {
  const storedCareers = careersStorage.get([]);
  let found = storedCareers.find((c: any) => c.id === id);

  if (!found) {
    let idCounter = 1;
    for (const [cluster, jobs] of Object.entries(careerGlossary)) {
      for (const job of jobs) {
        if (idCounter === id) {
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

    const salaryObj = typeof found.salary === 'object' ? found.salary : {
      entry: '$60,000',
      average: found.salary || '$95,000',
      senior: '$150,000+',
      median: found.salary ? found.salary.split('-')[0].trim() : '$85,000'
    };

    return {
      ...found,
      salaryObj,
      growth: found.growth ? `${found.growth} (Faster than average)` : '22% (Faster than average)',
      education: found.education || "Bachelor's Degree",
      skills,
      responsibilities
    };
  }

  return null;
};

export default function CompareCareersModal({ careerIds, onClose }: CompareCareersModalProps) {
  const careers = useMemo(() => {
    return careerIds.map(id => getFullCareerDetails(id)).filter(Boolean);
  }, [careerIds]);

  if (careers.length !== 2) return null;

  const [career1, career2] = careers;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-2xl font-bold text-slate-900">Career Comparison</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Career 1 */}
            <div className="space-y-8">
              <div>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                  <img src={career1.image} alt={career1.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6">
                    <p className="text-xs font-bold text-brand uppercase tracking-wider mb-2">{career1.category}</p>
                    <h3 className="text-2xl font-bold text-white">{career1.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">{career1.description}</p>
              </div>

              {/* Match Score */}
              <div className="bg-brand/5 border border-brand/10 p-5 rounded-2xl">
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider mb-3">
                  <span className="text-slate-500">Your Match Score</span>
                  <span className="text-brand text-lg">{career1.matchScore || parseInt(career1.match)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand rounded-full" 
                    style={{ width: `${career1.matchScore || parseInt(career1.match)}%` }}
                  ></div>
                </div>
              </div>

              {/* Market Trends (Growth & Salary) */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand" /> Market Trends
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> Job Growth
                    </p>
                    <p className="text-sm font-bold text-slate-900">{career1.growth}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> Median Salary
                    </p>
                    <p className="text-sm font-bold text-slate-900">{career1.salaryObj.median}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand" /> Core Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {career1.skills.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200/60">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Duties */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand" /> Key Duties
                </h4>
                <div className="space-y-3">
                  {career1.responsibilities.map((resp: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-2"></div>
                      <p className="text-slate-700 font-medium text-sm leading-relaxed">{resp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Career 2 */}
            <div className="space-y-8 relative">
              <div className="hidden md:block absolute -left-6 md:-left-6 lg:-left-6 top-10 bottom-10 w-px bg-slate-200"></div>
              
              <div>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                  <img src={career2.image} alt={career2.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6">
                    <p className="text-xs font-bold text-brand uppercase tracking-wider mb-2">{career2.category}</p>
                    <h3 className="text-2xl font-bold text-white">{career2.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">{career2.description}</p>
              </div>

              {/* Match Score */}
              <div className="bg-brand/5 border border-brand/10 p-5 rounded-2xl">
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider mb-3">
                  <span className="text-slate-500">Your Match Score</span>
                  <span className="text-brand text-lg">{career2.matchScore || parseInt(career2.match)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand rounded-full" 
                    style={{ width: `${career2.matchScore || parseInt(career2.match)}%` }}
                  ></div>
                </div>
              </div>

              {/* Market Trends (Growth & Salary) */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand" /> Market Trends
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> Job Growth
                    </p>
                    <p className="text-sm font-bold text-slate-900">{career2.growth}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> Median Salary
                    </p>
                    <p className="text-sm font-bold text-slate-900">{career2.salaryObj.median}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand" /> Core Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {career2.skills.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200/60">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Duties */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand" /> Key Duties
                </h4>
                <div className="space-y-3">
                  {career2.responsibilities.map((resp: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-2"></div>
                      <p className="text-slate-700 font-medium text-sm leading-relaxed">{resp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
