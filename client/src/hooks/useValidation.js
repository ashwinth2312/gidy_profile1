export const useValidation = () => {
  const validateProfile = (profile) => {
    const errors = {};

    // Full Name validation
    if (!profile.fullName || profile.fullName.trim() === "") {
      errors.fullName = "Full Name is required";
    } else if (profile.fullName.trim().length < 2) {
      errors.fullName = "Full Name must be at least 2 characters";
    } else if (profile.fullName.trim().length > 100) {
      errors.fullName = "Full Name must not exceed 100 characters";
    }

    // Title validation
    if (!profile.title || profile.title.trim() === "") {
      errors.title = "Title is required";
    } else if (profile.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    } else if (profile.title.trim().length > 100) {
      errors.title = "Title must not exceed 100 characters";
    }

    // Email validation
    if (!profile.email || profile.email.trim() === "") {
      errors.email = "Email is required";
    } else if (!isValidEmail(profile.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation (optional but if provided, must be valid)
    if (profile.phone && profile.phone.trim() !== "") {
      if (!isValidPhone(profile.phone.trim())) {
        errors.phone = "Please enter a valid phone number";
      }
    }

    // Summary validation
    if (!profile.summary || profile.summary.trim() === "") {
      errors.summary = "Summary is required";
    } else if (profile.summary.trim().length < 10) {
      errors.summary = "Summary must be at least 10 characters";
    } else if (profile.summary.trim().length > 500) {
      errors.summary = "Summary must not exceed 500 characters";
    }

    // Skills validation
    if (!profile.skills || profile.skills.trim() === "") {
      errors.skills = "At least one skill is required";
    } else {
      const skillsArray = profile.skills.split(",").map(s => s.trim()).filter(Boolean);
      if (skillsArray.length === 0) {
        errors.skills = "At least one skill is required";
      } else if (skillsArray.some(skill => skill.length > 50)) {
        errors.skills = "Each skill must not exceed 50 characters";
      }
    }

    // GitHub Link validation (optional but if provided, must be valid)
    if (profile.links.github && profile.links.github.trim() !== "") {
      if (!isValidURL(profile.links.github.trim())) {
        errors.github = "Please enter a valid GitHub URL";
      }
    }

    // LinkedIn Link validation (optional but if provided, must be valid)
    if (profile.links.linkedin && profile.links.linkedin.trim() !== "") {
      if (!isValidURL(profile.links.linkedin.trim())) {
        errors.linkedin = "Please enter a valid LinkedIn URL";
      }
    }

    // Portfolio Link validation (optional but if provided, must be valid)
    if (profile.links.portfolio && profile.links.portfolio.trim() !== "") {
      if (!isValidURL(profile.links.portfolio.trim())) {
        errors.portfolio = "Please enter a valid Portfolio URL";
      }
    }

    return errors;
  };

  const validateEducation = (education) => {
    const errors = {};

    if (!education.degree || education.degree.trim() === "") {
      errors.degree = "Degree is required";
    } else if (education.degree.trim().length < 2) {
      errors.degree = "Degree must be at least 2 characters";
    } else if (education.degree.trim().length > 100) {
      errors.degree = "Degree must not exceed 100 characters";
    }

    if (!education.college || education.college.trim() === "") {
      errors.college = "College/University name is required";
    } else if (education.college.trim().length < 3) {
      errors.college = "College name must be at least 3 characters";
    } else if (education.college.trim().length > 100) {
      errors.college = "College name must not exceed 100 characters";
    }

    if (!education.year || education.year.trim() === "") {
      errors.year = "Year of completion is required";
    } else if (!/^\d{4}$/.test(education.year.trim())) {
      errors.year = "Year must be a valid 4-digit number (e.g., 2024)";
    } else {
      const year = parseInt(education.year.trim());
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear + 5) {
        errors.year = `Year must be between 1900 and ${currentYear + 5}`;
      }
    }

    return errors;
  };

  const validateProject = (project) => {
    const errors = {};

    if (!project.name || project.name.trim() === "") {
      errors.name = "Project name is required";
    } else if (project.name.trim().length < 2) {
      errors.name = "Project name must be at least 2 characters";
    } else if (project.name.trim().length > 100) {
      errors.name = "Project name must not exceed 100 characters";
    }

    if (!project.description || project.description.trim() === "") {
      errors.description = "Project description is required";
    } else if (project.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    } else if (project.description.trim().length > 500) {
      errors.description = "Description must not exceed 500 characters";
    }

    // Tech Stack validation (optional but if provided, must be valid)
    if (project.techStack && project.techStack.trim() !== "") {
      const techArray = project.techStack.split(",").map(t => t.trim()).filter(Boolean);
      if (techArray.some(tech => tech.length > 50)) {
        errors.techStack = "Each technology must not exceed 50 characters";
      }
    }

    // Link validation (optional but if provided, must be valid)
    if (project.link && project.link.trim() !== "") {
      if (!isValidURL(project.link.trim())) {
        errors.link = "Please enter a valid project URL";
      }
    }

    return errors;
  };

  return {
    validateProfile,
    validateEducation,
    validateProject,
  };
};

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};