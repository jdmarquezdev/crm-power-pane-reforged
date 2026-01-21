const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const pkg = require('../package.json');
const targets = ['chrome', 'firefox', 'edge'];

function zipDirectory(sourceDir, outPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`  Created: ${outPath} (${archive.pointer()} bytes)`);
            resolve();
        });

        archive.on('error', (err) => reject(err));
        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
    });
}

async function main() {
    const target = process.argv[2] || 'chrome';
    const distDir = path.join(__dirname, '..', 'dist', target);
    const outPath = path.join(__dirname, '..', 'dist', `${pkg.name}-v${pkg.version}-${target}.zip`);

    if (!fs.existsSync(distDir)) {
        console.error(`Error: dist/${target} directory not found. Run build first.`);
        process.exit(1);
    }

    console.log(`Packing ${target} extension v${pkg.version}...`);
    await zipDirectory(distDir, outPath);
    console.log('Done!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
