const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const verifyPremium = require('../middleware/premium'); // Ensure only premium users acccess
const VaultDocument = require('../models/VaultDocument');
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
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

// @route   GET api/vault/status
// @desc    Check if user has a vault PIN set
router.get('/status', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ hasPin: !!user.vaultPin });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/vault/set-pin
// @desc    Set or update vault PIN
router.post('/set-pin', async (req, res) => {
    const { pin } = req.body;
    if (!pin || pin.length !== 4) return res.status(400).json({ message: 'PIN must be 4 digits' });

    try {
        const user = await User.findById(req.user.id);
        const salt = await bcrypt.genSalt(10);
        user.vaultPin = await bcrypt.hash(pin, salt);
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/vault/unlock
// @desc    Verify PIN to unlock vault session
router.post('/unlock', async (req, res) => {
    const { pin } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.vaultPin) return res.status(400).json({ success: false, message: 'Vault PIN not set' });

        const isMatch = await bcrypt.compare(pin, user.vaultPin);
        if (isMatch) {
            res.json({ success: true, token: 'mock-vault-session-token' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid PIN' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
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
            uploaded_at: d.uploaded_at,
            is_assessment: d.is_assessment,
            assessment_id: d.assessment_id
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
