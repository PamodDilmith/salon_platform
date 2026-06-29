const express = require('express');
const router = express.Router();
const {
  registerBeautician,
  getApprovedBeauticians,
  getBeauticianById,
  getBeauticianProfile,
  updateBeauticianProfile,
  protectBeautician
} = require('../controllers/beauticianController');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Public routes
router.post('/register', upload.single('profilePhoto'), registerBeautician);
router.get('/', getApprovedBeauticians);
router.get('/:id', getBeauticianById);

// Protected routes (for beautician dashboard)
router.get('/profile/me', protectBeautician, getBeauticianProfile);
router.put('/profile/me', protectBeautician, updateBeauticianProfile);

module.exports = router;
