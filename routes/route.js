import express from "express";
import {
  signupUser,
  signinUser,
  forgotPassword,
  resetPassword,
  verifyUser,
  verifyAuthentication,
  userLogout,
  getUserById,
  updateProfileById,
  getAllUsers,
} from "../controllers/user-controller.js";
import upload from "../utils/upload.js";
import {
  uploadImage,
  getImage,
  uploadFile,
} from "../controllers/image-controller.js";
import {
  accessChat,
  addToTeam,
  createTeam,
  fetchChats,
  removefromTeam,
  renameTeam,
} from "../controllers/chat-controller.js";
import { allMessages, sendMessage } from "../controllers/message-controller.js";
import {
  addTask,
  completeTask,
  deleteTask,
  getTasks,
  markImportant,
} from "../controllers/task-controller.js";
import {
  addNote,
  deleteNote,
  getAllNotes,
  markNote,
} from "../controllers/notes-controller.js";
import {
  createPoll,
  getPollById,
  votePoll,
} from "../controllers/poll-controller.js";
import {
  assignTask,
  deleteAssignedTask,
  getAssignedTasksByFilter,
  getTasksForUser,
  markAssignedTaskCompleted,
  markAssignedTaskImportant,
} from "../controllers/assign-task-controller.js";

const router = express.Router();

router.post("/auth/signup", signupUser);
router.post("/auth/signin", signinUser);
router.post("/auth/forgotPassword", forgotPassword);
router.post("/auth/resetPassword", resetPassword);
router.get("/auth/verify", verifyUser, verifyAuthentication);
router.get("/auth/logout", userLogout);
router.get("/user/details/:id", getUserById);
router.put("/user/update/:id", updateProfileById);
router.post("/file/upload", upload.single("file"), uploadImage);
router.get("/file/:filename", getImage);
router.get("/users", getAllUsers);

//task routes
router.post("/tasks/add", verifyUser, addTask);
router.delete("/tasks/delete/:taskId", verifyUser, deleteTask);
router.put("/tasks/complete/:taskId", verifyUser, completeTask);
router.put("/tasks/markImportant", verifyUser, markImportant);
router.post("/tasks/getByFilter", verifyUser, getTasks);

//chat/team routes
router.post("/chat", verifyUser, accessChat);
router.get("/chat/fetch", verifyUser, fetchChats);
router.post("/team", verifyUser, createTeam);
router.put("/team/rename", verifyUser, renameTeam);
router.put("/team/remove", verifyUser, removefromTeam);
router.put("/team/add", verifyUser, addToTeam);

//send file
router.post(
  "/message/upload/file",
  verifyUser,
  upload.single("file"),
  uploadFile
);

//notes routes
router.post("/notes/add", verifyUser, addNote);
router.get("/notes/get/:userId", verifyUser, getAllNotes);
router.put("/notes/markImportant/:noteId", verifyUser, markNote);
router.delete("/notes/delete/:noteId", verifyUser, deleteNote);

//message routes
router.post("/message/send", verifyUser, sendMessage);
router.get("/message/:chatId", verifyUser, allMessages);

//poll routes
router.post("/poll/create", verifyUser, createPoll);
router.post("/poll/vote", verifyUser, votePoll);
router.post("/poll/get", verifyUser, getPollById);

//assign-task routes
router.post("/task/assign", verifyUser, assignTask);
router.delete("/task/assigned/delete/:taskId", verifyUser, deleteAssignedTask);
router.put(
  "/task/assigned/markImportant/:taskId",
  verifyUser,
  markAssignedTaskImportant
);
router.put(
  "/task/assigned/complete/:taskId",
  verifyUser,
  markAssignedTaskCompleted
);
router.get("/tasks/assigned/get/:userId", verifyUser, getTasksForUser);
router.post("/tasks/getAssignedByFilter", verifyUser, getAssignedTasksByFilter);

export default router;
