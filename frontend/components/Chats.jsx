import ChatEntry from "./ChatEntry";

export default function Chats(props) {
  const { chats } = props;

  return (
    <>
      <div className="chats-main">
        <div className="chats-container">
          {chats.map((chat) => {
            <ChatEntry
              chatname={chat.name}
              lastmessage={chat.messages[messages.length - 1]}
              updatedat={chat.updatedAt}
              profilepicture={
                chat.messages[messages.length - 1].user.profilepicture
              }
            />;
          })}
        </div>
      </div>
    </>
  );
}
