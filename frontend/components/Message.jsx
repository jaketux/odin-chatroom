export default function Message(props) {
  const { user, content, dateTime, currentUser } = props;

  return (
    <>
      {user.id !== currentUser.id && (
        <div className="message">
          <div className="message-left">
            <img
              src={user.profilepicture}
              alt="Users profile picture"
              className="message-profile-pic"
            />
          </div>
          <div className="message-right">
            <div className="message-right-top">
              <div className="message-user">{user.firstname}</div>
              <div className="message-time">{dateTime}</div>
            </div>
            <div className="message-right-bottom">
              <div className="message-content">{content}</div>
            </div>
          </div>
        </div>
      )}
      {user.id === currentUser.id && (
        <div className="message-user">
          <div className="message-user-top">
            <div className="message-user">{user.firstname}</div>
            <div className="message-time-user">{dateTime}</div>
          </div>
          <div className="message-user-bottom">
            <div className="message-content-user">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}
