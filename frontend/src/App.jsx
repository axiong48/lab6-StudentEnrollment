import { useState } from "react";
import "./App.css";

import LoginPage from "./components/Login";
import Header from "./components/Header";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

function App() {
  const [user, setUser] = useState(null);

  function handleLogin(username, password) {
    if (username === "cnorris" && password === "password") {
      setUser({
        name: "Chuck",
        role: "student",
      });
    } else if (username === "mindy" && password === "password") {
      setUser({
        name: "Mindy",
        role: "student",
      });
    } else if (username === "ahepworth" && password === "password") {
      setUser({
        name: "Dr Hepworth",
        role: "teacher",
      });
    } else {
      alert("Invalid username or password");
    }
  }

  function handleLogout() {
    setUser(null);
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <div className="container">
        <Header user={user} onLogout={handleLogout} />

        {user.role === "student" && <StudentDashboard user={user} />}

        {user.role === "teacher" && <TeacherDashboard />}
      </div>
    </div>
  );
}

export default App;
