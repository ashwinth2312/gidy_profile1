import { useEffect, useState } from "react";
import "./App.css";

const emptyEducation = { degree: "", college: "", year: "" };
const emptyProject = { name: "", description: "", techStack: "", link: "" };

export default function App() {
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

  
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
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
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const onChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onLinkChange = (e) => {
    setProfile((p) => ({
      ...p,
      links: { ...p.links, [e.target.name]: e.target.value },
    }));
  };

  const saveProfile = async () => {
    setSavingMsg("Saving...");

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

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setEducationList(data.education || educationList);
    setProjectsList(data.projects || projectsList);

    setSavingMsg("Saved ✅");
    setTimeout(() => setSavingMsg(""), 1200);
  };

  const addEducation = async () => {
    if (
      !educationForm.degree.trim() ||
      !educationForm.college.trim() ||
      !educationForm.year.trim()
    ) {
      alert("Fill Degree, College, Year first");
      return;
    }

    const res = await fetch("/api/profile/education", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        degree: educationForm.degree.trim(),
        college: educationForm.college.trim(),
        year: educationForm.year.trim(),
      }),
    });

    const data = await res.json();
    setEducationList(data.education || []);
    setEducationForm(emptyEducation);
  };

  const addProject = async () => {
    if (!projectForm.name.trim() || !projectForm.description.trim()) {
      alert("Fill Project Name and Description");
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

    const res = await fetch("/api/profile/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setProjectsList(data.projects || []);
    setProjectForm(emptyProject);
  };

  const deleteEducation = async (eduId) => {
    const res = await fetch(`/api/profile/education/${eduId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    setEducationList(data.education || []);
  };

  const deleteProject = async (projectId) => {
    const res = await fetch(`/api/profile/projects/${projectId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    setProjectsList(data.projects || []);
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
        <div className="toast">{savingMsg}</div>
      </div>

      
      <div className="layout">
        
        <div className="stack">
        
          <div className="card">
            <div className="cardTitle">
              <h2>Profile Details</h2>
              <span className="badge">GET + PUT</span>
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
              />
              <input
                className="input"
                name="phone"
                value={profile.phone}
                onChange={onChange}
                placeholder="Phone"
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

            <div className="cardTitle">
              <h2>Links</h2>
              <span className="badge">github / linkedin</span>
            </div>

            <div className="row2">
              <input
                className="input"
                name="github"
                value={profile.links.github}
                onChange={onLinkChange}
                placeholder="GitHub URL"
              />
              <input
                className="input"
                name="linkedin"
                value={profile.links.linkedin}
                onChange={onLinkChange}
                placeholder="LinkedIn URL"
              />
            </div>

            <input
              className="input"
              name="portfolio"
              value={profile.links.portfolio}
              onChange={onLinkChange}
              placeholder="Portfolio URL (optional)"
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

        
          <div className="card">
            <div className="cardTitle">
              <h2>Education</h2>
              <span className="badge">ADD + DELETE</span>
            </div>

            <div className="row3">
              <input
                className="input"
                value={educationForm.degree}
                onChange={(e) =>
                  setEducationForm((x) => ({ ...x, degree: e.target.value }))
                }
                placeholder="Degree"
              />
              <input
                className="input"
                value={educationForm.college}
                onChange={(e) =>
                  setEducationForm((x) => ({ ...x, college: e.target.value }))
                }
                placeholder="College"
              />
              <input
                className="input"
                value={educationForm.year}
                onChange={(e) =>
                  setEducationForm((x) => ({ ...x, year: e.target.value }))
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
        
          <div className="card">
            <div className="cardTitle">
              <h2>Quick Preview</h2>
              <span className="badge">UI only</span>
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
            <p className="small">Education items: {educationList.length}</p>
            <p className="small">Projects items: {projectsList.length}</p>
          </div>

        
          <div className="card">
            <div className="cardTitle">
              <h2>Projects</h2>
              <span className="badge">ADD + DELETE</span>
            </div>

            <div className="row2">
              <input
                className="input"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm((x) => ({ ...x, name: e.target.value }))
                }
                placeholder="Project Name"
              />
              <input
                className="input"
                value={projectForm.link}
                onChange={(e) =>
                  setProjectForm((x) => ({ ...x, link: e.target.value }))
                }
                placeholder="Project Link (optional)"
              />
            </div>

            <input
              className="input"
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm((x) => ({ ...x, description: e.target.value }))
              }
              placeholder="Description"
              style={{ marginTop: 10 }}
            />

            <input
              className="input"
              value={projectForm.techStack}
              onChange={(e) =>
                setProjectForm((x) => ({ ...x, techStack: e.target.value }))
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
                    {p.link ? (
                      <a
                        className="link"
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Link
                      </a>
                    ) : null}
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
