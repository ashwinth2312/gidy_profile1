const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },

    title: { type: String, trim: true }, 
    summary: { type: String, trim: true },

    skills: [{ type: String, trim: true }],

    
    links: {
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      portfolio: { type: String, trim: true }
    },

    education: [
      {
        degree: { type: String, trim: true },
        college: { type: String, trim: true },
        year: { type: String, trim: true }
      }
    ],

    projects: [
      {
        name: { type: String, trim: true },
        description: { type: String, trim: true },
        techStack: [{ type: String, trim: true }],
        link: { type: String, trim: true }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
