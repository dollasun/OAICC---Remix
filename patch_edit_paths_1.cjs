const fs = require('fs');
const file = 'src/components/Dashboard/Admin/EditCareer.tsx';
let code = fs.readFileSync(file, 'utf8');

const pathsUI = `
              {/* Career Path Section */}
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Career Path Configuration</h3>
                    <p className="text-xs text-slate-500">Add stages to the career path timeline</p>
                  </div>
                  <button 
                    onClick={handleAddCareerPath}
                    className="flex items-center gap-2 text-brand font-bold hover:bg-brand/5 px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" /> Add Stage
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.careerPaths.map((path, index) => (
                    <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group">
                      <button 
                        onClick={() => handleRemoveCareerPath(index)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Tag</label>
                          <select 
                            value={path.tag}
                            onChange={(e) => handleUpdateCareerPath(index, 'tag', e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                          >
                            <option value="Education">Education</option>
                            <option value="Professional">Professional</option>
                            <option value="Vocation">Vocation</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Duration (e.g. 1-4 years)</label>
                          <input 
                            type="text" 
                            value={path.duration}
                            onChange={(e) => handleUpdateCareerPath(index, 'duration', e.target.value)}
                            placeholder="e.g. 1-4 years"
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700" 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Stage Title</label>
                          <input 
                            type="text" 
                            value={path.title}
                            onChange={(e) => handleUpdateCareerPath(index, 'title', e.target.value)}
                            placeholder="e.g. Foundation & Preparation"
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Stage Description</label>
                          <textarea 
                            value={path.description}
                            onChange={(e) => handleUpdateCareerPath(index, 'description', e.target.value)}
                            placeholder="Brief description of this stage..."
                            rows={2}
                            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none" 
                          />
                        </div>
                        
                        {/* Milestones */}
                        <div className="space-y-2 pt-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Key Milestones</label>
                          <div className="space-y-2 mb-2">
                            {path.milestones.map((milestone, mIndex) => (
                              <div key={mIndex} className="p-3 bg-white rounded-xl flex items-center justify-between gap-4 border border-slate-100">
                                <p className="text-sm font-medium text-slate-700">{milestone}</p>
                                <button onClick={() => handleRemoveMilestone(index, mIndex)} className="text-slate-400 hover:text-red-500 shrink-0">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newMilestones[index] || ''}
                              onChange={(e) => setNewMilestones({ ...newMilestones, [index]: e.target.value })}
                              placeholder="e.g. Complete relevant high school courses"
                              className="flex-1 px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddMilestone(index);
                                }
                              }}
                            />
                            <button 
                              onClick={() => handleAddMilestone(index)}
                              className="px-4 py-3 bg-brand/10 text-brand rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-brand/20 transition-all shrink-0"
                            >
                              <Plus className="w-4 h-4" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
`;

code = code.replace(
  `              <div className="flex justify-end gap-4 pt-8">`,
  pathsUI + '\n              <div className="flex justify-end gap-4 pt-8">'
);

fs.writeFileSync(file, code);
