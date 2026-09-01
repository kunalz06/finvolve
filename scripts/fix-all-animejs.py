#!/usr/bin/env python3
"""Add animejs v4 compat wrapper to all files using v3 API."""
import re, os

# Files that already have the wrapper (skip them)
SKIP = {'Animated.js', 'useAnimejs.js', 'GlassCard.js'}

WRAPPER_IMPORT = '''import { animate as animeAnimate } from "animejs";

// animejs v4 uses animate(targets, params) but code uses v3-style animate({targets, ...params})
const runAnim = (params) => {
  const { targets, ...rest } = params;
  return animeAnimate(targets, rest);
};'''

def fix_file(filepath):
    basename = os.path.basename(filepath)
    if basename in SKIP:
        print(f'SKIP (already fixed): {basename}')
        return False
    
    with open(filepath) as f:
        content = f.read()
    
    original = content
    
    # Check if file uses the old API pattern
    if 'from "animejs"' not in content and "from 'animejs'" not in content:
        print(f'SKIP (no animejs import): {basename}')
        return False
    
    # Replace import
    content = re.sub(
        r'import\s*\{\s*animate\s*\}\s*from\s*["\x27]animejs["\x27]\s*;?',
        WRAPPER_IMPORT,
        content
    )
    
    # Check if already has runAnim wrapper
    if 'const runAnim' in content and 'animeAnimate(targets, rest)' in content:
        print(f'SKIP (already has wrapper): {basename}')
        return False
    
    # Replace animate( with runAnim( but NOT animeAnimate(
    content = re.sub(r'(?<!\w)animate\(', 'runAnim(', content)
    
    # Fix any double-replacement: runAnimAnimate( → should not happen
    content = content.replace('runAnimAnimate(', 'animeAnimate(')
    
    # Fix the wrapper itself - make sure it uses animeAnimate not runAnim
    # This shouldn't be needed since we excluded existing wrappers, but just in case
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f'FIXED: {basename}')
        return True
    else:
        print(f'NO CHANGE: {basename}')
        return False

# Find all files
import glob
files = glob.glob('src/**/*.js', recursive=True)
fixed = 0
for f in files:
    if fix_file(f):
        fixed += 1

print(f'\nTotal files fixed: {fixed}')
