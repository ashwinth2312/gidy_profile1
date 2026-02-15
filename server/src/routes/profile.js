import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Profile from "../models/Profile.js";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Use fixed filename 'profile-picture' to maintain only one file
    const ext = path.extname(file.originalname);
    cb(null, `profile-picture${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, png, gif, webp)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// GET profile data
router.get("/", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
      await profile.save();
    }

    // Check if profile picture exists and add its filename
    const files = fs.readdirSync(uploadsDir);
    const profilePicFile = files.find(f => f.startsWith("profile-picture"));

    res.json({
      ...profile.toObject(),
      profilePicture: profilePicFile || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update profile details
router.put("/", async (req, res) => {
  try {
    const { fullName, email, phone, title, summary, links } = req.body;

    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    profile.fullName = fullName || profile.fullName;
    profile.email = email || profile.email;
    profile.phone = phone || profile.phone;
    profile.title = title || profile.title;
    profile.summary = summary || profile.summary;
    
    if (links) {
      profile.links = {
        github: links.github || profile.links.github,
        linkedin: links.linkedin || profile.links.linkedin,
        portfolio: links.portfolio || profile.links.portfolio,
      };
    }

    await profile.save();

    res.json({
      message: "Profile updated successfully",
      ...profile.toObject(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Upload profile picture
router.post("/upload-picture", upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Delete old profile picture files (keep only the new one)
    const files = fs.readdirSync(uploadsDir);
    const oldPicFiles = files.filter(f => f.startsWith("profile-picture") && f !== req.file.filename);
    
    oldPicFiles.forEach(file => {
      try {
        fs.unlinkSync(path.join(uploadsDir, file));
      } catch (err) {
        console.error(`Failed to delete old file: ${file}`, err);
      }
    });

    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    profile.profilePicture = req.file.filename;
    await profile.save();

    res.json({
      message: "Profile picture uploaded successfully",
      filename: req.file.filename,
      ...profile.toObject(),
    });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Failed to delete uploaded file", err);
      }
    }
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete profile picture
router.delete("/picture", async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const profilePicFile = files.find(f => f.startsWith("profile-picture"));

    if (profilePicFile) {
      fs.unlinkSync(path.join(uploadsDir, profilePicFile));
    }

    let profile = await Profile.findOne();
    if (profile) {
      profile.profilePicture = null;
      await profile.save();
    }

    res.json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Add/Update Education
router.put("/education", async (req, res) => {
  try {
    const { degree, college, year } = req.body;

    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    // Check if education entry already exists with same details
    const existingIndex = profile.education.findIndex(
      e => e.degree === degree && e.college === college && e.year === year
    );

    if (existingIndex === -1) {
      profile.education.push({ degree, college, year });
    }

    await profile.save();

    res.json({
      message: "Education added successfully",
      education: profile.education,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Remove Education
router.delete("/education/:id", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.education.id(req.params.id).deleteOne();
    await profile.save();

    res.json({
      message: "Education deleted successfully",
      education: profile.education,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Add/Update Project
router.put("/projects", async (req, res) => {
  try {
    const { name, description, techStack, link } = req.body;

    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    // Check if project already exists
    const existingIndex = profile.projects.findIndex(p => p.name === name);

    if (existingIndex === -1) {
      profile.projects.push({ name, description, techStack, link });
    }

    await profile.save();

    res.json({
      message: "Project added successfully",
      projects: profile.projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Remove Project
router.delete("/projects/:id", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.projects.id(req.params.id).deleteOne();
    await profile.save();

    res.json({
      message: "Project deleted successfully",
      projects: profile.projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Add/Update Skill
router.put("/skills", async (req, res) => {
  try {
    const { name, rating } = req.body;

    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    // Check if skill already exists
    const existingIndex = profile.skills.findIndex(s => s.name === name);

    if (existingIndex === -1) {
      profile.skills.push({ name, rating });
    } else {
      profile.skills[existingIndex].rating = rating;
    }

    await profile.save();

    res.json({
      message: "Skill added successfully",
      skills: profile.skills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Remove Skill
router.delete("/skills/:id", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.skills.id(req.params.id).deleteOne();
    await profile.save();

    res.json({
      message: "Skill deleted successfully",
      skills: profile.skills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
