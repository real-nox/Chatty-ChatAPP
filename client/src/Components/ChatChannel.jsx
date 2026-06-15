import { Check, CheckCheck, EllipsisVertical, PhoneCallIcon, Send, TextAlignJustify, VideoIcon } from "lucide-react";
import { formatedDateMsg, SanitizeInput } from "../utils/Utils";
import EmojiPicker from "emoji-picker-react";

export default function ChatChannel({ currentfriend, loading, messageList, messagesEndRef, friendisTyping, input, Typing, submitMessage, userId, setInput }) {
  return (
    <div className={`RightSection ${!currentfriend.id ? "Empty" : ""}`}>
      <div className="TopBarUser">
        <div className="User">
            <TextAlignJustify />
          <p>
            {currentfriend?.display_name} - {currentfriend?.username}
          </p>
        </div>
        <div className="Options">
          <PhoneCallIcon />
          <VideoIcon />
          <EllipsisVertical />
        </div>
      </div>
      <div className="Messages">
        {loading ? (
          <>
            <div className="ChatBubble skel"></div>
            <div className="ChatBubble own skel"></div>
            <div className="ChatBubble skel"></div>
            <div className="ChatBubble own skel"></div>
          </>
        ) : messageList ? (
          <>
            {messageList.map((msg) => (
              <div
                className={`ChatBubble ${msg.sender_id == userId ? "own" : ""} ${msg.seen ? "seen" : ""}`}
                key={msg.id}
              >
                <div className="Message">{msg.content}</div>
                <div className="Date">
                  <p>{formatedDateMsg(msg.created_at)} </p>
                  {msg.seen ? <CheckCheck /> : <Check />}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <p className="startConv">Start conversation!</p>
        )}
      </div>

      <div className="Bar">
        {friendisTyping.ongoing && (
          <p>
            {currentfriend.display_name}{" "}
            {`Writing
              ${".".repeat(friendisTyping.dots)}`}
          </p>
        )}
      </div>
      <div className="Chat">
        <div className="Chatbar">
          <input
            value={input}
            onInput={Typing}
            onChange={(ev) => {
              setInput(SanitizeInput(ev.target.value));
            }}
            onKeyDown={(ev) => ev.key === "Enter" && submitMessage()}
            type="text"
            name="chat"
            id="chat"
            placeholder="Type a message..."
          />
          <EmojiPicker
            style={{
              display: "none",
              position: "absolute",
              top: "45%",
              right: "1.5%",
            }}
            theme={"dark"}
            onEmojiClick={(EmojiObject) => {
              let emoji = EmojiObject.emoji;
              Typing();
              setInput((prev) => {
                return prev + emoji;
              });
            }}
          />
          <button
            type="button"
            id="emojiToggle"
            style={{
              backgroundColor: "transparent",
              border: "0",
              fontSize: "1.2rem",
            }}
            onClick={(ev) => {
              let picker = document.querySelector(".EmojiPickerReact");

              picker.style.display =
                picker.style.display == "none" ? "block" : "none";
            }}
          >
            😊
          </button>
          <Send onClick={() => submitMessage()} style={{ cursor: "pointer" }} />
        </div>
      </div>
      <script
        type="module"
        src="https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js"
      ></script>
    </div>
  );
}
