import { useState } from "react";
import "./App.css";

import LoginPage from "./components/Login";
import Header from "./components/Header";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [user, setUser] = useState(null);

  function handleLogin(username, password) {
    fetch(`http://localhost:3000/users?username=${username}&password=${password}`)
      .then((res) => res.json())
      .then((matchedUsers) => {
        if (matchedUsers.length > 0) {
          setUser(matchedUsers[0]);
        } else {
          alert("Invalid username or password");
        }
      })
      .catch(() => {
        alert("Could not connect to the backend server. Make sure json-server is running on port 3000!");
      });
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
        {user.role === "student"  && <StudentDashboard user={user} />}
        {user.role === "teacher"  && <TeacherDashboard user={user} />}
        {user.role === "admin"    && <AdminDashboard />}
      </div>
    </div>
  );
}

export default App;
