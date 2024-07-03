import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

import { ChatState } from "../../context/ChatProvider";

const VideoPage = () => {
  const { id } = useParams();
  const { user: loggedUser } = ChatState();
  const roomID = id;
  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = 1976437780;
    const serverSecret = "9608a92458a75361d4a126c9be480844";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      loggedUser?.name
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  };
  return <div className="video-container" ref={myMeeting}></div>;
};

export default VideoPage;
