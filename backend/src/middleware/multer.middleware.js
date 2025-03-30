const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Create directory paths with absolute paths
const rootDir = path.resolve(__dirname, '..');
const tempDir = path.join(rootDir, 'public', 'temp');
const uploadsDir = path.join(rootDir, 'public', 'uploads');

// console.log('Temp directory absolute path:', tempDir);
// console.log('Uploads directory absolute path:', uploadsDir);

// Create directories if they don't exist
[tempDir, uploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir ); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  }
});

// Export using CommonJS syntax
module.exports = { upload };