export default function Header(props) {
  return (
    <header className="header">
      <div className="header-nav-left"></div>
      <div className="header-main">
        <h1>T-Chat</h1>
      </div>
      {props.loggedIn ? (
        <div className="header-nav-right">
          <h2>Logout</h2>
        </div>
      ) : (
        <div className="header-nav-right">
          <h2>Login</h2>
        </div>
      )}
    </header>
  );
}
