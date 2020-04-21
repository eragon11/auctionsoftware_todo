import express from "express";
import Users from './user.controller';
import UserAuthController from "../UserAuth/userAuth.controller";

const router = express.Router();

//Get all users data
router.get('/users/:status', UserAuthController.verify, Users.getAllUser);

//user add 
router.post('/user/add', UserAuthController.verify, Users.userAdd);

//user edit
router.post('/user/edit', UserAuthController.verify, Users.userEdit);

//user delete
router.post('/user/delete', UserAuthController.verify, Users.userDelete);

export default router;