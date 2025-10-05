// ./generate-images-json.js
const fs = require("fs");
const path = require("path");

const dir = "./images/gallery/";
const output = path.join(dir, "images.json");

// Рекурсивный обход с сохранением относительных путей
function walk(dirPath, baseDir) {
  let results = [];
  const list = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of list) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/"); // слэши под веб

    if (entry.isDirectory()) {
      results = results.concat(walk(fullPath, baseDir));
    } else if (/\.(png|jpe?g|gif|webp|svg)$/i.test(entry.name) && entry.name !== "images.json") {
      results.push(relPath);
    }
  }
  return results;
}

const files = walk(dir, dir);

// Сохраняем JSON
fs.writeFileSync(output, JSON.stringify(files, null, 2), "utf8");
console.log(`✅ images.json created with ${files.length} files`);
