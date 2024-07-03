import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import "./VideoHome.css";

const VideoHome = () => {
  const { user: loggedUser } = ChatState();
  const navigate = useNavigate();
  console.log(loggedUser);

  const joinRoom = () => {
    try {
      if (loggedUser && loggedUser?._id) {
        console.log("Navigating to room");
        navigate(`/room/${loggedUser._id}`);
      } else {
        console.error("Logged user or user ID is not defined");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="video-home-container">
        <div className="join-room">
          <div className="box">
            <h2>Start a meeting?</h2>
            <p>
              Join Meet as: <span className="name">{loggedUser?.name}</span>{" "}
              Click on 'Start Meet' to start a meeting. You can share the
              meeting link with other users to let them join the meeting.
            </p>
            <button onClick={() => joinRoom()}>Start Meeting</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoHome;
