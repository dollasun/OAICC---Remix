const fs = require('fs');
const file = 'src/components/Dashboard/Admin/EditCareer.tsx';
let code = fs.readFileSync(file, 'utf8');

const updatedUI = `
              {/* Skills */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="text-sm font-bold text-slate-700 ml-1">Top Skills</label>
                    <p className="text-xs text-slate-500 ml-1">Add up to 10 skills</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-50 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-600 border border-slate-100">
                      {skill} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleRemoveArrayItem('skills', i)} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Project Management"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem('skills', newSkill, setNewSkill);
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleAddArrayItem('skills', newSkill, setNewSkill)}
                    className="px-6 py-3 bg-brand text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-brand/90 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </div>
              </div>

              {/* Duties */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="text-sm font-bold text-slate-700 ml-1">Key Duties & Responsibilities</label>
                    <p className="text-xs text-slate-500 ml-1">Add key responsibilities for this career</p>
                  </div>
                </div>
                <div className="space-y-2 mb-2">
                  {formData.duties.map((duty, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl flex items-start justify-between gap-4 border border-slate-100">
                      <p className="text-sm font-medium text-slate-700">{duty}</p>
                      <button onClick={() => handleRemoveArrayItem('duties', i)} className="text-slate-400 hover:text-red-500 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDuty}
                    onChange={(e) => setNewDuty(e.target.value)}
                    placeholder="e.g. Design, build, and deploy scalable software..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem('duties', newDuty, setNewDuty);
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleAddArrayItem('duties', newDuty, setNewDuty)}
                    className="px-6 py-3 bg-brand text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-brand/90 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Duty
                  </button>
                </div>
              </div>

              {/* Subjects */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="text-sm font-bold text-slate-700 ml-1">Top Subject Required</label>
                    <p className="text-xs text-slate-500 ml-1">Add up to 10 subjects</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.subjects.map((subject, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-50 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-600 border border-slate-100">
                      {subject} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleRemoveArrayItem('subjects', i)} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem('subjects', newSubject, setNewSubject);
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleAddArrayItem('subjects', newSubject, setNewSubject)}
                    className="px-6 py-3 bg-brand text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-brand/90 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Subject
                  </button>
                </div>
              </div>
`;

code = code.replace(
  /[\s\S]*?(?=\{\/\* Skills \*\/)/, 
  (match) => match
);

const startIndex = code.indexOf('{/* Skills */}');
const endIndex = code.indexOf('{/* Salary Section */}');

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + updatedUI + '\n              ' + code.substring(endIndex);
  fs.writeFileSync(file, code);
  console.log("Success");
} else {
  console.log("Failed to find boundaries");
}
