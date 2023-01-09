import "./App.css";
import io from "socket.io-client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
const socket = io.connect("http://localhost:9000");

function App() {
  const [input, setInput] = useState("");
  const [user, setUser] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState([]);
  const [username, setUserName] = useState([]);
  const [allValue, setAllValue] = useState([]);
  const [isEmojiVisible, setEmojiVisible] = useState(false);
  // const [id, setId] = useState(0);

  useMemo(() => {
    socket.on("received", (data) => {
      setReceivedMessage((prev) => [...prev, data.input]);
      setUserName((prev) => [...prev, data.user]);
      // setId(id+1)
      const id = uuidv4(); // Generates a new UUID
      function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      const randomColor = getRandomColor();

      console.log(id);
      const datas = {
        id: id,
        user: data.user,
        message: data.input,
        likes: 0,
        bg: randomColor,
      };
      setAllValue((prev) => [...prev, datas]);
    });
  }, [socket]);

  useEffect(() => {
    const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];
    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
      setUser(array);
      return;
    }

    shuffle(user_list);
  }, [receivedMessage]);

  function sendMessage(e) {
    e.preventDefault();
    socket.emit("message", {
      input: input,
      user: user[0],
    });
    setInput("");
  }

  const increase = useCallback(
    (id) => {
      // e.preventDefault()
      // setCount(prev => prev+1)
      console.log(id);
      const item = allValue.find((item) => item.id === id);
      console.log(item);
      console.log(item.likes);
      item.likes += 1;
      console.log(item.likes);

      // item.likes++;
      setAllValue((prev) => [...prev]);
    },
    [allValue]
  );
  console.log(allValue);
  // const inputs = document.getElementById('my-input');
  // inputs.addEventListener('focus', () => EmojiPicker.show(inputs));
  return (
    <div className="App">
      <div className="navbar">
        <h3>Introduction</h3>
        <p>This channel is for company wide chatter</p>
        <span className="number__of__people">3|100</span>
      </div>
      <hr />
      <div className="chatbox">
        {allValue.map((value, index) => (
          <div key={index} className="user__message">
            <span
              className="profile"
              style={{
                backgroundColor: value.bg,
              }}
            >
              {value.user[0]}
              {value.user[1]}
            </span>
            <span style={{ fontSize: 20, fontWeight: 900 }}>{value.user}</span>
            <div className="message">
              {value.message}
              <button
                onClick={() => increase(value.id)}
                className="like__button"
              >
                like
              </button>
              <span className="display__likes">{value.likes}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="inputbox">
        <form>
          <div className={isEmojiVisible ? "block" : "none"}>
            <Picker
              data={data}
              previewPosition="none"
              onEmojiSelect={(e) => {
                setInput((prev) => prev + e.native);
                setEmojiVisible(!isEmojiVisible);
              }}
            />
          </div>
          <input
            className="input"
            placeholder="Type message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <img
            src={require("./images/emoji-icon.png")}
            alt="emoji"
            onClick={() => setEmojiVisible(!isEmojiVisible)}
            className="emoji"
          />
          <input
            type="submit"
            className="submit__button"
            onClick={sendMessage}
          />

        </form>
      </div>
    </div>
  );
}

export default App;
