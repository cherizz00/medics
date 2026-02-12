const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const verifyPremium = require('../middleware/premium'); // Ensure only premium users acccess
const VaultDocument = require('../models/VaultDocument');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// --- Encryption Setup ---
const ALGORITHM = 'aes-256-cbc';
// Ideally, the key should be derived from a user secret + salt, or env var.
// For MVP, we'll use a fixed key from ENV or fallback (NOT SECURE FOR PROD)
const SECRET_KEY = process.env.VAULT_SECRET || '12345678901234567890123456789012'; // 32 chars
const upload = multer({ dest: 'uploads/vault_temp/' });

// Helper to encrypt file
const encryptFile = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
        const input = fs.createReadStream(inputPath);
        const output = fs.createWriteStream(outputPath);

        input.pipe(cipher).pipe(output);

        output.on('finish', () => resolve(iv.toString('hex')));
        output.on('error', reject);
    });
};

router.use(auth);
router.use(verifyPremium);

// @route   POST api/vault/unlock
// @desc    Verify PIN to unlock vault session
router.post('/unlock', async (req, res) => {
    const { pin } = req.body;
    // Mock PIN check. In real app, hash this and store in User model.
    if (pin === '0000') {
        res.json({ success: true, token: 'mock-vault-session-token' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid PIN' });
    }
});

// @route   POST api/vault/upload
// @desc    Upload and encrypt file
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const encryptedFilename = `enc_${Date.now()}_${req.file.originalname}`;
        const encryptedPath = path.join('uploads', encryptedFilename);

        // Ensure uploads dir exists
        if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

        const iv = await encryptFile(req.file.path, encryptedPath);

        // Delete temp file
        fs.unlinkSync(req.file.path);

        const doc = new VaultDocument({
            user_id: req.user.id,
            filename: req.file.originalname,
            mime_type: req.file.mimetype,
            encrypted_path: encryptedFilename,
            iv: iv
        });

        await doc.save();
        res.json(doc);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Encryption failed' });
    }
});

// @route   GET api/vault/files
// @desc    List vault files
router.get('/files', async (req, res) => {
    try {
        const docs = await VaultDocument.find({ user_id: req.user.id }).sort({ uploaded_at: -1 });
        // Don't expose sensitive paths
        res.json(docs.map(d => ({
            _id: d._id,
            filename: d.filename,
            mime_type: d.mime_type,
            uploaded_at: d.uploaded_at
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
