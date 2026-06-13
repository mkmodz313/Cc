const fs = require('fs');
const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find '</div>' followed by newlines and '}' (without paren)
// We want to replace "        </div>\n      }" with "        </div>\n      )}"
const regex = /(<\/>\s*\r?\n\s*\)\s*\}\s*\r?\n\s*<\/div>\s*\r?\n\s*)\}/g;
const hasMatch = regex.test(content);
console.log('Spotted broken outer paren match:', hasMatch);

if (hasMatch) {
  content = content.replace(regex, '$1)}');
} else {
  // Let's do a robust replacement of line 1406 and adjacent lines
  const lines = content.split(/\r?\n/);
  // Find lines starting from 1401 to 1406 and replace specifically
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('</>') && lines[i+1]?.trim() === ')}' && lines[i+2]?.trim() === '</div>' && lines[i+3]?.trim() === '}') {
      console.log('Found structure at line', i+1);
      lines[i+3] = '      )}'; // Repair the missing paren!
      break;
    }
  }
  content = lines.join('\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Repair script finished.');
