import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Ensure upload directories exist
const createUploadDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const ekycUploadDir = path.join(__dirname, '../../uploads/ekyc');
createUploadDir(ekycUploadDir);

// Configure eKYC storage
const ekycStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const docType = file.fieldname; // 'aadhar', 'pan', or 'selfie'
    const docDir = path.join(ekycUploadDir, docType);
    createUploadDir(docDir);
    cb(null, docDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Update file filter to accept correct file types
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|pdf/i;
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only JPG, PNG and PDF files are allowed'));
};

const ekycUpload = multer({
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

export const handleEkycUpload = (req: Request, res: Response, next: NextFunction) => {
  ekycUpload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
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

// Configure product upload storage
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    // Use proper file extension
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const productFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
};

const productUpload = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: productFileFilter
});

export const handleProductUpload = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer({ storage: productStorage }).array('images', 5);
  
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
        count: (req.files as Express.Multer.File[]).length,
        files: (req.files as Express.Multer.File[]).map(f => ({
          filename: f.filename,
          size: f.size,
          mimetype: f.mimetype
        }))
      });
    }

    next();
  });
};