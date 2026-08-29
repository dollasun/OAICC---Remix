import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight,
  Target,
  Brain,
  Lightbulb,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Award
} from 'lucide-react';
import Logo from '../Logo';
import { INITIAL_QUESTIONS } from '../../data/assessmentQuestions';
import { Question } from '../../data/assessmentData';
import { useToast } from '../../context/ToastContext';

const sectionIcons: Record<string, React.ReactNode> = {
  'interests': <Lightbulb className="w-8 h-8 text-white" />,
  'strengths': <Target className="w-8 h-8 text-white" />,
  'work-style': <Briefcase className="w-8 h-8 text-white" />,
  'subject-signals': <Brain className="w-8 h-8 text-white" />
};

const generatePattern = (questions: Question[]) => {
  const interests = questions.filter(q => q.sectionId === 'interests');
  const strengths = questions.filter(q => q.sectionId === 'strengths');
  const workStyles = questions.filter(q => q.sectionId === 'work-style');
  const subjectSignals = questions.filter(q => q.sectionId === 'subject-signals');

  const result: Question[] = [];
  
  // Create pattern: 5 interests, 4 strengths, 2 work style, 1 subject signal
  while (interests.length >= 5 && strengths.length >= 4 && workStyles.length >= 2 && subjectSignals.length >= 1) {
    result.push(...interests.splice(0, 5));
    result.push(...strengths.splice(0, 4));
    result.push(...workStyles.splice(0, 2));
    result.push(...subjectSignals.splice(0, 1));
  }

  // Collect any remaining questions
  const remaining = [...interests, ...strengths, ...workStyles, ...subjectSignals];
  
  // Shuffle remaining
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }

  return [...result, ...remaining];
};

const ORDERED_QUESTIONS = [
  ...generatePattern(INITIAL_QUESTIONS.filter(q => q.use === 'Core')),
  ...generatePattern(INITIAL_QUESTIONS.filter(q => q.use === 'Optional'))
];

export default function StudentOnboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentName = searchParams.get('name') || 'Student';
  const { showToast } = useToast();

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    const isContinue = searchParams.get('continue') === 'true' || searchParams.get('start') === 'true';
    const saved = localStorage.getItem('studentAssessmentAnswers');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
      const firstUnanswered = ORDERED_QUESTIONS.findIndex(q => !parsed[q.id]);
      if (firstUnanswered !== -1) {
        setCurrentIndex(firstUnanswered);
      } else {
        setCurrentIndex(ORDERED_QUESTIONS.length);
      }
      if (isContinue) {
        setStarted(true);
      }
    } else if (isContinue) {
      setStarted(true);
    }
  }, [searchParams]);

  const currentQuestion = ORDERED_QUESTIONS[currentIndex] || ORDERED_QUESTIONS[0];
  const progress = Math.round((currentIndex / ORDERED_QUESTIONS.length) * 100);
  const answerCount = Object.keys(answers).length;
  const canSaveAndExit = answerCount >= 20;

  const handleAnswer = (val: number) => {
    const updated = { ...answers, [currentQuestion.id]: val };
    const newAnswerCount = Object.keys(updated).length;
    setAnswers(updated);
    localStorage.setItem('studentAssessmentAnswers', JSON.stringify(updated));
    
    if (newAnswerCount === 20 && answerCount === 19) {
      showToast('You can now save & exit to continue later, or keep going!', 'info');
    }
    
    setTimeout(() => {
      if (currentIndex < ORDERED_QUESTIONS.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Allow it to increment to show the completion screen
        setCurrentIndex(currentIndex + 1);
      }
    }, 300);
  };

  const saveAndExit = () => {
    if (!canSaveAndExit) return;
    showToast('Progress saved! Welcome to your dashboard.');
    navigate('/student/dashboard');
  };

  const finishOnboarding = () => {
    showToast('Assessment complete! Welcome to your personalized dashboard.');
    navigate('/student/dashboard');
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Modern colorful gradients based on brand logo */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl shadow-brand/5 border border-white relative z-10 text-center"
        >
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-brand to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20 mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-600">{studentName}</span>
          </h1>
          
          <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed mb-10">
            Let's discover the careers and industries that match your unique interests, strengths, and work style.
          </p>

          <button 
            onClick={() => setStarted(true)}
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-brand to-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-3 mx-auto"
          >
            Start Assessment <ArrowRight className="w-6 h-6" />
          </button>
          
          <p className="text-sm text-slate-500 mt-6 font-medium">
            You don't have to finish it all at once. Your progress is saved automatically.
          </p>
        </motion.div>
      </div>
    );
  }

  if (currentIndex >= ORDERED_QUESTIONS.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        {/* Celebration Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 text-center shadow-2xl shadow-brand/10 border border-white relative z-10"
        >
          {/* Gamified Badge */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 rounded-full opacity-30 blur-xl"
            />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              className="relative w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/30 border-4 border-white"
            >
              <Award className="w-16 h-16 text-white" />
            </motion.div>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-extrabold text-slate-900 mb-4"
          >
            Assessment Complete!
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600 mb-8 font-medium text-lg leading-relaxed"
          >
            Congratulations! You've unlocked the <span className="font-bold text-amber-500">Self-Aware</span> badge. We've personalized your dashboard based on your unique profile.
          </motion.p>

          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => finishOnboarding()}
            className="w-full py-5 bg-gradient-to-r from-brand to-cyan-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            Go to My Dashboard <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Dynamic colorful backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply transition-all duration-1000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply transition-all duration-1000" />
      
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={prevStep}
            className={`p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white transition-colors ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <Logo size="sm" />
        </div>
        <button 
          onClick={() => saveAndExit()}
          disabled={!canSaveAndExit}
          className={`px-5 py-2.5 font-bold text-sm rounded-full transition-all flex items-center gap-2 shadow-sm border ${
            canSaveAndExit 
              ? 'bg-gradient-to-r from-brand to-cyan-500 text-white border-transparent hover:shadow-md hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-slate-100/50 backdrop-blur text-slate-400 border-slate-200 opacity-70 cursor-not-allowed'
          }`}
        >
          Save & Exit <ChevronRight className="w-4 h-4" />
        </button>
      </header>

      {/* Progress Bar */}
      <div className="w-full max-w-5xl mx-auto px-6 relative z-10">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-3">
          <span className="uppercase tracking-widest">{currentQuestion.sectionId}</span>
          <span>{currentIndex + 1} / {ORDERED_QUESTIONS.length}</span>
        </div>
        <div className="h-2.5 w-full bg-slate-200/50 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div 
            className="h-full bg-gradient-to-r from-brand to-cyan-400 rounded-full"
            initial={{ width: `${progress}%` }}
            animate={{ width: `${((currentIndex + 1) / ORDERED_QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 md:p-12 shadow-2xl shadow-brand/5 border border-white"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-cyan-500 flex items-center justify-center shadow-lg shadow-brand/20 mb-8">
                  {sectionIcons[currentQuestion.sectionId] || <Target className="w-8 h-8 text-white" />}
                </div>
                
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-12 min-h-[5rem] flex items-center justify-center">
                  "{currentQuestion.questionText}"
                </h2>

                <div className="w-full max-w-xl mx-auto flex justify-between items-end gap-2 md:gap-4">
                  {[
                    { val: 1, label: 'Not like me', color: 'from-rose-400 to-rose-500', bg: 'bg-rose-50 text-rose-500 border-rose-200' },
                    { val: 2, label: 'A little', color: 'from-orange-400 to-orange-500', bg: 'bg-orange-50 text-orange-500 border-orange-200' },
                    { val: 3, label: 'Not sure', color: 'from-slate-400 to-slate-500', bg: 'bg-slate-50 text-slate-500 border-slate-200' },
                    { val: 4, label: 'Like me', color: 'from-cyan-400 to-cyan-500', bg: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
                    { val: 5, label: 'Very like me', color: 'from-emerald-400 to-emerald-500', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' }
                  ].map((option) => (
                    <div key={option.val} className="flex flex-col items-center gap-3 flex-1">
                      <button
                        onClick={() => handleAnswer(option.val)}
                        className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-xl md:text-3xl font-extrabold transition-all duration-200 shadow-sm border-2 ${
                          answers[currentQuestion.id] === option.val
                            ? `bg-gradient-to-br ${option.color} text-white border-transparent scale-110 shadow-lg`
                            : `bg-white text-slate-600 border-slate-150 hover:${option.bg} hover:scale-105 hover:shadow-md`
                        }`}
                      >
                        {option.val}
                      </button>
                      <span className="text-[10px] md:text-xs font-bold text-slate-500 text-center leading-tight">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


