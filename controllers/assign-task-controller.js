import AssignTask from "../models/assign-task.js";

export const assignTask = async (req, res) => {
  try {
    const { byUser, toUser, title, description } = req.body;

    const newTask = new AssignTask({
      byUser,
      toUser,
      title,
      description,
    });

    await newTask.save();
    res.status(200).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasksForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await AssignTask.find({ toUser: userId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAssignedTaskCompleted = async (req, res) => {
  try {
    const { taskId } = req.params;

    const updatedTask = await AssignTask.findByIdAndUpdate(
      taskId,
      { completed: true },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAssignedTaskImportant = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await AssignTask.findById(taskId);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    task.isImportant = !task.isImportant;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error("Error marking task as important:", error);
    res.status(500).json({ error: "Failed to mark task as important" });
  }
};

export const deleteAssignedTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await AssignTask.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignedTasksByFilter = async (req, res) => {
  try {
    const { userId, filter } = req.body;

    if (
      filter &&
      filter !== "completed" &&
      filter !== "important" &&
      filter !== ""
    ) {
      return res.status(400).json({ error: "Invalid filter parameter" });
    }

    let query = { toUser: userId };

    if (filter === "completed") {
      query.completed = true;
    } else if (filter === "important") {
      query.isImportant = true;
      query.completed = false;
    } else if (filter === "") {
      query.completed = false;
    }

    const tasks = await AssignTask.find(query).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks for user:", error);
    res.status(500).json({ error: "Failed to fetch tasks for user" });
  }
};
