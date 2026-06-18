function Header({ user, onLogout }) {
  return (
    <div className="header">
      <p>Welcome {user.name}!</p>
      <h1>ACME University</h1>
      <button onClick={onLogout}>Sign out</button>
    </div>
  );
}

export default Header;
