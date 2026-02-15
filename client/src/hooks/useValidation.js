export const useValidation = () => {
  const validateProfile = (profile) => {
    const errors = {};

    if (!profile.fullName?.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!profile.title?.trim()) {
      errors.title = "Professional title is required";
    }

    if (!profile.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = "Invalid email format";
    }

    if (profile.phone && !/^[\d\s\-\+\(\)]+$/.test(profile.phone)) {
      errors.phone = "Invalid phone format";
    }

    if (!profile.summary?.trim()) {
      errors.summary = "Professional summary is required";
    }

    return errors;
  };

  const validateEducation = (education) => {
    const errors = {};

    if (!education.degree?.trim()) {
      errors.degree = "Degree is required";
    }

    if (!education.college?.trim()) {
      errors.college = "College/University is required";
    }

    if (!education.year?.trim()) {
      errors.year = "Year is required";
    }

    return errors;
  };

  const validateProject = (project) => {
    const errors = {};

    if (!project.name?.trim()) {
      errors.name = "Project name is required";
    }

    if (!project.description?.trim()) {
      errors.description = "Description is required";
    }

    if (project.link && !/^https?:\/\/.+/.test(project.link)) {
      errors.link = "Invalid URL format";
    }

    return errors;
  };

  const validateSkill = (skill) => {
    const errors = {};

    if (!skill.name?.trim()) {
      errors.name = "Skill name is required";
    }

    if (skill.rating < 1 || skill.rating > 5) {
      errors.rating = "Please select a rating between 1-5";
    }

    return errors;
  };

  return {
    validateProfile,
    validateEducation,
    validateProject,
    validateSkill,
  };
};