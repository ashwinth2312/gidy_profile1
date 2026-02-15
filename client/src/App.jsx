import { useEffect, useState, useContext } from "react";
import "./App.css";
import { ThemeContext } from "./ThemeContext";
import { AlertDialog } from "./components/AlertDialog";
import { Modal } from "./components/Modal";
import { InputField, TextAreaField } from "./components/InputField";
import { useValidation } from "./hooks/useValidation";
import Icons from "./components/Icons";
import AppBar from "./components/AppBar"; // Add this import

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/profile";
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000/uploads";

const emptyEducation = { degree: "", college: "", year: "" };
const emptyProject = { name: "", description: "", techStack: "", link: "" };
const emptySkill = { name: "", rating: 1 };

export default function App() {
  const { isDark } = useContext(ThemeContext);
  const { validateProfile, validateEducation, validateProject } = useValidation();
  const [loading, setLoading] = useState(true);

  // Modal States
  const [modalState, setModalState] = useState({
    profileModal: false,
    educationModal: false,
    projectModal: false,
    skillModal: false,
    uploadPictureModal: false,
  });

  // Profile Edit Mode State
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Alert Dialog State
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
    confirmText: "Confirm",
    cancelText: "Cancel",
  });

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    title: "",
    summary: "",
    links: { github: "", linkedin: "", portfolio: "" },
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const [profileErrors, setProfileErrors] = useState({});

  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [educationErrors, setEducationErrors] = useState({});

  const [projectForm, setProjectForm] = useState(emptyProject);
  const [projectErrors, setProjectErrors] = useState({});

  const [skillForm, setSkillForm] = useState(emptySkill);
  const [skillErrors, setSkillErrors] = useState({});

  const [educationList, setEducationList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);

  // Store original profile for cancel functionality
  const [originalProfile, setOriginalProfile] = useState(null);

  // Fetch initial profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}`);
        const data = await res.json();

        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          title: data.title || "",
          summary: data.summary || "",
          links: {
            github: data.links?.github || "",
            linkedin: data.links?.linkedin || "",
            portfolio: data.links?.portfolio || "",
          },
        });

        if (data.profilePicture) {
          setProfilePicture(`${UPLOADS_URL}/${data.profilePicture}`);
        }

        const hasProfileData = data.fullName && data.email && data.title && data.summary;
        setProfileSaved(hasProfileData);
        setIsProfileEditing(!hasProfileData);

        setEducationList(data.education || []);
        setProjectsList(data.projects || []);
        setSkillsList(data.skills || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Show custom alert
  const showAlert = (title, message, type = "info", onConfirm = null, confirmText = "Confirm") => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      confirmText,
      cancelText: "Cancel",
    });
  };

  // Close alert
  const closeAlert = () => {
    setAlert({
      ...alert,
      isOpen: false,
    });
  };

  // Modal Management Functions
  const openModal = (modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const onLinkChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      links: { ...prev.links, [name]: value },
    }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Profile Picture Handlers
  const handlePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showAlert(
        "Invalid File",
        "Please upload only image files (JPG, PNG, GIF, WebP)",
        "danger"
      );
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert(
        "File Too Large",
        "Please upload an image smaller than 5MB",
        "danger"
      );
      return;
    }

    setPictureFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPicturePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfilePicture = async () => {
    if (!pictureFile) {
      showAlert("No File", "Please select an image first", "warning");
      return;
    }

    setUploadingPicture(true);

    try {
      const formData = new FormData();
      formData.append("profilePicture", pictureFile);

      console.log("📸 Uploading profile picture...");

      const response = await fetch(`${API_BASE}/upload-picture`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Profile picture uploaded successfully:", data);

      // Update profile picture with new URL and timestamp to bypass cache
      setProfilePicture(`${UPLOADS_URL}/${data.filename}?t=${Date.now()}`);
      setPicturePreview(null);
      setPictureFile(null);

      closeModal("uploadPictureModal");
      closeAlert();

      showAlert(
        "Success",
        "Profile picture uploaded successfully! 🎉",
        "success"
      );

      setTimeout(() => {
        closeAlert();
      }, 2000);
    } catch (error) {
      console.error("❌ Error uploading profile picture:", error);
      showAlert(
        "Upload Error",
        `Failed to upload picture: ${error.message}`,
        "danger"
      );
    } finally {
      setUploadingPicture(false);
    }
  };

  const deleteProfilePicture = async () => {
    showAlert(
      "Delete Picture",
      "Are you sure you want to delete your profile picture?",
      "danger",
      async () => {
        try {
          const response = await fetch(`${API_BASE}/picture`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete picture");
          }

          setProfilePicture(null);
          setPicturePreview(null);
          setPictureFile(null);
          closeAlert();

          showAlert(
            "Success",
            "Profile picture deleted successfully",
            "success"
          );

          setTimeout(() => {
            closeAlert();
          }, 2000);
        } catch (error) {
          console.error("Error deleting picture:", error);
          showAlert(
            "Error",
            `Failed to delete picture: ${error.message}`,
            "danger"
          );
        }
      },
      "Delete"
    );
  };

  const openUploadPictureModal = () => {
    setPicturePreview(null);
    setPictureFile(null);
    openModal("uploadPictureModal");
  };

  const onEducationChange = (field, value) => {
    setEducationForm((prev) => ({ ...prev, [field]: value }));
    if (educationErrors[field]) {
      setEducationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const onProjectChange = (field, value) => {
    setProjectForm((prev) => ({ ...prev, [field]: value }));
    if (projectErrors[field]) {
      setProjectErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const onSkillChange = (field, value) => {
    setSkillForm((prev) => ({ ...prev, [field]: value }));
    if (skillErrors[field]) {
      setSkillErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleEditProfile = () => {
    setOriginalProfile({ ...profile });
    setIsProfileEditing(true);
    openModal("profileModal");
  };

  const handleCancelEdit = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsProfileEditing(false);
    setProfileErrors({});
    closeModal("profileModal");
  };

  const saveProfile = async () => {
    const { validateProfile } = useValidation();
    const errors = validateProfile(profile);

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      let errorMessage = "Please fix the following errors:\n\n";
      Object.entries(errors).forEach(([field, error]) => {
        errorMessage += `• ${error}\n`;
      });
      showAlert(
        "Validation Error",
        errorMessage,
        "danger"
      );
      return;
    }

    showAlert(
      "Save Profile",
      "Are you sure you want to save this profile?",
      "info",
      handleConfirmSave,
      "Save"
    );
  };

  const handleConfirmSave = async () => {
    try {
      const payload = {
        fullName: profile.fullName.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        title: profile.title.trim(),
        summary: profile.summary.trim(),
        links: {
          github: profile.links.github.trim(),
          linkedin: profile.links.linkedin.trim(),
          portfolio: profile.links.portfolio.trim(),
        },
      };

      console.log("💾 Saving profile with payload:", payload);

      const response = await fetch(`${API_BASE}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Profile saved successfully:", data);

      setProfile({
        fullName: data.fullName || profile.fullName,
        email: data.email || profile.email,
        phone: data.phone || profile.phone,
        title: data.title || profile.title,
        summary: data.summary || profile.summary,
        links: {
          github: data.links?.github || profile.links.github,
          linkedin: data.links?.linkedin || profile.links.linkedin,
          portfolio: data.links?.portfolio || profile.links.portfolio,
        },
      });

      setIsProfileEditing(false);
      setProfileSaved(true);
      setOriginalProfile(null);
      setProfileErrors({});
      closeModal("profileModal");
      closeAlert();

      showAlert(
        "Success",
        "Profile saved successfully! 🎉",
        "success"
      );

      setTimeout(() => {
        closeAlert();
      }, 2000);
    } catch (error) {
      console.error("❌ Error saving profile:", error);
      showAlert(
        "Error",
        `Failed to save profile: ${error.message}`,
        "danger"
      );
    }
  };

  const addEducation = () => {
    const errors = validateEducation(educationForm);

    if (Object.keys(errors).length > 0) {
      setEducationErrors(errors);
      return;
    }

    fetch(`${API_BASE}/education`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        degree: educationForm.degree.trim(),
        college: educationForm.college.trim(),
        year: educationForm.year.trim(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setEducationList(data.education || []);
        setEducationForm(emptyEducation);
        setEducationErrors({});
      });
  };

  const addProject = () => {
    const errors = validateProject(projectForm);

    if (Object.keys(errors).length > 0) {
      setProjectErrors(errors);
      return;
    }

    const payload = {
      name: projectForm.name.trim(),
      description: projectForm.description.trim(),
      techStack: projectForm.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      link: projectForm.link.trim(),
    };

    fetch(`${API_BASE}/projects`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setProjectsList(data.projects || []);
        setProjectForm(emptyProject);
        setProjectErrors({});
      });
  };

  const addSkill = () => {
    if (!skillForm.name.trim()) {
      setSkillErrors({ name: "Skill name is required" });
      return;
    }

    const payload = {
      name: skillForm.name.trim(),
      rating: parseInt(skillForm.rating),
    };

    fetch(`${API_BASE}/skills`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setSkillsList(data.skills || []);
        setSkillForm({ name: "", rating: 1 });
        setSkillErrors({});
      });
  };

  const deleteEducation = (eduId, degree, college) => {
    showAlert(
      "Delete Education",
      `Are you sure you want to delete "${degree} from ${college}"? This action cannot be undone.`,
      "danger",
      () => {
        fetch(`${API_BASE}/education/${eduId}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            setEducationList(data.education || []);
          });
        closeAlert();
      },
      "Delete"
    );
  };

  const deleteProject = (projectId, projectName) => {
    showAlert(
      "Delete Project",
      `Are you sure you want to delete the project "${projectName}"? This action cannot be undone.`,
      "danger",
      () => {
        fetch(`${API_BASE}/projects/${projectId}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            setProjectsList(data.projects || []);
          });
        closeAlert();
      },
      "Delete"
    );
  };

  const deleteSkill = (skillId, skillName) => {
    showAlert(
      "Delete Skill",
      `Are you sure you want to delete "${skillName}"? This action cannot be undone.`,
      "danger",
      () => {
        fetch(`${API_BASE}/skills/${skillId}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            setSkillsList(data.skills || []);
          });
        closeAlert();
      },
      "Delete"
    );
  };

  if (loading) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <div className="appWrapper">
      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
        onConfirm={() => {
          if (alert.onConfirm) alert.onConfirm();
        }}
        onCancel={closeAlert}
      />

      {/* Profile Picture Upload Modal */}
      <Modal
        isOpen={modalState.uploadPictureModal}
        title="Upload Profile Picture"
        onClose={() => closeModal("uploadPictureModal")}
        size="md"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Picture Preview */}
          <div className="picturePreviewContainer">
            {picturePreview ? (
              <img src={picturePreview} alt="Preview" className="picturePreview" />
            ) : profilePicture ? (
              <img src={profilePicture} alt="Current" className="picturePreview" />
            ) : (
              <div className="pictureUploadPlaceholder">
                <span className="uploadIcon">{Icons.Image || "📷"}</span>
                <p>No picture uploaded</p>
              </div>
            )}
          </div>

          {/* File Input */}
          <div className="fileInputContainer">
            <label className="fileInputLabel">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handlePictureChange}
                disabled={uploadingPicture}
              />
              <span className="fileInputText">
                {uploadingPicture ? "Uploading..." : "Choose Image"}
              </span>
            </label>
            <p className="fileInputHint">
              Max size: 5MB | Formats: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* Buttons */}
          <div className="pictureButtonGroup">
            {pictureFile && (
              <button
                className="btn btnPrimary"
                onClick={uploadProfilePicture}
                disabled={uploadingPicture}
              >
                {uploadingPicture ? "Uploading..." : "Upload Picture"}
              </button>
            )}
            {profilePicture && (
              <button
                className="btn btnDanger"
                onClick={deleteProfilePicture}
                disabled={uploadingPicture}
              >
                Delete Picture
              </button>
            )}
            <button
              className="btn btnSecondary"
              onClick={() => closeModal("uploadPictureModal")}
              disabled={uploadingPicture}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal
        isOpen={modalState.profileModal}
        title="Edit Profile Details"
        onClose={handleCancelEdit}
        size="lg"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="row2">
            <InputField
              icon={Icons.User}
              label="Full Name"
              required
              error={profileErrors.fullName}
              value={profile.fullName}
              onChange={onChange}
              placeholder="e.g. John Doe"
              name="fullName"
            />
            <InputField
              icon={Icons.Briefcase}
              label="Title"
              required
              error={profileErrors.title}
              value={profile.title}
              onChange={onChange}
              placeholder="e.g. Full Stack Developer"
              name="title"
            />
          </div>

          <div className="row2">
            <InputField
              icon={Icons.Mail}
              label="Email"
              required
              error={profileErrors.email}
              value={profile.email}
              onChange={onChange}
              placeholder="e.g. john@example.com"
              type="email"
              name="email"
            />
            <InputField
              icon={Icons.Phone}
              label="Phone"
              required={false}
              error={profileErrors.phone}
              value={profile.phone}
              onChange={onChange}
              placeholder="9876543210"
              type="tel"
              name="phone"
            />
          </div>

          <TextAreaField
            icon={Icons.FileText}
            label="Summary"
            required
            error={profileErrors.summary}
            value={profile.summary}
            onChange={onChange}
            placeholder="Brief introduction about yourself"
            rows={3}
          />
          <p className="small">10-500 characters recommended</p>

          <hr className="hr" />

          <div>
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Links</h3>
            <InputField
              icon={Icons.Github}
              label="GitHub"
              required={false}
              error={profileErrors.github}
              value={profile.links.github}
              onChange={onLinkChange}
              placeholder="https://github.com/username"
              type="url"
              name="github"
            />
            <InputField
              icon={Icons.Linkedin}
              label="LinkedIn"
              required={false}
              error={profileErrors.linkedin}
              value={profile.links.linkedin}
              onChange={onLinkChange}
              placeholder="https://linkedin.com/in/username"
              type="url"
              name="linkedin"
            />
            <InputField
              icon={Icons.Globe}
              label="Portfolio"
              required={false}
              error={profileErrors.portfolio}
              value={profile.links.portfolio}
              onChange={onLinkChange}
              placeholder="https://yourportfolio.com"
              type="url"
              name="portfolio"
            />
          </div>

          <div className="profileButtonGroup" style={{ marginTop: 20 }}>
            <button className="btn btnPrimary" onClick={saveProfile}>
              Save Profile
            </button>
            <button className="btn btnSecondary" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Education Modal */}
      <Modal
        isOpen={modalState.educationModal}
        title="Manage Education"
        onClose={() => closeModal("educationModal")}
        size="lg"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="row3">
            <InputField
              icon={Icons.Book}
              label="Degree"
              required
              error={educationErrors.degree}
              value={educationForm.degree}
              onChange={(e) => onEducationChange("degree", e.target.value)}
              placeholder="e.g. Bachelor of Science"
              name="degree"
            />
            <InputField
              icon={Icons.Book}
              label="College/University"
              required
              error={educationErrors.college}
              value={educationForm.college}
              onChange={(e) => onEducationChange("college", e.target.value)}
              placeholder="e.g. MIT"
              name="college"
            />
            <InputField
              icon={Icons.Calendar}
              label="Year"
              required
              error={educationErrors.year}
              value={educationForm.year}
              onChange={(e) => onEducationChange("year", e.target.value)}
              placeholder="e.g. 2024"
              name="year"
            />
          </div>

          <button className="btn btnPrimary btnAddItem" onClick={addEducation}>
            {Icons.Plus || "+"} Add Education
          </button>

          <hr className="hr" />

          <h3 className="modalSectionTitle">Added Education</h3>
          {educationList.length > 0 ? (
            <div className="itemsList">
              {educationList.map((e) => (
                <div className="itemCard" key={e._id || `${e.degree}-${e.college}-${e.year}`}>
                  <div className="itemCardContent">
                    <div className="itemCardHeader">
                      <p className="itemCardTitle">
                        {e.degree}
                      </p>
                      <span className="itemCardBadge">{e.year}</span>
                    </div>
                    <p className="itemCardSubtitle">{e.college}</p>
                  </div>

                  {e._id && (
                    <button
                      className="btn btnDanger btnSmall"
                      onClick={() => deleteEducation(e._id, e.degree, e.college)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <span className="emptyIcon">{Icons.Book || "📖"}</span>
              <p className="emptyMessage">No education added yet</p>
              <p className="emptyHint">Add your degree, college, and graduation year</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Projects Modal */}
      <Modal
        isOpen={modalState.projectModal}
        title="Manage Projects"
        onClose={() => closeModal("projectModal")}
        size="lg"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="row2">
            <InputField
              icon={Icons.Code}
              label="Project Name"
              required
              error={projectErrors.name}
              value={projectForm.name}
              onChange={(e) => onProjectChange("name", e.target.value)}
              placeholder="e.g. Portfolio Website"
              name="name"
            />
            <InputField
              icon={Icons.Link}
              label="Project Link"
              required={false}
              error={projectErrors.link}
              value={projectForm.link}
              onChange={(e) => onProjectChange("link", e.target.value)}
              placeholder="e.g. https://github.com/user/project"
              type="url"
              name="link"
            />
          </div>

          <TextAreaField
            icon={Icons.FileText}
            label="Description"
            required
            error={projectErrors.description}
            value={projectForm.description}
            onChange={(e) => onProjectChange("description", e.target.value)}
            placeholder="Describe your project and what you learned"
            rows={3}
          />

          <InputField
            icon={Icons.Code}
            label="Tech Stack"
            required={false}
            error={projectErrors.techStack}
            value={projectForm.techStack}
            onChange={(e) => onProjectChange("techStack", e.target.value)}
            placeholder="e.g. React, Node.js, MongoDB (comma-separated)"
            name="techStack"
          />

          <button className="btn btnPrimary btnAddItem" onClick={addProject}>
            {Icons.Plus || "+"} Add Project
          </button>

          <hr className="hr" />

          <h3 className="modalSectionTitle">Added Projects</h3>
          {projectsList.length > 0 ? (
            <div className="itemsList">
              {projectsList.map((p) => (
                <div className="itemCard" key={p._id || p.name}>
                  <div className="itemCardContent">
                    <div className="itemCardHeader">
                      <p className="itemCardTitle">{p.name}</p>
                      {p.link && (
                        <a
                          className="itemCardLink"
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          title="Visit Project"
                        >
                          {Icons.ExternalLink || "↗"}
                        </a>
                      )}
                    </div>
                    <p className="itemCardSubtitle">{p.description}</p>
                    {(p.techStack || []).length > 0 && (
                      <div className="techStackList">
                        {(p.techStack || []).map((tech, idx) => (
                          <span key={idx} className="techTag">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {p._id && (
                    <button
                      className="btn btnDanger btnSmall"
                      onClick={() => deleteProject(p._id, p.name)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <span className="emptyIcon">{Icons.Code || "💻"}</span>
              <p className="emptyMessage">No projects added yet</p>
              <p className="emptyHint">Showcase your best work and projects</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Skills Modal */}
      <Modal
        isOpen={modalState.skillModal}
        title="Manage Skills"
        onClose={() => closeModal("skillModal")}
        size="md"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="skillFormContainer">
            <input
              type="text"
              className={`input skillInput ${skillErrors.name ? "hasError" : ""}`}
              value={skillForm.name}
              onChange={(e) => onSkillChange("name", e.target.value)}
              placeholder="Skill name"
            />

            <div className="skillRatingContainer">
              <label className="skillRatingLabel">Rating</label>
              <div className="starRating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`starButton ${
                      star <= skillForm.rating ? "active" : ""
                    }`}
                    onClick={() => onSkillChange("rating", star)}
                    type="button"
                    title={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
                <span className="ratingValue">{skillForm.rating}/5</span>
              </div>
            </div>

            <button className="btn btnAddSkill" onClick={addSkill}>
              Add Skill
            </button>
          </div>

          {skillErrors.name && (
            <p className="errorMessage">{skillErrors.name}</p>
          )}

          <hr className="hr" />

          <h3 style={{ marginTop: 0 }}>Added Skills</h3>
          {skillsList.length > 0 ? (
            <ul className="skillsList">
              {skillsList.map((skill) => (
                <li className="skillItem" key={skill._id || skill.name}>
                  <div className="skillItemContent">
                    <p className="skillItemName">{skill.name}</p>
                    <div className="skillRatingDisplay">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${
                            star <= skill.rating ? "filled" : "empty"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ratingText">{skill.rating}/5</span>
                    </div>
                  </div>

                  {skill._id && (
                    <button
                      className="btn btnDanger"
                      onClick={() => deleteSkill(skill._id, skill.name)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="emptyMessage">No skills added yet</p>
          )}
        </div>
      </Modal>

      {/* NEW APPBAR - Add this */}
      <AppBar profileName={profile.fullName || "Profile Builder"} />

      <div className="container">
        <div className="layout">
          <div className="card previewCard">
            <div className="previewSection">
              <div className="previewHeader">
                <span className="previewIcon">{Icons.User}</span>
                <h3 className="previewTitle">Profile</h3>
                <button className="btn btnManagePreview" onClick={handleEditProfile}>
                  {Icons.Edit} Edit
                </button>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: 12 }}>
                <div style={{ flex: 1 }}>
                  <p className="itemTitle" style={{ margin: 0 }}>
                    {profile.fullName || "Your Name"}
                  </p>
                  <p className="itemMeta" style={{ marginTop: 6 }}>
                    {profile.title || "Your Title"} <br />
                    {profile.email || "you@email.com"}{" "}
                    {profile.phone ? ` • ${profile.phone}` : ""}
                  </p>
                  <p className="itemMeta">
                    {profile.summary || "Your short summary will show here."}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      marginTop: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {profile.links.github && (
                      <a
                        className="link"
                        href={profile.links.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                    )}
                    {profile.links.linkedin && (
                      <a
                        className="link"
                        href={profile.links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                      >
                        LinkedIn
                      </a>
                    )}
                    {profile.links.portfolio && (
                      <a
                        className="link"
                        href={profile.links.portfolio}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>

                <div className="profilePictureContainer">
                  {profilePicture ? (
                    <div className="profilePictureWrapper">
                      <img src={profilePicture} alt={profile.fullName} className="profilePictureImg" />
                      <button 
                        className="btn btnEditPicture" 
                        onClick={openUploadPictureModal}
                      >
                        {Icons.Edit || "📷"}
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btnUploadPicture" 
                      onClick={openUploadPictureModal}
                    >
                      + Upload Picture
                    </button>
                  )}
                </div>
              </div>
            </div>

            <hr className="hr" />

            {/* Education Section - NO PROJECTS */}
            {educationList.length > 0 && (
              <div className="previewSection">
                <div className="previewHeader">
                  <span className="previewIcon">{Icons.Book}</span>
                  <h3 className="previewTitle">Education ({educationList.length})</h3>
                  <button className="btn btnManagePreview" onClick={() => openModal("educationModal")}>
                    {Icons.Edit} Manage
                  </button>
                </div>
                <ul className="previewList">
                  {educationList.map((e) => (
                    <li key={e._id || `${e.degree}-${e.college}`} className="previewItem">
                      <p className="previewItemTitle">{e.degree}</p>
                      <p className="previewItemMeta">{e.college} • {e.year}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Projects Section - WITH COUNT LIKE SKILLS */}
            {projectsList.length > 0 && (
              <div className="previewSection">
                <div className="previewHeaderWithAdd">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <span className="previewIcon">{Icons.Code}</span>
                    <h3 className="previewTitle">Projects ({projectsList.length})</h3>
                  </div>
                  <button className="btn btnManagePreview" onClick={() => openModal("projectModal")}>
                    {Icons.Edit} Manage
                  </button>
                </div>
                <ul className="previewList">
                  {projectsList.map((p) => (
                    <li key={p._id || p.name} className="previewItem">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                        <div style={{ flex: 1 }}>
                          <p className="previewItemTitle" style={{ margin: 0, marginBottom: 4 }}>{p.name}</p>
                          <p className="previewItemMeta">{p.description}</p>
                          {(p.techStack || []).length > 0 && (
                            <div className="techStackPreview">
                              {(p.techStack || []).map((tech, idx) => (
                                <span key={idx} className="techBadge">{tech}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        {p.link && (
                          <a
                            className="projectLink"
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                            title="Visit Project"
                          >
                            {Icons.ExternalLink || "↗"}
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Section */}
            {skillsList.length > 0 && (
              <div className="previewSection">
                <div className="previewHeaderWithAdd">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <span className="previewIcon">{Icons.Zap}</span>
                    <h3 className="previewTitle">Skills ({skillsList.length})</h3>
                  </div>
                  <button className="btn btnManagePreview" onClick={() => openModal("skillModal")}>
                    {Icons.Edit} Manage
                  </button>
                </div>
                <ul className="previewList">
                  {skillsList.map((skill) => (
                    <li key={skill._id || skill.name} className="previewItem">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p className="previewItemTitle" style={{ margin: 0 }}>{skill.name}</p>
                        <div className="skillRatingPreview">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`star ${star <= skill.rating ? "filled" : "empty"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
