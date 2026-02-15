import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: null,
    },
    links: {
      github: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      portfolio: {
        type: String,
        default: "",
      },
    },
    education: [
      {
        degree: String,
        college: String,
        year: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        techStack: [String],
        link: String,
      },
    ],
    skills: [
      {
        name: String,
        rating: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
