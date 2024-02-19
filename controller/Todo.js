const userDB = require("../model/user");

const controller = {
  async addTask(req, res) {
    try {
      let { task, user } = req.body;
      if (!task)
        return res
          .status(400)
          .json({ message: "Task is Required", status: false });
      if (!user)
        return res
          .status(400)
          .json({ message: "Please login again", status: false });

      // check if user exists
      const isUser = await userDB.findOne({ _id: user });
      if (!isUser)
        return res
          .status(403)
          .json({ message: "Please login again", status: false });

      // add a task to the database
      const addTask = await userDB.updateOne(
        { _id: user },
        {
          $push: {
            todo: { task, createdAt: Date.now() },
          },
        }
      );
      res.status(200).json({ message: "Task added", status: true });
    } catch (error) {
      console.log(error);
      res.status(200).json({ error, status: false });
    }
  },

  async getTasks(req, res) {
    try {
      // if there is no id then send an error message
      const { user } = req.params;
      if (!user)
        return res
          .status(400)
          .json({ message: "Please login again", status: false });

      // if user does not exists then send an error message
      const isUser = await userDB.findOne({ _id: user });
      if (!isUser)
        return res
          .status(403)
          .json({ message: "Please login again", status: false });

      let tasks = isUser.todo.sort((a, b) => b?.createdAt - a?.createdAt);
      res.status(200).json({
        tasks,
        status: true,
      });
    } catch (error) {
      res.status(500).json({ error, status: false });
    }
  },
  async deleteTask(req, res) {
    try {
      const { user, task } = req.params;
      if (!user || !task)
        return res
          .status(400)
          .json({ error: "Please login again", status: false });

      // check if user exists
      const isUser = await userDB.findOne({ _id: user });
      if (!isUser)
        return res
          .status(403)
          .json({ message: "Please login again", status: false });
      const todoItem = isUser.todo.find((todo) => todo.task, task);
      if (!todoItem)
        return res
          .status(404)
          .json({ message: "Todo item not found", status: false });
      const deleteTask =  await userDB.updateOne(
        { _id: user },
        {
          $pull: {
            todo: { task },
          },
        }
      );
      console.log(deleteTask)

      res.status(200).json({ message: "Task deleted", status: true });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error, status: false });
    }
  },
};

module.exports = controller;
