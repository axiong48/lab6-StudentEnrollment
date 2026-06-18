import { useState } from "react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onLogin(username, password);
  }

  return (
    <div className="app">
      <div className="loginContainer">
        <h1>ACME University</h1>

        <form className="loginBox" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit">Sign in</button>
        </form>

        <div className="loginHelp">
          <p>Student: cnorris / password</p>
          <p>Student: mindy / password</p>
          <p>Teacher: ahepworth / password</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;