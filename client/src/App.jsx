import { useEffect, useState, useContext } from "react";
import "./App.css";
import { ThemeContext } from "./ThemeContext";
import { StatsCard } from "./components/StatsCard";
import { AlertDialog } from "./components/AlertDialog";
import { ErrorMessage } from "./components/ErrorMessage";
import { useValidation } from "./hooks/useValidation";

// Get API base from environment, fallback to /api for local dev
const API_BASE = import.meta.env.VITE_API_BASE || "/api/profile";

const emptyEducation = { degree: "", college: "", year: "" };
const emptyProject = { name: "", description: "", techStack: "", link: "" };

export default function App() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { validateProfile, validateEducation, validateProject } = useValidation();
  const [loading, setLoading] = useState(true);
  const [savingMsg, setSavingMsg] = useState("");

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
    skills: "",
    links: { github: "", linkedin: "", portfolio: "" },
  });

  const [profileErrors, setProfileErrors] = useState({});

  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [educationErrors, setEducationErrors] = useState({});

  const [projectForm, setProjectForm] = useState(emptyProject);
  const [projectErrors, setProjectErrors] = useState({});

  const [educationList, setEducationList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);

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
          skills: (data.skills || []).join(", "),
          links: {
            github: data.links?.github || "",
            linkedin: data.links?.linkedin || "",
            portfolio: data.links?.portfolio || "",
          },
        });

        setEducationList(data.education || []);
        setProjectsList(data.projects || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
        showAlert(
          "Error",
          "Failed to load profile. Please check your connection.",
          "danger"
        );
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

  const showSaveMessage = async (promise) => {
    setSavingMsg("Saving...");
    try {
      const result = await promise;
      setSavingMsg("Saved ✅");
      setTimeout(() => setSavingMsg(""), 1200);
      return result;
    } catch (error) {
      setSavingMsg("Error ❌");
      console.error(error);
      setTimeout(() => setSavingMsg(""), 1200);
      throw error;
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
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
    // Clear error for this field when user starts typing
    if (profileErrors[name]) {
      setProfileErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const onEducationChange = (field, value) => {
    setEducationForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
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
    // Clear error for this field when user starts typing
    if (projectErrors[field]) {
      setProjectErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const saveProfile = () => {
    const errors = validateProfile(profile);

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      showAlert(
        "Validation Error",
        "Please fix the errors in your profile before saving.",
        "warning"
      );
      return;
    }

    showAlert(
      "Save Profile",
      "Are you sure you want to save this profile?",
      "info",
      () => {
        const payload = {
          fullName: profile.fullName.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim(),
          title: profile.title.trim(),
          summary: profile.summary.trim(),
          skills: profile.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          links: {
            github: profile.links.github.trim(),
            linkedin: profile.links.linkedin.trim(),
            portfolio: profile.links.portfolio.trim(),
          },
        };

        showSaveMessage(
          fetch(`${API_BASE}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }).then((res) => res.json())
        );

        closeAlert();
      },
      "Save"
    );
  };

  const addEducation = () => {
    const errors = validateEducation(educationForm);

    if (Object.keys(errors).length > 0) {
      setEducationErrors(errors);
      showAlert(
        "Validation Error",
        "Please fix the errors in education form before adding.",
        "warning"
      );
      return;
    }

    showAlert(
      "Add Education",
      `Add ${educationForm.degree} from ${educationForm.college} (${educationForm.year})?`,
      "info",
      () => {
        showSaveMessage(
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
              return data;
            })
        );
        closeAlert();
      },
      "Add"
    );
  };

  const addProject = () => {
    const errors = validateProject(projectForm);

    if (Object.keys(errors).length > 0) {
      setProjectErrors(errors);
      showAlert(
        "Validation Error",
        "Please fix the errors in project form before adding.",
        "warning"
      );
      return;
    }

    showAlert(
      "Add Project",
      `Add project "${projectForm.name}" to your portfolio?`,
      "info",
      () => {
        const payload = {
          name: projectForm.name.trim(),
          description: projectForm.description.trim(),
          techStack: projectForm.techStack
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          link: projectForm.link.trim(),
        };

        showSaveMessage(
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
              return data;
            })
        );
        closeAlert();
      },
      "Add"
    );
  };

  const deleteEducation = (eduId, degree, college) => {
    showAlert(
      "Delete Education",
      `Are you sure you want to delete "${degree} from ${college}"? This action cannot be undone.`,
      "danger",
      () => {
        showSaveMessage(
          fetch(`${API_BASE}/education/${eduId}`, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then((data) => {
              setEducationList(data.education || []);
              return data;
            })
        );
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
        showSaveMessage(
          fetch(`${API_BASE}/projects/${projectId}`, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then((data) => {
              setProjectsList(data.projects || []);
              return data;
            })
        );
        closeAlert();
      },
      "Delete"
    );
  };

  if (loading) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <div className="container">
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

      <div className="topbar">
        <div className="brand">
          <div className="logo" />
          <div>
            <h1 className="h1">Profile Builder</h1>
          </div>
        </div>
        <button
          className="btn themeToggle"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
        <div className="toast">{savingMsg}</div>
      </div>

      <div className="layout">
        <div className="stack">
          {/* Profile Details Card */}
          <div className="card">
            <div className="cardTitle">
              <h2>Profile Details</h2>
            </div>

            <div className="row2">
              <div>
                <input
                  className={`input ${profileErrors.fullName ? "hasError" : ""}`}
                  name="fullName"
                  value={profile.fullName}
                  onChange={onChange}
                  placeholder="Full Name"
                />
                <ErrorMessage message={profileErrors.fullName} />
              </div>
              <div>
                <input
                  className={`input ${profileErrors.title ? "hasError" : ""}`}
                  name="title"
                  value={profile.title}
                  onChange={onChange}
                  placeholder="Title (e.g. Associate Software Developer)"
                />
                <ErrorMessage message={profileErrors.title} />
              </div>
              <div>
                <input
                  className={`input ${profileErrors.email ? "hasError" : ""}`}
                  name="email"
                  value={profile.email}
                  onChange={onChange}
                  placeholder="Email"
                  type="email"
                />
                <ErrorMessage message={profileErrors.email} />
              </div>
              <div>
                <input
                  className={`input ${profileErrors.phone ? "hasError" : ""}`}
                  name="phone"
                  value={profile.phone}
                  onChange={onChange}
                  placeholder="Phone (optional)"
                  type="tel"
                />
                <ErrorMessage message={profileErrors.phone} />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <textarea
                className={`textarea ${profileErrors.summary ? "hasError" : ""}`}
                name="summary"
                value={profile.summary}
                onChange={onChange}
                placeholder="Summary"
              />
              <ErrorMessage message={profileErrors.summary} />
              <p className="small">Tip: Keep summary 2–3 lines (10-500 characters).</p>
            </div>

            <div style={{ marginTop: 10 }}>
              <input
                className={`input ${profileErrors.skills ? "hasError" : ""}`}
                name="skills"
                value={profile.skills}
                onChange={onChange}
                placeholder="Skills (comma separated) e.g. Java, Node.js, MongoDB"
              />
              <ErrorMessage message={profileErrors.skills} />
            </div>

            <hr className="hr" />

            {/* Links Section */}
            <div className="cardTitle">
              <h2>Links</h2>
            </div>

            <div className="row2">
              <div>
                <input
                  className={`input ${profileErrors.github ? "hasError" : ""}`}
                  name="github"
                  value={profile.links.github}
                  onChange={onLinkChange}
                  placeholder="GitHub URL (optional)"
                  type="url"
                />
                <ErrorMessage message={profileErrors.github} />
              </div>
              <div>
                <input
                  className={`input ${profileErrors.linkedin ? "hasError" : ""}`}
                  name="linkedin"
                  value={profile.links.linkedin}
                  onChange={onLinkChange}
                  placeholder="LinkedIn URL (optional)"
                  type="url"
                />
                <ErrorMessage message={profileErrors.linkedin} />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <input
                className={`input ${profileErrors.portfolio ? "hasError" : ""}`}
                name="portfolio"
                value={profile.links.portfolio}
                onChange={onLinkChange}
                placeholder="Portfolio URL (optional)"
                type="url"
              />
              <ErrorMessage message={profileErrors.portfolio} />
            </div>

            <button
              className="btn btnPrimary"
              onClick={saveProfile}
              style={{ marginTop: 14 }}
            >
              Save Profile
            </button>
          </div>

          {/* Education Card */}
          <div className="card">
            <div className="cardTitle">
              <h2>Education</h2>
            </div>

            <div className="row3">
              <div>
                <input
                  className={`input ${educationErrors.degree ? "hasError" : ""}`}
                  value={educationForm.degree}
                  onChange={(e) => onEducationChange("degree", e.target.value)}
                  placeholder="Degree"
                />
                <ErrorMessage message={educationErrors.degree} />
              </div>
              <div>
                <input
                  className={`input ${educationErrors.college ? "hasError" : ""}`}
                  value={educationForm.college}
                  onChange={(e) => onEducationChange("college", e.target.value)}
                  placeholder="College/University"
                />
                <ErrorMessage message={educationErrors.college} />
              </div>
              <div>
                <input
                  className={`input ${educationErrors.year ? "hasError" : ""}`}
                  value={educationForm.year}
                  onChange={(e) => onEducationChange("year", e.target.value)}
                  placeholder="Year (e.g., 2024)"
                />
                <ErrorMessage message={educationErrors.year} />
              </div>
            </div>

            <button className="btn" onClick={addEducation} style={{ marginTop: 12 }}>
              Add Education
            </button>

            <ul className="list">
              {educationList.map((e) => (
                <li
                  className="item"
                  key={e._id || `${e.degree}-${e.college}-${e.year}`}
                >
                  <div>
                    <p className="itemTitle">
                      {e.degree} — {e.college}
                    </p>
                    <p className="itemMeta">{e.year}</p>
                  </div>

                  {e._id && (
                    <button
                      className="btn btnDanger"
                      onClick={() => deleteEducation(e._id, e.degree, e.college)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="stack">
          {/* Preview Card */}
          <div className="card">
            <div className="cardTitle">
              <h2>Quick Preview</h2>
            </div>

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

            <hr className="hr" />

            <StatsCard 
              educationCount={educationList.length} 
              projectsCount={projectsList.length} 
            />
          </div>

          {/* Projects Card */}
          <div className="card">
            <div className="cardTitle">
              <h2>Projects</h2>
            </div>

            <div className="row2">
              <div>
                <input
                  className={`input ${projectErrors.name ? "hasError" : ""}`}
                  value={projectForm.name}
                  onChange={(e) => onProjectChange("name", e.target.value)}
                  placeholder="Project Name"
                />
                <ErrorMessage message={projectErrors.name} />
              </div>
              <div>
                <input
                  className={`input ${projectErrors.link ? "hasError" : ""}`}
                  value={projectForm.link}
                  onChange={(e) => onProjectChange("link", e.target.value)}
                  placeholder="Project Link (optional)"
                  type="url"
                />
                <ErrorMessage message={projectErrors.link} />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <textarea
                className={`textarea ${projectErrors.description ? "hasError" : ""}`}
                value={projectForm.description}
                onChange={(e) => onProjectChange("description", e.target.value)}
                placeholder="Description"
                style={{ minHeight: "80px" }}
              />
              <ErrorMessage message={projectErrors.description} />
            </div>

            <div style={{ marginTop: 10 }}>
              <input
                className={`input ${projectErrors.techStack ? "hasError" : ""}`}
                value={projectForm.techStack}
                onChange={(e) => onProjectChange("techStack", e.target.value)}
                placeholder="Tech Stack (comma separated) e.g. Node.js, Express, MongoDB"
              />
              <ErrorMessage message={projectErrors.techStack} />
            </div>

            <button className="btn" onClick={addProject} style={{ marginTop: 12 }}>
              Add Project
            </button>

            <ul className="list">
              {projectsList.map((p) => (
                <li className="item" key={p._id || p.name}>
                  <div>
                    <p className="itemTitle">{p.name}</p>
                    <p className="itemMeta">{p.description}</p>
                    <p className="itemMeta">
                      Tech: {(p.techStack || []).join(", ")}
                    </p>
                    {p.link && (
                      <a
                        className="link"
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Link
                      </a>
                    )}
                  </div>

                  {p._id && (
                    <button
                      className="btn btnDanger"
                      onClick={() => deleteProject(p._id, p.name)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
