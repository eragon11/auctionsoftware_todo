import UserService from "../User/user.service";
import * as _ from 'lodash';
import sha256 from "sha256";

const UserController = {};

UserController.getAllUser = async (req, res) => {
    try {
        let emailId = req.userToken.data.email;
        let search = req.query.searchkey;
        let status = req.params.status;
        let userid = req.userToken.data.user_id;
        const users = await UserService.getAllUser(search, status, userid);

        res.status(200).send({
            code: 200,
            status: "success",
            message: "Sucessfully retrieved profile records",
            data: users
        });
    } catch (error) {
        console.log(error);
        logger.error("Error in getting User record :" + error);
        res.status(400).send({
            code: 400,
            status: "error",
            message: "Error in getting user record",
            data: []
        });
    }
};

UserController.userAdd = async (req, res) => {
    try {
        const userdetails = req.body;
        var Employee = {};
        Employee.name = req.body.name;
        Employee.city = req.body.city || '';
        Employee.email = req.body.email || '';
        Employee.gender = req.body.gender || '';
        var pass = req.body.name;
        Employee.password = sha256(pass);
        const user = await UserService.getUserAdd(Employee);
        res.send({
            code: 200,
            status: "success",
            message: "Sucessfully retrived user details",
            data: user
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            code: 400,
            status: "error",
            message: "Error in Adding User record",
            data: []
        });
    }
}

UserController.userEdit = async (req, res) => {
    try {
        const userdetails = req.body;
        const user = await UserService.getUserEdit(userdetails);
        res.send({
            code: 200,
            status: "success",
            message: "Sucessfully retrived user details",
            data: user
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            code: 400,
            status: "error",
            message: "Error in editing User record",
            data: []
        });
    }
}

UserController.userDelete = async (req, res) => {
    try {
        const userdetails = req.body.id;
        const user = await UserService.getUserDelete(userdetails);
        res.send({
            code: 200,
            status: "success",
            message: "Sucessfully make inactive user details",
            data: user
        });
    } catch (error) {
        res.status(400).send({
            code: 400,
            status: "error",
            message: "Error in Deleting User record",
            data: []
        });
    }
}

export default UserController;