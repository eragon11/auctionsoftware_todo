import Todo from "./todo.model";
import sha256 from "sha256";
var uuidv1 = require('uuid/v1');
import _ from 'lodash';

const TodoService = {};

  TodoService.getAllTodo = async (searchkey, status) => {
    try {
  
      if (searchkey) {
        var users = await Todo.find({ "task_name": { "$regex": searchkey, "$options": "i" }, "status": status }).lean();
        return users;
  
      } else {
        var users = await Todo.find({ "status": status },
    ).lean();
        return users;
  
      }
    } catch (error) {
      throw error;
    }
  };

  TodoService.getTodoAdd = async (data) => {
    try {
      console.log("new employee add")
      let userToAdd = new Todo(data);
      const savedTodo = await userToAdd.save();
      return savedTodo;
    } catch (error) {
      throw error
    }
  }

  TodoService.getTodoEdit = async (data) => {
    try {
      const savedTodo = await Todo.findByIdAndUpdate(data._id, data, { upsert: true, new: true });
      return savedTodo;
    } catch (error) {
      throw error
    }
  };

  TodoService.getTodoDelete = async (id) => {
    try {
      const savedTodo = await Todo.findByIdAndDelete(id);
      return savedTodo;
    } catch (error) {
      throw error
    }
  }

  TodoService.findalltodo = async () =>{
      try {
          const findalltodo = await Todo.find({'status':"in-progress"});
          return findalltodo
      } catch (error) {
          throw error
      }
  }

export default TodoService;  