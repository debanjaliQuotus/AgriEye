import { Request, Response, NextFunction } from 'express';
import connectDB from './config/db';
import cors from 'cors';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import userRoutes from './routes/userRoutes';
import motionEventRoutes from './routes/motionEventRoutes';
import smsRoutes from './routes/smsRoutes'; 


const app = express();

//deployment-code 

dotenv.config();



if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  console.error('One or more Twilio environment variables are missing!');
}

// Connect to MongoDB
connectDB();

// Enhanced CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['https://agrieye-1.onrender.com', 'http://localhost:5000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Authorization', 'x-auth-token'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());

// Debug static file serving
const uploadsPath = path.join(__dirname, '..', 'uploads');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Enhanced static file serving with detailed logging
app.use('/uploads', (req: Request, _res: Response, next: NextFunction) => {
  const fullPath = path.join(uploadsPath, req.url);
  next();
});

// Add a test endpoint to verify file existence
app.get('/api/check-file/:filename', (req: Request, res: Response) => {
  const filePath = path.join(uploadsPath, 'products', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.json({ exists: true, path: filePath });
  } else {
    res.json({ exists: false, path: filePath });
  }
});

// Add debug endpoints before your other routes
app.get('/api/debug/uploads', (req, res) => {
  try {
    const productsPath = path.join(uploadsPath, 'products');
    const files = fs.existsSync(productsPath) 
      ? fs.readdirSync(productsPath)
      : [];
    
    res.json({
      uploadsPath,
      productsPath,
      files: files.map(file => ({
        name: file,
        path: `/uploads/products/${file}`,
        fullPath: path.join(productsPath, file),
        exists: fs.existsSync(path.join(productsPath, file))
      }))
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/debug/file/:filename', (req, res) => {
  const filePath = path.join(uploadsPath, 'products', req.params.filename);
  res.json({
    exists: fs.existsSync(filePath),
    path: filePath,
    stats: fs.existsSync(filePath) ? fs.statSync(filePath) : null
  });
});

// Serve static files from the uploads directory
app.use('/api/uploads', express.static(uploadsPath));

// Routes
app.use('/api/users', userRoutes);


app.use('/api/motion', motionEventRoutes);
app.use('/api/notification', smsRoutes);

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Correctly serve the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
