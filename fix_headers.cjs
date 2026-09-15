const fs = require('fs');

function fixHeaders(file) {
  let code = fs.readFileSync(file, 'utf8');

  // Add "Career details" header to the Basic Details card
  code = code.replace(
    '<div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm space-y-8">\n              <div className="grid',
    '<div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm space-y-8">\n              <h3 className="text-lg font-bold text-slate-900 mb-6">Career details</h3>\n              <div className="grid'
  );

  // Fix Career Path Configuration
  code = code.replace(
    '<h3 className="text-lg font-bold text-slate-900">Career Path Configuration</h3>',
    '<h3 className="text-lg font-bold text-slate-900 mb-1">Career Path Configuration</h3>'
  );

  // Fix Average Salary
  code = code.replace(
    '<h3 className="text-lg font-bold text-slate-900">Average Salary</h3>',
    '<h3 className="text-lg font-bold text-slate-900 mb-6">Average Salary</h3>'
  );

  // Fix Resource headers (from text-xl to text-lg)
  code = code.replace(
    '<h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">',
    '<h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">'
  );
  code = code.replace(
    '<h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">',
    '<h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">'
  );
  code = code.replace(
    '<h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">',
    '<h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">'
  );

  fs.writeFileSync(file, code);
  console.log(`Updated ${file}`);
}

fixHeaders('src/components/Dashboard/Admin/CreateCareer.tsx');
fixHeaders('src/components/Dashboard/Admin/EditCareer.tsx');
