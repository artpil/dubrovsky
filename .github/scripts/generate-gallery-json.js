const fs = require('fs');
const path = require('path');

const galleryPath = path.join(process.cwd(), 'images/gallery');
const outputPath = path.join(process.cwd(), 'images.json');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
const DESCRIPTION_EXTENSION = '.json';

// Ищет рядом с картинкой файл описания с тем же именем, но .json.
// Поддерживает два формата содержимого:
//   "Просто строка с описанием"
//   { "description": "Описание" }
function readDescription(folderPath, imageFile) {
  const baseName = path.basename(imageFile, path.extname(imageFile));
  const descPath = path.join(folderPath, `${baseName}${DESCRIPTION_EXTENSION}`);

  if (!fs.existsSync(descPath)) return '';

  try {
    const raw = fs.readFileSync(descPath, 'utf-8');
    const parsed = JSON.parse(raw);

    if (typeof parsed === 'string') return parsed;
    if (parsed && typeof parsed.description === 'string') return parsed.description;

    console.warn(`\u26a0\ufe0f  ${descPath}: ожидалась строка или { "description": "..." }, значение проигнорировано`);
    return '';
  } catch (err) {
    console.warn(`\u26a0\ufe0f  Не удалось прочитать ${descPath}: ${err.message}`);
    return '';
  }
}

function main() {
  if (!fs.existsSync(galleryPath)) {
    console.log('Gallery directory not found, creating empty JSON');
    fs.writeFileSync(outputPath, JSON.stringify({}, null, 2));
    return;
  }

  const folders = fs.readdirSync(galleryPath).filter((item) => {
    return fs.statSync(path.join(galleryPath, item)).isDirectory();
  });

  const gallery = {};

  folders.forEach((folder) => {
    const folderPath = path.join(galleryPath, folder);

    const files = fs
      .readdirSync(folderPath)
      .filter((file) => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
      .sort();

    gallery[folder] = files.map((file) => ({
      src: `${folder}/${file}`,
      description: readDescription(folderPath, file)
    }));
  });

  fs.writeFileSync(outputPath, JSON.stringify(gallery, null, 2));

  const total = Object.values(gallery).reduce((sum, files) => sum + files.length, 0);
  console.log('Generated images.json successfully!');
  console.log('Found folders:', Object.keys(gallery).join(', '));
  console.log('Total images:', total);
}

main();