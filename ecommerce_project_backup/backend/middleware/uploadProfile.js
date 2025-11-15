// backend/middleware/uploadProfile.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads/profiles directory exists
const profilesDir = "./uploads/profiles";
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

// Configure storage for profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles/");
  },
  filename: function (req, file, cb) {
    // Use user ID from authenticated request + timestamp
    const userId = req.user?.id || "user";
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);

    // Create filename: profile_{userId}_{timestamp}{ext}
    cb(null, `profile_${userId}_${timestamp}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const uploadProfile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for profile pictures
  },
});

export default uploadProfile;
