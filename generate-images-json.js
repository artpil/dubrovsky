// ./generate-images-json.js
const fs = require("fs");
const path = require("path");

const baseDir = "./images/gallery/";
const output = "./images/images.json";

function generateGalleryJSON(dirPath) {
  const folders = fs.readdirSync(dirPath, { withFileTypes: true });
  const result = {};

  for (const folder of folders) {
    if (folder.isDirectory()) {
      const folderPath = path.join(dirPath, folder.name);
      const files = fs
        .readdirSync(folderPath)
        .filter(
          (file) =>
            /\.(png|jpe?g|gif|webp|svg)$/i.test(file) && file !== "images.json"
        );
      result[folder.name] = files;
    }
  }

  return result;
}

const data = generateGalleryJSON(baseDir);

fs.writeFileSync(output, JSON.stringify(data, null, 2), "utf8");
console.log(`✅ images.json created with ${Object.keys(data).length} folders`);

