import { useState, useEffect } from "react";
import CoursesTable from "./CourseTable";
import GradePage from "./GradePage";

function TeacherDashboard({ user }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3000/courses?teacherId=${user.id}`).then((r) => r.json()),
      fetch("http://localhost:3000/enrollments").then((r) => r.json()),
    ]).then(([coursesData, enrollmentsData]) => {
      setCourses(coursesData);
      setEnrollments(enrollmentsData);
      setLoading(false);
    });
  }, [user.id]);

  // Attach live enrollment count to each course for display
  const coursesWithEnrolled = courses.map((course) => ({
    ...course,
    enrolled: enrollments.filter((e) => e.courseId === course.id).length,
  }));

  if (loading) return <p style={{ padding: "1rem" }}>Loading courses…</p>;

  if (selectedCourse) {
    return (
      <GradePage
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
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
          courses={coursesWithEnrolled}
          teacherMode={true}
          onSelectCourse={setSelectedCourse}
        />
      </div>
    </>
  );
}

export default TeacherDashboard;
