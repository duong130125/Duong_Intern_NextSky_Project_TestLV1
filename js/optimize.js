const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = './assets/images';

async function optimizeImages() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const filePath = path.join(dir, file);
      const ext = path.extname(file);
      const webpPath = filePath.replace(ext, '.webp');
      
      try {
        await sharp(filePath)
          .webp({ quality: 75 })
          .toFile(webpPath);
        console.log(`Converted ${file} to WebP`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

optimizeImages();
