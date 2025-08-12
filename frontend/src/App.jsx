import { useState, useEffect } from "react";
import "./App.css";
import Header from "../components/Header";
import Message from "../components/Message";
import ProfileIcon from "../src/assets/user.png";
import Chats from "../components/Chats";
import Login from "../components/Login";

function App() {
  const [count, setCount] = useState(0);

  const [loggedIn, setLoggedIn] = useState(false);

  const [currentError, setCurrentError] = useState(false);

  const [errorInView, setErrorInView] = useState(null);

  const [user, setUser] = useState(null);

  const testUser = {
    id: 1,
    firstname: "Johnson",
    profilepicture: ProfileIcon,
  };

  const testUser2 = {
    id: 2,
    firstname: "Jake",
    profilepicture: ProfileIcon,
  };

  return (
    <>
      <Header />
      {!loggedIn && (
        <Login
          setLoggedIn={setLoggedIn}
          setCurrentError={setCurrentError}
          setErrorInView={setErrorInView}
          setUser={setUser}
        />
      )}
      <Message
        user={testUser}
        content={
          "Yes this is the test msg for current userawdwadawdawddwawdwadawdawddwawdwadawdawddwawdwadawdawddwawdwadawdawddwawdwadawdawddw."
        }
        dateTime={"24/06/2025 10:42am"}
        currentUser={testUser}
      />
      <Message
        user={testUser2}
        content={
          "Yes this is the test message for non-current userawdwadawdawddwawdwadawdawddwawdwadawdawddwawdwadawdawddwawdwadawdawddwawdwadawdawddw"
        }
        dateTime={"24/06/2025 10:42am"}
        currentUser={testUser}
      />
      {/* <Chats /> */}
    </>
  );
}

export default App;
