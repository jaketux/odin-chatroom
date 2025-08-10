export default function ChatEntry(props) {
  const { chatname, lastmessage, updatedat, profilepicture } = props;

  let reducedMessage = lastmessage;

  //visual display of chats - need to test if this works once data is fetched

  if (lastmessage.length > 35) {
    reducedMessage = lastmessage.slice(0, 35) + "...";
  }

  let currentTime = new Date();
  let updatedTime = updatedat;

  let timePassed = (currentTime.getTime() - updatedTime.getTime()) / 1000;

  let shownDate;

  if (timePassed > 86400) {
    shownDate = updatedTime.toLocaleDateString("en-AU").slice(0, 2);
  } else {
    shownDate = updatedTime.toLocaleTimeString("en-AU");
  }

  //

  return (
    <>
      <div className="chat-entry">
        <div className="entry-left-side"></div>
        <img
          src={profilepicture}
          alt="Users profile picture"
          className="message-profile-pic"
        />
        <div className="entry-right-side">
          <div className="entry-right-top">{chatname}</div>
          <div className="entry-right-bottom">
            {reducedMessage}
            {shownDate}
          </div>
        </div>
      </div>
    </>
  );
}
