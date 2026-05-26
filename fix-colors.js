import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, 'src/components');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/#0A0A0A|#111111/gi, 'var(--color-bg)');
  content = content.replace(/#F5F5F0/gi, 'var(--color-fg)');
  content = content.replace(/#94A3B8|#64748B|#475569/gi, 'var(--color-fg-muted)');
  content = content.replace(/#7C3AED/gi, 'var(--color-primary)');
  content = content.replace(/#C4B5FD|#A78BFA/gi, 'var(--color-primary)');
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
