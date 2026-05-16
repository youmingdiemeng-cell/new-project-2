// tools/deploy.js
// Update cache-busting query strings, then commit and push the result.

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const indexPath = path.join(projectRoot, 'index.html');
const now = new Date();
const version = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

const html = fs.readFileSync(indexPath, 'utf8');
const replaced = html.replace(/(\?v=)[^"'&\s>]+/g, `$1${version}`);

if (html === replaced) {
  console.log('No cache-busting query string was found in index.html.');
  process.exit(1);
}

fs.writeFileSync(indexPath, replaced, 'utf8');
console.log(`Updated asset version to ${version}`);

try {
  console.log('Running git add -A');
  execSync('git add -A', { cwd: projectRoot, stdio: 'inherit' });

  console.log('Running git commit');
  execSync(`git commit -m "chore: bump version to ${version}"`, { cwd: projectRoot, stdio: "inherit" });

  console.log('Running git push');
  execSync('git push', { cwd: projectRoot, stdio: 'inherit' });

  console.log('\nDeployment finished.');
} catch (error) {
  console.error('\nGit operation failed:', error.message);
  console.log('Run git add -A, git commit, and git push manually if needed.');
}
