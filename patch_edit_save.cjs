const fs = require('fs');
const file = 'src/components/Dashboard/Admin/EditCareer.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `          skills: formData.skills,
          subjects: formData.subjects`,
  `          skills: formData.skills,
          duties: formData.duties,
          subjects: formData.subjects,
          careerPaths: formData.careerPaths`
);

fs.writeFileSync(file, code);
