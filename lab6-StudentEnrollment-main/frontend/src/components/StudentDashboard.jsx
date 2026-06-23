import { useState, useEffect } from "react";
import CoursesTable from "./CourseTable";

function StudentDashboard({ user }) {
  const [page, setPage] = useState("yourCourses");
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all courses and all enrollments once on mount
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/courses").then((r) => r.json()),
      fetch("http://localhost:3000/enrollments").then((r) => r.json()),
    ]).then(([coursesData, enrollmentsData]) => {
      setCourses(coursesData);
      setEnrollments(enrollmentsData);
      setLoading(false);
    });
  }, [user.id]);

  // Compute live enrollment count for every course
  const coursesWithEnrolled = courses.map((course) => ({
    ...course,
    enrolled: enrollments.filter((e) => e.courseId === course.id).length,
  }));

  // Course IDs this student is enrolled in
  const studentCourseIds = enrollments
    .filter((e) => e.studentId === user.id)
    .map((e) => e.courseId);

  const myCourses = coursesWithEnrolled.filter((c) =>
    studentCourseIds.includes(c.id)
  );

  async function addCourse(courseId) {
    const course = coursesWithEnrolled.find((c) => c.id === courseId);

    if (course.enrolled >= course.capacity) {
      alert("This class is full.");
      return;
    }
    if (studentCourseIds.includes(courseId)) {
      alert("You are already enrolled in this class.");
      return;
    }

    const res = await fetch("http://localhost:3000/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: user.id, courseId, grade: null }),
    });
    const newEnrollment = await res.json();
    // Update local state so the UI reflects the new enrollment immediately
    setEnrollments((prev) => [...prev, newEnrollment]);
  }

  if (loading) return <p style={{ padding: "1rem" }}>Loading courses…</p>;

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
            courses={coursesWithEnrolled}
            showAddButton={true}
            studentCourseIds={studentCourseIds}
            onAddCourse={addCourse}
          />
        )}
      </div>
    </>
  );
}

export default StudentDashboard;
