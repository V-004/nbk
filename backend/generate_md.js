const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..'); // contactless-bank root
const outputDir = path.resolve(rootDir, '..'); // WebDev folder
const outputFile = path.join(outputDir, 'contactless-bank-codebase.md');

console.log(`Scanning directory: ${rootDir}`);
console.log(`Output MD: ${outputFile}`);

const writeStream = fs.createWriteStream(outputFile);

writeStream.write(`# Contactless Bank Codebase\n\nGenerated on: ${new Date().toLocaleString()}\n\n`);

const excludedDirs = [
    'node_modules',
    '.git',
    '.next',
    '.vscode',
    'dist',
    'build',
    'coverage',
    'tmp',
    'image',
    'intro',
    '_legacy_backup'
];

const excludedFiles = [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.DS_Store',
    'database.sqlite',
    'favicon.ico',
    'pattern.svg',
    'contactless-bank-codebase.pdf',
    'contactless-bank-codebase.md'
];

// Helper to check binary files (simple heuristic)
function isBinary(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.pdf', '.zip', '.tar', '.gz', '.db', '.sqlite', '.mp3', '.mp4', '.mov', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.apk', '.zip'];
    return binaryExts.includes(ext);
}

function walk(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (excludedDirs.includes(file)) continue;
            walk(filePath);
        } else {
            if (excludedFiles.includes(file)) continue;
            if (isBinary(filePath)) continue;
            if (filePath.includes('generate_pdf.js')) continue; 
            if (filePath.includes('generate_md.js')) continue;

            // Add file to MD
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relPath = path.relative(rootDir, filePath);
                const ext = path.extname(filePath).replace('.', '') || 'text';
                
                writeStream.write(`\n\n## File: ${relPath}\n\n\`\`\`${ext}\n${content}\n\`\`\`\n`);
                console.log(`Added: ${relPath}`);
            } catch (err) {
                console.error(`Error reading ${filePath}: ${err.message}`);
            }
        }
    }
}

walk(rootDir);

writeStream.end();

writeStream.on('finish', () => {
    console.log('Markdown generation complete.');
});
