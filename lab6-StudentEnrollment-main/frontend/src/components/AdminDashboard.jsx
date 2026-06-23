import { useState, useEffect } from "react";

const API = "http://localhost:3000";

// Default field values when adding a new record for each table
const NEW_TEMPLATES = {
  users:       { username: "", password: "", name: "", role: "student" },
  courses:     { name: "", teacherId: "", teacherName: "", time: "", capacity: 10 },
  enrollments: { studentId: "", courseId: "", grade: "" },
};

function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [data, setData] = useState({ users: [], courses: [], enrollments: [] });
  const [loading, setLoading] = useState(true);

  // Inline-edit state
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Add-new-row state
  const [addingNew, setAddingNew] = useState(false);
  const [newValues, setNewValues] = useState({});

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/users`).then((r) => r.json()),
      fetch(`${API}/courses`).then((r) => r.json()),
      fetch(`${API}/enrollments`).then((r) => r.json()),
    ]).then(([users, courses, enrollments]) => {
      setData({ users, courses, enrollments });
      setLoading(false);
    });
  }, []);

  // ── Edit ──────────────────────────────────────────────────────────────────
  function startEdit(record) {
    setEditingId(record.id);
    setEditValues({ ...record });
    setAddingNew(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({});
  }

  async function saveEdit() {
    const res = await fetch(`${API}/${tab}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editValues),
    });
    const updated = await res.json();
    setData((prev) => ({
      ...prev,
      [tab]: prev[tab].map((r) => (r.id === editingId ? updated : r)),
    }));
    cancelEdit();
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function deleteRecord(id) {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    await fetch(`${API}/${tab}/${id}`, { method: "DELETE" });
    setData((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((r) => r.id !== id),
    }));
  }

  // ── Add new ───────────────────────────────────────────────────────────────
  function startAdd() {
    setAddingNew(true);
    setNewValues({ ...NEW_TEMPLATES[tab] });
    cancelEdit();
  }

  async function saveNew() {
    const res = await fetch(`${API}/${tab}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newValues),
    });
    const created = await res.json();
    setData((prev) => ({
      ...prev,
      [tab]: [...prev[tab], created],
    }));
    setAddingNew(false);
    setNewValues({});
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function switchTab(newTab) {
    setTab(newTab);
    cancelEdit();
    setAddingNew(false);
    setNewValues({});
  }

  // Derive column names dynamically from whatever fields the records have
  const records = data[tab];
  const columns =
    records.length > 0
      ? Object.keys(records[0])
      : Object.keys(NEW_TEMPLATES[tab]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return <p style={{ padding: "1rem" }}>Loading data…</p>;

  return (
    <>
      <div className="tabs">
        {["users", "courses", "enrollments"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => switchTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="blueSection">
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </h2>
          <button
            onClick={startAdd}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Add New
          </button>
        </div>

        <table style={{ width: "100%", tableLayout: "fixed" }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} style={{ wordBreak: "break-all", overflowWrap: "break-word" }}>{col}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* New-record input row */}
            {addingNew && (
              <tr style={{ background: "#fffbcc" }}>
                {columns.map((col) => (
                  <td key={col} style={{ wordBreak: "break-all", overflowWrap: "break-word" }}>
                    {col === "id" ? (
                      <em style={{ color: "#aaa" }}>auto</em>
                    ) : (
                      <input
                        className="gradeInput"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        value={newValues[col] ?? ""}
                        onChange={(e) =>
                          setNewValues((prev) => ({
                            ...prev,
                            [col]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </td>
                ))}
                <td>
                  <button onClick={saveNew} style={{ marginRight: 4 }}>
                    Save
                  </button>
                  <button onClick={() => setAddingNew(false)}>Cancel</button>
                </td>
              </tr>
            )}

            {/* Existing records */}
            {records.map((record) => (
              <tr key={record.id}>
                {columns.map((col) => (
                  <td key={col} style={{ wordBreak: "break-all", overflowWrap: "break-word" }}>
                    {editingId === record.id && col !== "id" ? (
                      <input
                        className="gradeInput"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        value={editValues[col] ?? ""}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            [col]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      String(record[col] ?? "—")
                    )}
                  </td>
                ))}
                <td style={{ whiteSpace: "nowrap" }}>
                  {editingId === record.id ? (
                    <>
                      <button onClick={saveEdit} style={{ marginRight: 4 }}>
                        Save
                      </button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(record)}
                        style={{ marginRight: 4 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRecord(record.id)}
                        style={{ color: "red" }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminDashboard;