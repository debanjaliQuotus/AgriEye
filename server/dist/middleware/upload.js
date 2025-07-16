"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleProductUpload = exports.handleEkycUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload directories exist
const createUploadDir = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
};
const ekycUploadDir = path_1.default.join(__dirname, '../../uploads/ekyc');
createUploadDir(ekycUploadDir);
// Configure eKYC storage
const ekycStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const docType = file.fieldname; // 'aadhar', 'pan', or 'selfie'
        const docDir = path_1.default.join(ekycUploadDir, docType);
        createUploadDir(docDir);
        cb(null, docDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${ext}`);
    }
});
// Update file filter to accept correct file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/i;
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only JPG, PNG and PDF files are allowed'));
};
const ekycUpload = (0, multer_1.default)({
    storage: ekycStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter
}).fields([
    { name: 'aadhar', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
]);
const handleEkycUpload = (req, res, next) => {
    ekycUpload(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).json({
                success: false,
                message: `Upload error: ${err.message}`
            });
        }
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        // Log received files for debugging
        next();
    });
};
exports.handleEkycUpload = handleEkycUpload;
// Configure product upload storage
const productStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads/products');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        // Use proper file extension
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${ext}`);
    }
});
const productFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
};
const productUpload = (0, multer_1.default)({
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files
    },
    fileFilter: productFileFilter
});
const handleProductUpload = (req, res, next) => {
    const upload = (0, multer_1.default)({ storage: productStorage }).array('images', 5);
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                success: false,
                message: 'Error uploading files',
                error: err instanceof Error ? err.message : 'Unknown error'
            });
        }
        // Log uploaded files
        if (req.files) {
            console.log('Files uploaded:', {
                count: req.files.length,
                files: req.files.map(f => ({
                    filename: f.filename,
                    size: f.size,
                    mimetype: f.mimetype
                }))
            });
        }
        next();
    });
};
exports.handleProductUpload = handleProductUpload;
