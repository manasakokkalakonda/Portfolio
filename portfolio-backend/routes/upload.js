const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/auth');

// Configure Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder
  },
  filename: (req, file, cb) => {
    // Generate unique filename using current timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter
});

// POST /api/upload/image endpoint (Protected by JWT)
router.post('/image', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }

    // Construct the accessible file URL
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      fileName: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;