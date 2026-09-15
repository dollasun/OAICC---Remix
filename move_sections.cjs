const fs = require('fs');

function moveSections(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  const salaryStart = code.indexOf('{/* Salary Section */}');
  const pathStart = code.indexOf('{/* Career Path Section */}');
  
  if (salaryStart !== -1 && pathStart !== -1 && salaryStart < pathStart) {
    const salaryEnd = pathStart;
    
    // Find the end of the Career Path Section
    // The next section is the Buttons
    const buttonsStart = code.indexOf('<div className="flex justify-end gap-4 pt-8">', pathStart);
    
    const salaryCode = code.substring(salaryStart, salaryEnd);
    const pathCode = code.substring(pathStart, buttonsStart);
    
    const newCode = code.substring(0, salaryStart) + pathCode + salaryCode + code.substring(buttonsStart);
    fs.writeFileSync(file, newCode);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Could not find sections in ${file} or already moved`);
  }
}

moveSections('src/components/Dashboard/Admin/CreateCareer.tsx');
moveSections('src/components/Dashboard/Admin/EditCareer.tsx');
