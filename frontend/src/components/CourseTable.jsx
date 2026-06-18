function CoursesTable({
  courses,
  showAddButton,
  studentCourses,
  onAddCourse,
  teacherMode,
  onSelectCourse,
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Teacher</th>
          <th>Time</th>
          <th>Students Enrolled</th>
          {showAddButton && <th>Add class</th>}
        </tr>
      </thead>

      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>
              {teacherMode ? (
                <button
                  className="courseLink"
                  onClick={() => onSelectCourse(course)}
                >
                  {course.courseName}
                </button>
              ) : (
                course.courseName
              )}
            </td>

            <td>{course.teacher}</td>
            <td>{course.time}</td>
            <td>
              {course.enrolled}/{course.capacity}
            </td>

            {showAddButton && (
              <td>
                {studentCourses.includes(course.id) ||
                course.enrolled >= course.capacity ? (
                  <span className="minus">—</span>
                ) : (
                  <button
                    className="plusButton"
                    onClick={() => onAddCourse(course.id)}
                  >
                    +
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CoursesTable;
