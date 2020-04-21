import TodoService from "./todo.service";
import * as _ from 'lodash';
import sha256 from "sha256";

const TodoController = {};

TodoController.getAllTodo = async (req, res) => {
    try {
        let search = req.query.searchkey;
        let status = req.params.status;
        const todos = await TodoService.getAllTodo(search, status);

        res.status(200).send({
            code: 200,
            status: "success",
            message: "Sucessfully retrieved todo records",
            data: todos
        });
    } catch (error) {
        console.log(error);
        logger.error("Error in getting todo record :" + error);
        res.status(400).send({
            code: 400,
            status: "error",
            message: "Error in getting todo record",
            data: []
        });
    }
};

TodoController.todoAdd = async (req, res) => {
    try {
        var Todo = {};
        Todo.name = req.body.name;
        Todo.email = req.body.email;
        Todo.expiry = req.body.expirty;
        const todo = await TodoService.getTodoAdd(Todo);
        res.send({
            code: 200,
            status: "success",
            message: "Sucessfully retrived todo details",
            data: todo
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            code: 400,
            status: "error",
            message: "Error in Adding Todo record",
            data: []
        });
    }
}

TodoController.todoEdit = async (req, res) => {
    try {
        const tododetails = req.body;
        const todo = await TodoService.getTodoEdit(tododetails);
        res.send({
            code: 200,
            status: "success",
            message: "Sucessfully retrived todo details",
            data: todo
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            code: 400,
            status: "error",
            message: "Error in editing Todo record",
            data: []
        });
    }
}

TodoController.todoDelete = async (req, res) => {
    try {
        const tododetails = req.body.id;
        const todo = await TodoService.getTodoDelete(tododetails);
        res.send({
            code: 200,
            status: "success",
            message: "Sucessfully make inactive todo details",
            data: todo
        });
    } catch (error) {
        res.status(400).send({
            code: 400,
            status: "error",
            message: "Error in Deleting Todo record",
            data: []
        });
    }
}

export default TodoController;