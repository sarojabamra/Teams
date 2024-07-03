import React, { useEffect, useState } from "react";
import "./UserModal.css";
import { IoClose } from "react-icons/io5";
import {
  FaIdCard,
  FaPen,
  FaPenAlt,
  FaStar,
  FaUserCircle,
  FaUserTie,
} from "react-icons/fa";
import { MdAttachEmail, MdDelete, MdOutlineTaskAlt } from "react-icons/md";
import {
  getSenderImage,
  getSender,
  getSenderUsername,
  getSenderEmail,
  getSenderProfession,
  getSenderId,
} from "../../../utils/ChatLogic";
import { ChatState } from "../../../context/ChatProvider";
import { FaNoteSticky } from "react-icons/fa6";
import { API } from "../../../service/api";

const UserModal = ({ visible, onClose, selectedChat }) => {
  const { user: loggedUser } = ChatState();
  const [activePage, setActivePage] = useState("profile");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);

  const url = getSenderImage(loggedUser, selectedChat?.users)
    ? getSenderImage(loggedUser, selectedChat.users)
    : "../../../images/profile-photo.jpg";

  console.log();

  const assignTask = async () => {
    try {
      const response = await API.assignTask({
        byUser: loggedUser,
        toUser: getSenderId(loggedUser, selectedChat?.users),
        title: taskTitle,
        description: taskDescription,
      });
      if (response.isSuccess) {
        setTaskTitle("");
        setTaskDescription("");
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTasksByUser = async () => {
    try {
      const response = await API.getTasksforUser(
        getSenderId(loggedUser, selectedChat?.users)
      );
      if (response.isSuccess) {
        setTasks(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markImportant = async (todo) => {
    try {
      const response = await API.markAssignedTaskImportant(todo);
      if (response.isSuccess) {
        console.log("Task marked/unmarked as Important successfully.");
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (todo) => {
    try {
      const response = await API.deleteAssignedTask(todo);
      if (response.isSuccess) {
        console.log("Task deleted successfully.");
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTasksByUser();
  }, [activePage, fetchAgain]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <div className="modal-overlay2">
        <div className="modal-content2 profile-container modal2">
          <div className="box">
            <div className="closediv">
              <IoClose className="close-icon2" onClick={onClose} />
            </div>
            <div className="btns">
              <button
                className={activePage === "profile" ? "active" : "inactive"}
                onClick={() => setActivePage("profile")}
              >
                Profile
              </button>
              <button
                className={activePage === "assign-task" ? "active" : "inactive"}
                onClick={() => setActivePage("assign-task")}
              >
                Assign Task
              </button>
            </div>
            {activePage == "profile" && (
              <div className="profile-content">
                <div className="imgdiv">
                  <img src={url} alt="Profile Photo" />
                </div>
                <div className="input-container">
                  <FaIdCard />
                  <p>{getSenderId(loggedUser, selectedChat?.users)}</p>
                </div>
                <div className="input-container">
                  <FaUserCircle />
                  <p>{getSender(loggedUser, selectedChat?.users)}</p>
                </div>
                <div className="input-container">
                  <FaPen />
                  <p>{getSenderUsername(loggedUser, selectedChat?.users)}</p>
                </div>
                <div className="input-container">
                  <MdAttachEmail />
                  <p>{getSenderEmail(loggedUser, selectedChat?.users)}</p>
                </div>
                <div className="input-container">
                  <FaUserTie />
                  <p>
                    Profession:{" "}
                    {getSenderProfession(loggedUser, selectedChat?.users)}
                  </p>
                </div>
                <p className="error">
                  Click on the 'Assign Task' button to assign a task.
                </p>
              </div>
            )}
            {activePage == "assign-task" && (
              <div className="assign-container">
                <div className="add-task">
                  <p className="intro">
                    Stay organized and achieve your goals. Start by adding your
                    tasks below to keep track of everything you need to do.
                  </p>
                  <div className="input-field">
                    <FaNoteSticky />
                    <input
                      placeholder="Give a title to your task..."
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                    />
                  </div>
                  <div className="input-field">
                    <FaPenAlt />
                    <input
                      placeholder="Give a description to your task..."
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    />
                  </div>
                  <button className="add-btn" onClick={() => assignTask()}>
                    Add task
                  </button>
                </div>
                <div className="task-list">
                  {tasks
                    .slice()
                    .reverse()
                    .map((todo) => {
                      return (
                        <div className="task-item" key={todo._id}>
                          <div className="col1">
                            <div>
                              <h4>{todo.title}</h4>
                              <p>{todo.description}</p>
                            </div>
                          </div>
                          <div className="col2">
                            <FaStar
                              className={`imp ${
                                todo.isImportant ? "icon2" : "iconn"
                              }`}
                              onClick={() => markImportant(todo)}
                            />

                            <MdDelete
                              className="dlt iconn"
                              onClick={() => deleteTask(todo)}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserModal;
