const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const allowedExtensions = new Set(['.html', '.js', '.css', '.json']);
const skipDirectories = new Set(['node_modules', '.git', 'dist']);

function looksLikeUtf16Buffer(buffer) {
    if (!buffer || buffer.length < 4) {
        return false;
    }

    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
        return true; // UTF-16 LE BOM
    }
    if (buffer[0] === 0xfe && buffer[1] === 0xff) {
        return true; // UTF-16 BE BOM
    }

    // Heuristic: a lot of null bytes near the start usually means UTF-16.
    const checkLength = Math.min(200, buffer.length);
    let nullByteCount = 0;
    for (let i = 0; i < checkLength; i += 1) {
        if (buffer[i] === 0) {
            nullByteCount += 1;
        }
    }
    return nullByteCount > checkLength * 0.2;
}

function convertUtf16FileToUtf8(filePath) {
    const raw = fs.readFileSync(filePath);
    if (!looksLikeUtf16Buffer(raw)) {
        return false;
    }

    let text;
    if (raw[0] === 0xfe && raw[1] === 0xff) {
        // Convert UTF-16 BE bytes to LE before decoding with utf16le.
        const swapped = Buffer.alloc(raw.length - 2);
        for (let i = 2; i < raw.length; i += 2) {
            swapped[i - 2] = raw[i + 1];
            swapped[i - 1] = raw[i];
        }
        text = swapped.toString('utf16le');
    } else {
        const withoutBom = raw[0] === 0xff && raw[1] === 0xfe ? raw.slice(2) : raw;
        text = withoutBom.toString('utf16le');
    }

    fs.writeFileSync(filePath, text, { encoding: 'utf8' });
    return true;
}

function walkDirectory(dirPath, changedFiles) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            if (!skipDirectories.has(entry.name)) {
                walkDirectory(fullPath, changedFiles);
            }
            continue;
        }

        const ext = path.extname(entry.name).toLowerCase();
        if (!allowedExtensions.has(ext)) {
            continue;
        }
        if (entry.name.includes('utf16-backup')) {
            continue;
        }

        const changed = convertUtf16FileToUtf8(fullPath);
        if (changed) {
            changedFiles.push(path.relative(projectRoot, fullPath));
        }
    }
}

const changedFiles = [];
walkDirectory(projectRoot, changedFiles);

if (changedFiles.length > 0) {
    console.log('[UTF-8 Guard] Converted UTF-16 files to UTF-8:');
    for (const file of changedFiles) {
        console.log('- ' + file);
    }
} else {
    console.log('[UTF-8 Guard] All checked files are already UTF-8.');
}
