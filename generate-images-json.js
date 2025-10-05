// ./generate-images-json.js
const fs = require('fs');
const path = require('path');

const galleryDir = path.resolve(__dirname, './images/gallery');
const outputFile = path.resolve(__dirname, './images/images.json');

function isImage(name) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(name);
}

if (!fs.existsSync(galleryDir)) {
  console.error(`Gallery directory not found: ${galleryDir}`);
  process.exit(1);
}

const entries = fs.readdirSync(galleryDir, { withFileTypes: true });
const result = {};

for (const entry of entries) {
  if (!entry.isDirectory()) continue;

  const folderName = entry.name;
  const folderPath = path.join(galleryDir, folderName);

  const files = fs.readdirSync(folderPath, { withFileTypes: true })
    .filter(f => f.isFile() && isImage(f.name))
    .map(f => f.name.trim())
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  result[folderName] = files;
}

// ensure output dir exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');

console.log(`✅ Wrote ${outputFile} — folders: ${Object.keys(result).length}`);
