import { useState, useEffect } from "react";

function GradePage({ course, onBack }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get all enrollments for this course
    fetch(`http://localhost:3000/enrollments?courseId=${course.id}`)
      .then((r) => r.json())
      .then(async (enrollments) => {
        // 2. For each enrollment, fetch the matching student's name
        const withNames = await Promise.all(
          enrollments.map(async (enrollment) => {
            const sRes = await fetch(
              `http://localhost:3000/users/${enrollment.studentId}`
            );
            const student = await sRes.json();
            return { ...enrollment, studentName: student.name };
          })
        );
        setStudents(withNames);
        setLoading(false);
      });
  }, [course.id]);

  function updateGrade(enrollmentId, newGrade) {
    // Update local state immediately so the input feels responsive
    setStudents((prev) =>
      prev.map((s) =>
        s.id === enrollmentId ? { ...s, grade: newGrade } : s
      )
    );

    // Persist the change to json-server
    fetch(`http://localhost:3000/enrollments/${enrollmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grade: newGrade === "" ? null : Number(newGrade),
      }),
    });
  }

  if (loading) return <p style={{ padding: "1rem" }}>Loading students…</p>;

  return (
    <div className="blueSection">
      <button className="backButton" onClick={onBack}>
        ←
      </button>

      <h2>{course.name}</h2>

      <table className="gradeTable">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.studentName}</td>
              <td>
                <input
                  className="gradeInput"
                  type="number"
                  value={student.grade ?? ""}
                  onChange={(e) => updateGrade(student.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GradePage;
