#!/usr/bin/env python3
"""Fix animejs v3 → v4 API: animate({targets, ...}) → animate(targets, {...})"""
import re, sys

def fix_anime_calls(content):
    """Replace animeAnimate({targets: X, ...rest}) with animeAnimate(X, {...rest})"""
    
    def replacer(m):
        indent = m.group(1)  # whitespace before 'animeAnimate'
        targets = m.group(2).strip()
        rest = m.group(3)
        return f'{indent}animeAnimate({targets}, {{{rest}'
    
    # Pattern 1: animeAnimate({\n  targets: EXPR,\n  REST})
    # We need to match the opening call, then targets line, then rest
    result = []
    lines = content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        # Look for animeAnimate({ at end of line (multi-line) or animeAnimate({ in middle
        if 'animeAnimate({' in line:
            # Check if targets: is on same line
            tm = re.search(r'^(\s*)animeAnimate\(\{\s*targets:\s*([^,}]+),(.*)$', line)
            if tm:
                # Single-line: animeAnimate({targets: X, rest})
                indent = tm.group(1)
                targets = tm.group(2).strip()
                rest = tm.group(3).strip()
                if rest.endswith('}'):
                    rest = rest[:-1].rstrip()
                    result.append(f'{indent}animeAnimate({targets}, {{{rest}}})')
                else:
                    result.append(f'{indent}animeAnimate({targets}, {{')
                    result.append(f'  {rest}')
                i += 1
                continue
            
            # Multi-line: animeAnimate({\n  targets: X,\n  rest...\n})
            tm = re.search(r'^(\s*)animeAnimate\(\{\s*$', line)
            if tm:
                indent = tm.group(1)
                # Next line should have targets:
                if i + 1 < len(lines):
                    next_line = lines[i + 1]
                    tm2 = re.match(r'^(\s*)targets:\s*([^,}]+),\s*$', next_line)
                    if tm2:
                        targets = tm2.group(2).strip()
                        result.append(f'{indent}animeAnimate({targets}, {{')
                        i += 2  # skip the targets line
                        continue
                
                # targets might be on the same line as opening brace
                tm3 = re.search(r'animeAnimate\(\{\s*targets:\s*([^,}]+),\s*$', line)
                if tm3:
                    targets = tm3.group(1).strip()
                    result.append(f'{indent}animeAnimate({targets}, {{')
                    i += 1
                    continue
        
        result.append(line)
        i += 1
    
    return '\n'.join(result)


if __name__ == '__main__':
    files = [
        'src/components/ui/Animated.js',
        'src/hooks/useAnimejs.js', 
        'src/components/ui/GlassCard.js',
    ]
    
    for f in files:
        try:
            with open(f) as fh:
                content = fh.read()
            new_content = fix_anime_calls(content)
            if new_content != content:
                with open(f, 'w') as fh:
                    fh.write(new_content)
                print(f'Fixed: {f}')
            else:
                print(f'No changes: {f}')
        except FileNotFoundError:
            print(f'Not found: {f}')
