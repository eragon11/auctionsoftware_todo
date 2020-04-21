import express from "express";
import Todo from './todo.controller';
import UserAuthController from "../UserAuth/userAuth.controller";

const router = express.Router();

//Get all todo data
router.get('/todo/:status', UserAuthController.verify, Todo.getAllTodo);

//todo add 
router.post('/todo/add', UserAuthController.verify, Todo.todoAdd);

//todo edit
router.post('/todo/edit', UserAuthController.verify, Todo.todoEdit);

//todo delete
router.post('/todo/delete', UserAuthController.verify, Todo.todoDelete);

export default router;