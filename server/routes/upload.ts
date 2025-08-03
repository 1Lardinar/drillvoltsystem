import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadsDir();
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

// File filter to only allow images
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Configure multer
const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Single file upload middleware
export const uploadSingle = upload.single('image');

// Multiple files upload middleware
export const uploadMultiple = upload.array('images', 10);

// POST /api/upload/single - Upload single image
export const uploadSingleImage: RequestHandler = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
};

// POST /api/upload/multiple - Upload multiple images
export const uploadMultipleImages: RequestHandler = (req, res) => {
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const uploadedFiles = files.map(file => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size
  }));

  res.json({
    success: true,
    files: uploadedFiles
  });
};

// GET /api/upload/list - List all uploaded files
export const listUploadedFiles: RequestHandler = async (req, res) => {
  try {
    await ensureUploadsDir();
    const files = await fs.readdir(UPLOADS_DIR);
    
    const fileDetails = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(UPLOADS_DIR, filename);
        const stats = await fs.stat(filePath);
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.ctime.toISOString()
        };
      })
    );

    res.json({
      success: true,
      files: fileDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
};

// DELETE /api/upload/:filename - Delete uploaded file
export const deleteUploadedFile: RequestHandler = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, filename);
    
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};
