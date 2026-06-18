function GradePage({ course, students, onBack, onUpdateGrade }) {
  return (
    <div className="blueSection">
      <button className="backButton" onClick={onBack}>
        ←
      </button>

      <h2>{course.courseName}</h2>

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
              <td>{student.name}</td>
              <td>
                <input
                  className="gradeInput"
                  type="number"
                  value={student.grade}
                  onChange={(event) =>
                    onUpdateGrade(student.id, event.target.value)
                  }
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
