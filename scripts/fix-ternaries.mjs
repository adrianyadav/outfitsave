import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // A simple parser for { condition && ( ... ) }
    // It's not a full AST parser but works for the current formatting
    let newContent = '';
    let i = 0;
    while (i < content.length) {
        let match = content.slice(i).match(/\{([^\{\}\n]+?)\s*&&\s*\(/);
        if (match && match.index !== undefined && !match[1].includes("?")) {
            let start = i + match.index;
            let condition = match[1];
            
            newContent += content.slice(i, start);
            newContent += `{${condition} ? (`

            let pCount = 1;
            let j = start + match[0].length;
            while (j < content.length && pCount > 0) {
                if (content[j] === '(') pCount++;
                else if (content[j] === ')') pCount--;
                j++;
            }
            // Add what was parsed
            newContent += content.slice(start + match[0].length, j);
            
            // Wait, we need to make sure the next character is `}`
            let k = j;
            while (k < content.length && /\s/.test(content[k])) k++;
            if (content[k] === '}') {
                newContent += ` : null}`;
                i = k + 1;
                modified = true;
                continue;
            } else {
                // If we couldn't match a closing }, we revert this segment
                console.log(`Could not find closing } in ${filePath} at index ${k}`);
                newContent += content.slice(j, k + 1);
                i = k + 1;
                continue;
            }
        }
        
        // Match single line { condition && <Component ... /> }
        let singleMatch = content.slice(i).match(/\{([^\{\}\n]+?)\s*&&\s*(<[^>]+>)\s*\}/);
        if (singleMatch && singleMatch.index !== undefined && !singleMatch[1].includes("?")) {
            let start = i + singleMatch.index;
            let condition = singleMatch[1];
            let component = singleMatch[2];
            newContent += content.slice(i, start);
            newContent += `{${condition} ? ${component} : null}`;
            i = start + singleMatch[0].length;
            modified = true;
            continue;
        }

        // if neither match, we just append current char
        newContent += content[i];
        i++;
    }

    if (modified && content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Fixed ${filePath}`);
    }
}

const files = [
    '/Users/adrianyadav/Projects/outfitsave/components/ui/edit-outfit-form.tsx',
    '/Users/adrianyadav/Projects/outfitsave/components/ui/toaster.tsx',
    '/Users/adrianyadav/Projects/outfitsave/app/login/page.tsx',
    '/Users/adrianyadav/Projects/outfitsave/app/my-outfits/page.tsx',
    '/Users/adrianyadav/Projects/outfitsave/app/Header.tsx',
    '/Users/adrianyadav/Projects/outfitsave/app/register/page.tsx',
    '/Users/adrianyadav/Projects/outfitsave/app/outfits/page.tsx',
    '/Users/adrianyadav/Projects/outfitsave/app/outfits/share/[slug]/page.tsx',
    '/Users/adrianyadav/Projects/outfitsave/app/outfits/[id]/page.tsx',
    '/Users/adrianyadav/Projects/outfitsave/app/outfits/new/page.tsx',
    '/Users/adrianyadav/Projects/outfitsave/app/settings/page.tsx'
];

files.forEach(fixFile);
