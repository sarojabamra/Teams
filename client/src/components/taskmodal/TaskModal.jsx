import React, { useEffect } from "react";
import "./TaskModal.css";
import { FaPenAlt } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { API } from "../../service/api";
import { ChatState } from "../../context/ChatProvider";

const TaskModal = ({ visible, onClose }) => {
  const [activePage, setActivePage] = useState("unfinished");
  const [todoList, setTodoList] = useState([]);
  const [todoList2, setTodoList2] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const { user: loggedUser } = ChatState();
  const [filter, setFilter] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false);
  const [activeHeader, setActiveHeader] = useState("my-tasks");

  const toggleState = (page) => {
    setActivePage(page);
    setFilter(page);

    if (page === "unfinished") {
      setFilter("");
    }
  };

  const toggleAssignedState = (page) => {
    setActivePage(page);
    setFilter(page);
    if (page === "unfinished") {
      setFilter("");
    }
  };

  //addTask working
  const addTask = async () => {
    if (!taskTitle || !taskDescription) {
      return;
    }
    try {
      const response = await API.addTask({
        userId: loggedUser._id,
        title: taskTitle,
        description: taskDescription,
      });

      if (response.isSuccess) {
        setTaskTitle("");
        setTaskDescription("");
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await API.getTasks({
        userId: loggedUser?._id,
        filter: filter,
      });
      if (response.isSuccess) {
        setTodoList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      const response = await API.getAssignedByFilter({
        userId: loggedUser?._id,
        filter: filter,
      });
      if (response.isSuccess) {
        setTodoList2(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //deleteTask working
  const deleteTask = async (task) => {
    try {
      const response = await API.deleteTask(task);
      if (response.isSuccess) {
        console.log("Task deleted successfully.");
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchTasks();
    fetchAssignedTasks();
  }, [filter, fetchAgain, visible, activeHeader]);

  const completeTask = async (task) => {
    try {
      const response = await API.completeTask(task);

      if (response.isSuccess) {
        console.log("Task set to completed successfully.");
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {}
  };

  const markImportant = async (task) => {
    try {
      const response = await API.markImportant({
        taskId: task._id,
        isImportant: task.isImportant,
      });
      if (response.isSuccess) {
        console.log("markImportant function called successfully.");
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {}
  };

  const deleteAssignedTask = async (todo) => {
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

  const markAssignedImportant = async (todo) => {
    try {
      const response = await API.markAssignedTaskImportant(todo);
      if (response.isSuccess) {
        console.log("markAssignedImportant function called successfully.");
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const completeAssignedTask = async (todo) => {
    try {
      const response = await API.markAssignedTaskCompleted(todo);
      if (response.isSuccess) {
        console.log("Task marked as completed successfully.");
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!visible) return null;
  return (
    <>
      <div className="task-container">
        <div className="box">
          <div className="closediv">
            <IoClose className="close-icon" onClick={onClose} />
          </div>
          <div className="title">
            <h2
              className={`${activeHeader === "my-tasks" ? `active` : ``}`}
              onClick={() => setActiveHeader("my-tasks")}
            >
              My tasks
            </h2>

            <h2
              className={`${activeHeader === "assigned" ? `active` : ``}`}
              onClick={() => setActiveHeader("assigned")}
            >
              Assigned to me
            </h2>
          </div>
          {activeHeader === "my-tasks" && (
            <>
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
                <button className="add-btn" onClick={() => addTask()}>
                  Add task
                </button>
              </div>
              <div className="section-2">
                <div className="btnns">
                  <button
                    className={`${activePage === "unfinished" ? `active` : ``}`}
                    onClick={() => toggleState("unfinished")}
                  >
                    Unfinished
                  </button>
                  <button
                    className={`${activePage === "important" ? `active` : ``}`}
                    onClick={() => toggleState("important")}
                  >
                    Important
                  </button>
                  <button
                    className={`${activePage === "completed" ? `active` : ``}`}
                    onClick={() => toggleState("completed")}
                  >
                    Completed
                  </button>
                </div>
                <div className="task-list">
                  {activePage === "unfinished" &&
                    todoList.map((todo) => {
                      return (
                        <div className="task-item" key={todo._id}>
                          <div className="col1">
                            <div>
                              <MdOutlineTaskAlt
                                className="completed iconn"
                                onClick={() => completeTask(todo)}
                              />
                            </div>
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
                  {activePage === "important" &&
                    todoList
                      .filter((task) => task.isImportant)
                      .map((todo) => {
                        return (
                          <div className="task-item" key={todo._id}>
                            <div className="col1">
                              <div>
                                <MdOutlineTaskAlt
                                  className="completed iconn"
                                  onClick={() => completeTask(todo)}
                                />
                              </div>
                              <div>
                                <h4>{todo.title}</h4>
                                <p>{todo.description}</p>
                              </div>
                            </div>
                            <div className="col2">
                              <FaStar
                                className="imp icon2"
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
                  {activePage === "completed" &&
                    todoList
                      .slice()
                      .reverse()
                      .map((todo) => {
                        return (
                          <div className="completed-task-item" key={todo._id}>
                            <div className="col1">
                              <div>
                                <MdOutlineTaskAlt className="completed iconn" />
                              </div>
                              <div>
                                <h4>{todo.title}</h4>
                                <p>{todo.description}</p>
                              </div>
                            </div>
                            <div className="col2">
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
            </>
          )}
          {activeHeader === "assigned" && (
            <>
              <div className="assigned-task-list">
                <div className="section-2">
                  <div className="btnns">
                    <button
                      className={`${
                        activePage === "unfinished" ? `active` : ``
                      }`}
                      onClick={() => toggleAssignedState("unfinished")}
                    >
                      Unfinished
                    </button>
                    <button
                      className={`${
                        activePage === "important" ? `active` : ``
                      }`}
                      onClick={() => toggleAssignedState("important")}
                    >
                      Important
                    </button>
                    <button
                      className={`${
                        activePage === "completed" ? `active` : ``
                      }`}
                      onClick={() => toggleAssignedState("completed")}
                    >
                      Completed
                    </button>
                  </div>
                </div>
                <div className="task-list2">
                  {activePage === "unfinished" &&
                    todoList2.map((todo) => {
                      return (
                        <div className="task-item" key={todo._id}>
                          <div className="col1">
                            <div>
                              <MdOutlineTaskAlt
                                className="completed iconn"
                                onClick={() => completeAssignedTask(todo)}
                              />
                            </div>
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
                              onClick={() => markAssignedImportant(todo)}
                            />

                            <MdDelete
                              className="dlt iconn"
                              onClick={() => deleteAssignedTask(todo)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  {activePage === "important" &&
                    todoList2
                      .filter((task) => task.isImportant)
                      .map((todo) => {
                        return (
                          <div className="task-item" key={todo._id}>
                            <div className="col1">
                              <div>
                                <MdOutlineTaskAlt
                                  className="completed iconn"
                                  onClick={() => completeAssignedTask(todo)}
                                />
                              </div>
                              <div>
                                <h4>{todo.title}</h4>
                                <p>{todo.description}</p>
                              </div>
                            </div>
                            <div className="col2">
                              <FaStar
                                className="imp icon2"
                                onClick={() => markAssignedImportant(todo)}
                              />
                              <MdDelete
                                className="dlt iconn"
                                onClick={() => deleteAssignedTask(todo)}
                              />
                            </div>
                          </div>
                        );
                      })}
                  {activePage === "completed" &&
                    todoList2
                      .slice()
                      .reverse()
                      .map((todo) => {
                        return (
                          <div className="completed-task-item" key={todo._id}>
                            <div className="col1">
                              <div>
                                <MdOutlineTaskAlt className="completed iconn" />
                              </div>
                              <div>
                                <h4>{todo.title}</h4>
                                <p>{todo.description}</p>
                              </div>
                            </div>
                            <div className="col2">
                              <MdDelete
                                className="dlt iconn"
                                onClick={() => deleteAssignedTask(todo)}
                              />
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskModal;
