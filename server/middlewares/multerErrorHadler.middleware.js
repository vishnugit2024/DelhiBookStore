import multer from 'multer';

export function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(401).json({ error: 'File too large. Max size is 2MB.' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    console.log('Something went wrong in multer file size middleware', err);
    return res.status(500).json({ error: 'Something went wrong in multer file size middleware' });
  }

  next();
}