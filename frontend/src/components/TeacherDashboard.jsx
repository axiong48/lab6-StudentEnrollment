import { useState } from "react";
import CoursesTable from "./CourseTable";
import GradePage from "./GradePage";
import { initialCourses, initialStudents } from "./MockData";

function TeacherDashboard() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState(initialStudents);

  const teacherCourses = initialCourses.filter(
    (course) => course.teacher === "Ammon Hepworth"
  );

  function updateGrade(studentId, newGrade) {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, grade: newGrade } : student
      )
    );
  }

  if (selectedCourse) {
    return (
      <GradePage
        course={selectedCourse}
        students={students}
        onBack={() => setSelectedCourse(null)}
        onUpdateGrade={updateGrade}
      />
    );
  }

  return (
    <>
      <div className="tabs">
        <button className="active">Your Courses</button>
      </div>

      <div className="blueSection">
        <CoursesTable
          courses={teacherCourses}
          teacherMode={true}
          onSelectCourse={setSelectedCourse}
        />
      </div>
    </>
  );
}

export default TeacherDashboard;
