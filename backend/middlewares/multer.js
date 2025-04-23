// middlewares/upload.js
import multer from 'multer';

// Basic memory storage (for converting to Data URI later)
const storage = multer.memoryStorage();

// Initialize the multer instance
const upload = multer({ storage });

// Single file upload (already used in userRoutes)
export default upload;

// Multiple files upload - NEW export
export const uploadMultiple = upload.array('files',5); 
// 'files' is the key in your frontend formData, 5 is max file count
