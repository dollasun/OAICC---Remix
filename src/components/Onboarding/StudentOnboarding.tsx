import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Logo from '../Logo';

const questions = [
  {
    id: 1,
    text: 'Do you enjoy working with numbers, analyzing data, or handling financial information?',
    options: ['Not interested at all', 'Slightly interested', 'Neutral', 'Interested', 'Very Interested']
  },
  {
    id: 2,
    text: 'Are you interested in leading teams, planning strategies, or solving business problems?',
    options: ['Not interested at all', 'Slightly interested', 'Neutral', 'Interested', 'Very Interested']
  },
  {
    id: 3,
    text: 'Do you find satisfaction in helping others through charitable or community work?',
    options: ['Not interested at all', 'Slightly interested', 'Neutral', 'Interested', 'Very Interested']
  },
  {
    id: 4,
    text: 'Do you enjoy expressing yourself through art, design, or other creative projects?',
    options: ['Not interested at all', 'Slightly interested', 'Neutral', 'Interested', 'Very Interested']
  },
  {
    id: 5,
    text: 'Are you interested in energy solutions, sustainability, or large-scale utilities management?',
    options: ['Not interested at all', 'Slightly interested', 'Neutral', 'Interested', 'Very Interested']
  }
];

const careerMatches = [
  { name: 'Engineering', match: '98%', image: 'https://picsum.photos/seed/eng/400/300' },
  { name: 'Medicine', match: '90%', image: 'https://picsum.photos/seed/med/400/300' },
  { name: 'Architecture', match: '85%', image: 'https://picsum.photos/seed/arch/400/300' },
  { name: 'Civil engineering', match: '78%', image: 'https://picsum.photos/seed/civil/400/300' },
  { name: 'Software Dev', match: '60%', image: 'https://picsum.photos/seed/soft/400/300' },
  { name: 'Design', match: '55%', image: 'https://picsum.photos/seed/design/400/300' },
];

export default function StudentOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Intro, 1-5: Questions, 6: Results
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleOptionSelect = (questionId: number, option: string) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const nextStep = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(6); // Results
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (step === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <Logo size="lg" className="mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Interest assessment test</h1>
          <p className="text-slate-500 mb-8">
            A short quiz to test your career interest and help us suggest the best paths for you.
          </p>
          <button 
            onClick={() => setStep(1)}
            className="btn-primary w-full py-4"
          >
            Start Assessment
          </button>
        </motion.div>
      </div>
    );
  }

  if (step <= questions.length) {
    const currentQuestion = questions[step - 1];
    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left Side - Image/Branding */}
        <div className="hidden md:flex md:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
          <img 
            src="https://picsum.photos/seed/assessment/1200/1600" 
            alt="Assessment" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 text-white max-w-md">
            <Logo size="md" className="mb-8" />
            <h2 className="text-4xl font-bold mb-4">Choose if this resonates with you or not</h2>
            <p className="text-slate-300">A short quiz to test your career interest</p>
          </div>
        </div>

        {/* Right Side - Question */}
        <div className="flex-1 bg-white flex flex-col p-8 md:p-16">
          <div className="flex justify-between items-center mb-12">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand disabled:opacity-0 transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-all"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 max-w-xl">
            <p className="text-brand font-bold uppercase tracking-widest text-sm mb-4">Question {step}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 leading-tight">
              {currentQuestion.text}
            </h3>

            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(currentQuestion.id, option)}
                  className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all ${
                    answers[currentQuestion.id] === option
                      ? 'border-brand bg-brand/5 text-brand shadow-lg shadow-brand/10'
                      : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <button 
              onClick={nextStep}
              disabled={!answers[currentQuestion.id]}
              className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Step
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 md:p-16 max-w-5xl w-full text-center"
      >
        <Logo size="md" className="mx-auto mb-10" />
        
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 bg-brand/10 rounded-full flex items-center justify-center">
            <div className="w-24 h-24 bg-brand rounded-3xl flex items-center justify-center shadow-xl shadow-brand/30 rotate-12">
              <CheckCircle2 className="w-12 h-12 text-white -rotate-12" />
            </div>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            👍
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">Congratulations!</h2>
        <p className="text-slate-500 max-w-2xl mx-auto mb-12">
          You've just finished an assessment of your interests and you're on your way to discovering your ideal career... We look forward to taking the journey with you
        </p>

        <div className="text-left mb-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            Careers 💼
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {careerMatches.map((career, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer">
                <img 
                  src={career.image} 
                  alt={career.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md rounded-full px-2 py-1 text-[10px] font-bold text-white border border-white/30">
                  {career.match}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm">{career.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => navigate('/student/dashboard')}
          className="btn-primary px-12 py-4"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
