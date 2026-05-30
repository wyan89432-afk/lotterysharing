import type { Express } from "express";
import multer from "multer";
import { storagePut } from "./storage";

type MulterRequest = Express.Request & {
  file?: Express.Multer.File;
};

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export function registerUploadRoutes(app: Express) {
  app.post("/api/storage/upload", upload.single("file"), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      // Generate a unique filename
      const timestamp = Date.now();
      const filename = `photos/${timestamp}_${req.file.originalname}`;

      // Upload to S3
      const { key, url } = await storagePut(
        filename,
        req.file.buffer,
        req.file.mimetype
      );

      return res.json({ key, url });
    } catch (error) {
      console.error("[Upload] Error:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  });
}
