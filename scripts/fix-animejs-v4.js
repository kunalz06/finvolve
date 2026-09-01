const fs = require('fs');
const path = require('path');

const files = [
  'src/components/ui/Animated.js',
  'src/hooks/useAnimejs.js',
  'src/components/ui/GlassCard.js',
];

for (const file of files) {
  const fp = path.join(__dirname, '..', file);
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;
  
  // Pattern: animeAnimate({\n  targets: el,\n  ...rest\n})  →  animeAnimate(el, {\n  ...rest\n})
  // Also: animeAnimate({targets: el, ...rest}) → animeAnimate(el, {...rest})
  
  // Match animeAnimate({ followed by targets: somewhere inside
  // We need to extract the targets value and move it to first arg
  
  // Simple approach: replace animeAnimate({\n  targets: X,\n  with animeAnimate(X, {\n  
  // Multi-line targets pattern
  const mlPattern = /animeAnimate\(\{\s*\n\s*targets:\s*([^,}]+),\s*\n/g;
  if (mlPattern.test(content)) {
    content = content.replace(mlPattern, 'animeAnimate($1, {\n');
    changed = true;
  }
  
  // Single-line targets pattern: animeAnimate({targets: X, ...})
  const slPattern = /animeAnimate\(\{\s*targets:\s*([^,}]+)/g;
  // Only replace if not already converted (no first-arg pattern)
  // Count animeAnimate( patterns that look like two-arg already
  const twoArgCount = (content.match(/animeAnimate\([^\{]/g) || []).length;
  const oneArgCount = (content.match(/animeAnimate\(\{[^]*targets:/g) || []).length;
  
  if (oneArgCount > twoArgCount) {
    content = content.replace(slPattern, 'animeAnimate($1, {');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`Fixed: ${file}`);
  } else {
    console.log(`Already OK: ${file}`);
  }
}
