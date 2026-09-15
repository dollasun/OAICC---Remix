const fs = require('fs');

function fixSalary(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  code = code.replace(
    '<div className="flex items-center justify-between">\n                  <h3 className="text-lg font-bold text-slate-900 mb-6">Average Salary</h3>',
    '<div className="flex items-center justify-between mb-6">\n                  <div>\n                    <h3 className="text-lg font-bold text-slate-900 mb-1">Average Salary</h3>\n                    <p className="text-xs text-slate-500">Add salary estimates across countries</p>\n                  </div>'
  );
  
  fs.writeFileSync(file, code);
  console.log(`Updated ${file}`);
}

fixSalary('src/components/Dashboard/Admin/CreateCareer.tsx');
fixSalary('src/components/Dashboard/Admin/EditCareer.tsx');
