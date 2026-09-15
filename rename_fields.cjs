const fs = require('fs');

function fixFields(file) {
  let code = fs.readFileSync(file, 'utf8');

  // Change duties to responsibilities
  code = code.replace(/duties/g, 'responsibilities');
  code = code.replace(/newDuty/g, 'newResponsibility');
  code = code.replace(/setNewDuty/g, 'setNewResponsibility');

  // Change careerPaths to pathway
  code = code.replace(/careerPaths/g, 'pathway');
  
  // Change tag to type
  code = code.replace(/path.tag/g, 'path.type');
  code = code.replace(/tag: /g, 'type: ');
  code = code.replace(/'tag'/g, "'type'");
  
  // Change title to step in pathway
  code = code.replace(/path.title/g, 'path.step');
  code = code.replace(/title: 'Foundation & Preparation'/g, "step: 'Foundation & Preparation'");
  code = code.replace(/title: ''/g, "step: ''");
  code = code.replace(/'title'/g, "'step'");

  // Change 'Education' to 'education' etc., since details UI expects lowercase
  code = code.replace(/<option value="Education">Education<\/option>/g, '<option value="education">Education</option>');
  code = code.replace(/<option value="Professional">Professional<\/option>/g, '<option value="professional">Professional</option>');
  code = code.replace(/<option value="Vocation">Vocation<\/option>/g, '<option value="vocation">Vocation</option>');
  code = code.replace(/type: 'Education'/g, "type: 'education'");

  fs.writeFileSync(file, code);
}

fixFields('src/components/Dashboard/Admin/CreateCareer.tsx');
fixFields('src/components/Dashboard/Admin/EditCareer.tsx');
