import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // keeps file in RAM
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});

export default upload;
