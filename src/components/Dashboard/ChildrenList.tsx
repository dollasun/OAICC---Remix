import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, UserPlus, Mail, X, Check, ChevronRight, Users, Activity as ActivityIcon, Target } from 'lucide-react';
import { Child } from '../../types';

const initialChildren: Child[] = [
  { id: '1', firstName: 'Favour', lastName: 'Aina', email: 'favour@oaicc.com', class: 'JSS 3 A', school: 'The Seaside School', relationship: 'Daughter', status: 'active', avatar: 'https://picsum.photos/seed/child1/200/200' },
  { id: '2', firstName: 'Gbenga', lastName: 'Aina', email: 'gbenga@oaicc.com', class: 'SSS 1 B', school: 'The Seaside School', relationship: 'Son', status: 'active', avatar: 'https://picsum.photos/seed/child2/200/200' },
];

export default function ChildrenList() {
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [newChildEmail, setNewChildEmail] = useState('');

  const handleAddChild = () => {
    setIsAddModalOpen(true);
    setAddStep(1);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Children', value: '2', icon: <Users className="w-6 h-6" />, color: 'bg-blue-500', shadow: 'shadow-blue-200' },
          { label: 'Active Activities', value: '12', icon: <ActivityIcon className="w-6 h-6" />, color: 'bg-cyan-500', shadow: 'shadow-cyan-200' },
          { label: 'Career Quizzes', value: '4', icon: <Target className="w-6 h-6" />, color: 'bg-emerald-500', shadow: 'shadow-emerald-200' },
          { label: 'Pending Invites', value: '1', icon: <Mail className="w-6 h-6" />, color: 'bg-orange-500', shadow: 'shadow-orange-200' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:${kpi.shadow} hover:shadow-xl transition-all`}
          >
            <div className={`${kpi.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4`}>
              {kpi.icon}
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Child(ren)</h1>
          <p className="text-slate-500">View and manage your children's career progress.</p>
        </div>
        <button 
          onClick={handleAddChild}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add a Child
        </button>
      </div>

      {children.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-brand-light text-brand rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to add your child?</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Click "Add a Child" to create an account for your child or connect to an existing account.</p>
          <button onClick={handleAddChild} className="btn-primary mx-auto">Add a Child</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <motion.div
              key={child.id}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/parent/dashboard/child/${child.id}`)}
              className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-100 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={child.avatar} 
                  alt={child.firstName} 
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{child.firstName} {child.lastName}</h3>
                  <p className="text-sm text-slate-500">{child.class} • {child.school}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Relationship</span>
                  <span className="font-semibold text-slate-900">{child.relationship}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Email</span>
                  <span className="font-semibold text-slate-900">{child.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
                  <Check className="w-3 h-3" /> Active
                </span>
                <div className="text-brand font-bold text-sm flex items-center group-hover:gap-1 transition-all">
                  View Progress <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Child Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Add a child</h2>
                  <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {addStep === 1 ? (
                  <div className="space-y-6">
                    <p className="text-slate-600">Does your child already have an account on O.A.I.S.C.?</p>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setAddStep(2)}
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-brand hover:bg-brand-light/20 text-left transition-all group"
                      >
                        <p className="font-bold text-slate-900 group-hover:text-brand">Yes, they have an account</p>
                        <p className="text-sm text-slate-500">We'll send them a connection request.</p>
                      </button>
                      <button 
                        onClick={() => setAddStep(3)}
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-brand hover:bg-brand-light/20 text-left transition-all group"
                      >
                        <p className="font-bold text-slate-900 group-hover:text-brand">No, I need to create one</p>
                        <p className="text-sm text-slate-500">Create a new account for your child.</p>
                      </button>
                    </div>
                  </div>
                ) : addStep === 2 ? (
                  <div className="space-y-6">
                    <p className="text-slate-600">Enter your child's email address to send an invitation.</p>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Child's Email Address</label>
                      <div className="input-with-icon">
                        <div className="icon-wrapper">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input 
                          type="email" 
                          placeholder="example@email.com" 
                          className="input-field"
                          value={newChildEmail}
                          onChange={e => setNewChildEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setAddStep(1)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Back</button>
                      <button onClick={() => setIsAddModalOpen(false)} className="flex-[2] btn-primary">Send Invite</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">First Name</label>
                        <input type="text" className="input-field" placeholder="Child's first name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Last Name</label>
                        <input type="text" className="input-field" placeholder="Child's last name" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <input type="email" className="input-field" placeholder="child@email.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Password</label>
                      <input type="password" placeholder="••••••••" className="input-field" />
                    </div>
                    <div className="flex gap-4 pt-6">
                      <button onClick={() => setAddStep(1)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Back</button>
                      <button onClick={() => setIsAddModalOpen(false)} className="flex-[2] btn-primary">Create Account</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
