import re

path = r'c:\Users\Mrshi\Desktop\WorldMonitor\src\styles\main.css'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

brace_count = 0
errors = []

for i, line in enumerate(lines):
    line_num = i + 1
    
    # Simple brace counting
    opens = line.count('{')
    closes = line.count('}')
    
    brace_count += opens
    brace_count -= closes
    
    if brace_count < 0:
        errors.append(f"Line {line_num}: Extra closing brace found.")
        brace_count = 0 
        
    # Check for property-like lines at top level
    if brace_count == 0 and re.match(r'^\s*[a-zA-Z-]+\s*:', line) and not line.strip().startswith('@'):
        errors.append(f"Line {line_num}: Property found outside of block: {line.strip()}")

if brace_count > 0:
    errors.append(f"End of file: Missing {brace_count} closing braces.")

if errors:
    print("\n".join(errors))
else:
    print("No obvious structural errors found.")
