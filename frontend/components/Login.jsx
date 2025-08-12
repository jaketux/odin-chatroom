export default function Login(props) {
  const { setLoggedIn, setCurrentError, setErrorInView, setUser } = props;

  function handleLogin(formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    fetch("https://odin-chatroom-production.up.railway.app/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username: username, password: password }),
    }).then(async (res) => {
      const data = await res.json;
      if (!res.ok) {
        setCurrentError(true);
        setErrorInView(data.error);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userstring", JSON.stringify(data.user));
      setUser(data.user);
      setLoggedIn((prevLoggedIn) => !prevLoggedIn);
      setErrorInView(null);
      setCurrentError(null);
    });
  }

  return (
    <>
      <h1>Login</h1>
      <form action={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input type="text" name="username" id="username" />
        <label htmlFor="password">Password:</label>
        <input type="text" name="password" id="password" />
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </>
  );
}
