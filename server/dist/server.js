"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const motionEventRoutes_1 = __importDefault(require("./routes/motionEventRoutes"));
const smsRoutes_1 = __importDefault(require("./routes/smsRoutes"));
const app = (0, express_1.default)();
//deployment-code 
dotenv_1.default.config();
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.error('One or more Twilio environment variables are missing!');
}
// Connect to MongoDB
(0, db_1.default)();
// Enhanced CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ['https://agrieye-1.onrender.com', 'http://localhost:5000'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Authorization', 'x-auth-token'],
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
// Middleware
app.use(express_1.default.json());
// Debug static file serving
const uploadsPath = path_1.default.join(__dirname, '..', 'uploads');
// Configure multer for image uploads
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadsDir = path_1.default.join(__dirname, '..', 'uploads', 'products');
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
// Enhanced static file serving with detailed logging
app.use('/uploads', (req, _res, next) => {
    const fullPath = path_1.default.join(uploadsPath, req.url);
    next();
});
// Add a test endpoint to verify file existence
app.get('/api/check-file/:filename', (req, res) => {
    const filePath = path_1.default.join(uploadsPath, 'products', req.params.filename);
    if (fs_1.default.existsSync(filePath)) {
        res.json({ exists: true, path: filePath });
    }
    else {
        res.json({ exists: false, path: filePath });
    }
});
// Add debug endpoints before your other routes
app.get('/api/debug/uploads', (req, res) => {
    try {
        const productsPath = path_1.default.join(uploadsPath, 'products');
        const files = fs_1.default.existsSync(productsPath)
            ? fs_1.default.readdirSync(productsPath)
            : [];
        res.json({
            uploadsPath,
            productsPath,
            files: files.map(file => ({
                name: file,
                path: `/uploads/products/${file}`,
                fullPath: path_1.default.join(productsPath, file),
                exists: fs_1.default.existsSync(path_1.default.join(productsPath, file))
            }))
        });
    }
    catch (error) {
        res.status(500).json({ error: String(error) });
    }
});
app.get('/api/debug/file/:filename', (req, res) => {
    const filePath = path_1.default.join(uploadsPath, 'products', req.params.filename);
    res.json({
        exists: fs_1.default.existsSync(filePath),
        path: filePath,
        stats: fs_1.default.existsSync(filePath) ? fs_1.default.statSync(filePath) : null
    });
});
// Serve static files from the uploads directory
app.use('/api/uploads', express_1.default.static(uploadsPath));
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/motion', motionEventRoutes_1.default);
app.use('/api/notification', smsRoutes_1.default);
const clientPath = path_1.default.join(__dirname, '..', '..', 'client', 'dist');
// Serve static files from the client's build directory
app.use(express_1.default.static(clientPath));
// For all other routes, send the index.html file
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(clientPath, 'index.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
