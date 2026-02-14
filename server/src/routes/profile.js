const express = require("express");
const Profile = require("../models/Profile");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const profile = await Profile.findOne().sort({ updatedAt: -1 });
    return res.json(profile || {});
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.put("/", async (req, res) => {
  try {
    const data = req.body;

    
    if (!data.fullName || !data.email) {
      return res.status(400).json({ message: "fullName and email are required" });
    }

    
    const existing = await Profile.findOne();

    const saved = existing
      ? await Profile.findByIdAndUpdate(existing._id, data, { new: true })
      : await Profile.create(data);

    return res.json(saved);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.put("/education", async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    profile.education.push(req.body);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/projects", async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    profile.projects.push(req.body);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/education/:eduId", async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    const before = profile.education.length;

    profile.education = profile.education.filter(
      (e) => e._id.toString() !== req.params.eduId
    );

    if (profile.education.length === before) {
      return res.status(404).json({ msg: "Education not found" });
    }

    await profile.save();
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


router.delete("/projects/:projectId", async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    const before = profile.projects.length;

    profile.projects = profile.projects.filter(
      (p) => p._id.toString() !== req.params.projectId
    );

    if (profile.projects.length === before) {
      return res.status(404).json({ msg: "Project not found" });
    }

    await profile.save();
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


module.exports = router;
