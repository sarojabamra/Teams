import React, { useState } from "react";
import { FaPen, FaPollH } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlinePersonSearch } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { ChatState } from "../../../context/ChatProvider";
import { API } from "../../../service/api";

const PollModal = ({ visible, onClose }) => {
  const [error, setError] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const { selectedChat, user: loggedUser } = ChatState();
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");

  const createPoll = () => {
    try {
      const response = API.createPoll({
        question: pollQuestion,
        options: [option1, option2, option3, option4],
        chatId: selectedChat._id,
      });
      if (response.isSuccess) {
        onClose();
      }
    } catch (error) {}
  };

  if (!visible) return null;

  return (
    <div>
      <div className="create-team">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="closediv">
              <IoClose className="close-icon" onClick={onClose} />
            </div>
            <div className="create-title">
              <RiTeamFill className="team-icon" />
              <h2>Create a Poll!</h2>
            </div>
            <p className="email">
              Please give your team a name and use the search bar below to add
              members to your team. Then, click on 'Create Team' to proceed.
            </p>

            <form>
              <div className="input-container">
                <FaPen />
                <input
                  type="text"
                  placeholder="Give a title/question to your Poll..."
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  required
                />
              </div>
              <div className="input-container">
                <FaPollH className="search-icon" />
                <input
                  type="text"
                  placeholder="Option 1..."
                  onChange={(e) => setOption1(e.target.value)}
                />
              </div>
              <div className="input-container">
                <FaPollH className="search-icon" />
                <input
                  type="text"
                  placeholder="Option 2..."
                  onChange={(e) => setOption2(e.target.value)}
                />
              </div>
              <div className="input-container">
                <FaPollH className="search-icon" />
                <input
                  type="text"
                  placeholder="Option 3..."
                  onChange={(e) => setOption3(e.target.value)}
                />
              </div>
              <div className="input-container">
                <FaPollH className="search-icon" />
                <input
                  type="text"
                  placeholder="Option 4..."
                  onChange={(e) => setOption4(e.target.value)}
                />
              </div>

              <button type="submit" onClick={() => createPoll()}>
                Create Poll
              </button>
              <p className="error">{error}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollModal;
