const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const maxSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 10);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

module.exports = multer({
  storage,
  limits: {
    fileSize: maxSizeMb * 1024 * 1024
  }
});
