import { useEffect, useState, useContext } from "react";
import "./App.css";
import { ThemeContext } from "./ThemeContext";
import { StatsCard } from "./components/StatsCard";

const emptyEducation = { degree: "", college: "", year: "" };
const emptyProject = { name: "", description: "", techStack: "", link: "" };

const API_BASE = "/api/profile";

export default function App() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [savingMsg, setSavingMsg] = useState("");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    title: "",
    summary: "",
    skills: "",
    links: { github: "", linkedin: "", portfolio: "" },
  });

  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [educationList, setEducationList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);

  // Fetch initial profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(API_BASE);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
  };

  const onLinkChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      links: { ...prev.links, [name]: value },
    }));
  };

  const saveProfile = () => {
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
      fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((res) => res.json())
    );
  };

  const addEducation = () => {
    if (
      !educationForm.degree.trim() ||
      !educationForm.college.trim() ||
      !educationForm.year.trim()
    ) {
      alert("Please fill in Degree, College, and Year");
      return;
    }

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
          return data;
        })
    );
  };

  const addProject = () => {
    if (!projectForm.name.trim() || !projectForm.description.trim()) {
      alert("Please fill in Project Name and Description");
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
          return data;
        })
    );
  };

  const deleteEducation = (eduId) => {
    if (!window.confirm("Are you sure you want to delete this education?")) return;

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
  };

  const deleteProject = (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

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
  };

  if (loading) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <div className="container">
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
              <input
                className="input"
                name="fullName"
                value={profile.fullName}
                onChange={onChange}
                placeholder="Full Name"
              />
              <input
                className="input"
                name="title"
                value={profile.title}
                onChange={onChange}
                placeholder="Title (e.g. Associate Software Developer)"
              />
              <input
                className="input"
                name="email"
                value={profile.email}
                onChange={onChange}
                placeholder="Email"
                type="email"
              />
              <input
                className="input"
                name="phone"
                value={profile.phone}
                onChange={onChange}
                placeholder="Phone"
                type="tel"
              />
            </div>

            <div style={{ marginTop: 10 }}>
              <textarea
                className="textarea"
                name="summary"
                value={profile.summary}
                onChange={onChange}
                placeholder="Summary"
              />
              <p className="small">Tip: Keep summary 2–3 lines.</p>
            </div>

            <input
              className="input"
              name="skills"
              value={profile.skills}
              onChange={onChange}
              placeholder="Skills (comma separated) e.g. Java, Node.js, MongoDB"
              style={{ marginTop: 10 }}
            />

            <hr className="hr" />

            {/* Links Section */}
            <div className="cardTitle">
              <h2>Links</h2>
            </div>

            <div className="row2">
              <input
                className="input"
                name="github"
                value={profile.links.github}
                onChange={onLinkChange}
                placeholder="GitHub URL"
                type="url"
              />
              <input
                className="input"
                name="linkedin"
                value={profile.links.linkedin}
                onChange={onLinkChange}
                placeholder="LinkedIn URL"
                type="url"
              />
            </div>

            <input
              className="input"
              name="portfolio"
              value={profile.links.portfolio}
              onChange={onLinkChange}
              placeholder="Portfolio URL (optional)"
              type="url"
              style={{ marginTop: 10 }}
            />

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
              <input
                className="input"
                value={educationForm.degree}
                onChange={(e) =>
                  setEducationForm((prev) => ({ ...prev, degree: e.target.value }))
                }
                placeholder="Degree"
              />
              <input
                className="input"
                value={educationForm.college}
                onChange={(e) =>
                  setEducationForm((prev) => ({ ...prev, college: e.target.value }))
                }
                placeholder="College"
              />
              <input
                className="input"
                value={educationForm.year}
                onChange={(e) =>
                  setEducationForm((prev) => ({ ...prev, year: e.target.value }))
                }
                placeholder="Year"
              />
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
                      onClick={() => deleteEducation(e._id)}
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
              <input
                className="input"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Project Name"
              />
              <input
                className="input"
                value={projectForm.link}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="Project Link (optional)"
                type="url"
              />
            </div>

            <input
              className="input"
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Description"
              style={{ marginTop: 10 }}
            />

            <input
              className="input"
              value={projectForm.techStack}
              onChange={(e) =>
                setProjectForm((prev) => ({ ...prev, techStack: e.target.value }))
              }
              placeholder="Tech Stack (comma separated) e.g. Node.js, Express, MongoDB"
              style={{ marginTop: 10 }}
            />

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
                      onClick={() => deleteProject(p._id)}
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
