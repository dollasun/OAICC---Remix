const fs = require('fs');
const file = 'src/components/Dashboard/Admin/CreateCareer.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `      salaries: formData.salaries,`,
  `      salaries: formData.salaries,
      skills: formData.skills,
      duties: formData.duties,
      subjects: formData.subjects,
      careerPaths: formData.careerPaths,`
);

fs.writeFileSync(file, code);
