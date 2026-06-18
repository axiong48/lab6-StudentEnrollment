import { useState } from "react";
import CoursesTable from "./CourseTable";
import { initialCourses } from "./MockData";

function StudentDashboard({ user }) {
  const [page, setPage] = useState("yourCourses");
  const [courses, setCourses] = useState(initialCourses);

  const startingCourses = user.name === "Chuck" ? [1, 2] : [];
  const [studentCourses, setStudentCourses] = useState(startingCourses);

  function addCourse(courseId) {
    const course = courses.find((course) => course.id === courseId);

    if (course.enrolled >= course.capacity) {
      alert("This class is full.");
      return;
    }

    if (studentCourses.includes(courseId)) {
      alert("You are already enrolled in this class.");
      return;
    }

    setStudentCourses([...studentCourses, courseId]);

    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? { ...course, enrolled: course.enrolled + 1 }
          : course
      )
    );
  }

  const myCourses = courses.filter((course) =>
    studentCourses.includes(course.id)
  );

  return (
    <>
      <div className="tabs">
        <button
          className={page === "yourCourses" ? "active" : ""}
          onClick={() => setPage("yourCourses")}
        >
          Your Courses
        </button>

        <button
          className={page === "addCourses" ? "active" : ""}
          onClick={() => setPage("addCourses")}
        >
          Add Courses
        </button>
      </div>

      <div className="blueSection">
        {page === "yourCourses" && <CoursesTable courses={myCourses} />}

        {page === "addCourses" && (
          <CoursesTable
            courses={courses}
            showAddButton={true}
            studentCourses={studentCourses}
            onAddCourse={addCourse}
          />
        )}
      </div>
    </>
  );
}

export default StudentDashboard;
